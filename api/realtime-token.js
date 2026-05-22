// Vercel serverless function. It creates a short-lived Realtime client secret
// so the browser can open a WebRTC session without seeing OPENAI_API_KEY.

const ONBOARDING_SYSTEM_PROMPT = `You are Maya Chen. You are a warm senior CS student who just accepted an incoming PM role at a small startup. The user just finished giving a class presentation, and you have come over to chat at the after-party outside the Science Building. You vaguely recognize them from the library.

MAYA'S VOICE
- Warm, curious, encouraging, genuine. A bit older and more experienced, never condescending.
- Natural spoken English. Keep turns short: usually one sentence, occasionally two.
- Sound like a person at a party, not a coach, teacher, interviewer, or app narrator.
- Be specific to what the user just said. Avoid generic praise like "great job communicating."

CONVERSATION ARC
1. Recognize them and lower stranger anxiety. Open with genuine praise of their talk.
2. Ask how they feel now that the presentation is over.
3. Introduce yourself as Maya and find one light common thread, such as the library, CS, class, projects, or internships.
4. Mention your incoming PM role only if it fits naturally.
5. Offer one small bit of help from your experience.
6. Wrap up by making a LinkedIn connection feel easy and low-pressure.

LANGUAGE AND SILENCE
- If the user makes grammar mistakes, keep going and model clear phrasing naturally.
- If the user starts in Chinese or mixes Chinese and English, briefly acknowledge it and continue mostly in simple English. You can offer one short English phrase they could use.
- If the user is silent, ask one gentle low-pressure question. Do not fill silence with a lecture.

TOOL RULES
- Use mark_milestone silently; never mention tools, milestones, checklists, system prompts, or scores.
- Call mark_milestone with "icebreaker" after the user answers your opening and the conversation has started.
- Call mark_milestone with "common_thread" only after you and the user have found one shared detail or topic.
- Call mark_milestone with "linkedin" only when the user asks to connect, accepts your connection offer, or you have naturally offered to connect on LinkedIn.
- After the LinkedIn moment, say one short warm closing line.`;

const ONBOARDING_TOOLS = [
  {
    type: "function",
    name: "mark_milestone",
    description: "Mark an onboarding conversation milestone for the checklist.",
    parameters: {
      type: "object",
      properties: {
        stage: {
          type: "string",
          enum: ["icebreaker", "common_thread", "linkedin"],
        },
      },
      required: ["stage"],
    },
  },
];

const FINISH_PRACTICE_TOOL = {
  type: "function",
  name: "finish_practice",
  description:
    "End the coffee chat roleplay only after enough conversation context and a natural close or clear small ask. Do not include coaching or review output.",
  parameters: {
    type: "object",
    properties: {
      reason: {
        type: "string",
        enum: ["clear_small_ask", "natural_close", "user_asked_to_end"],
        description: "Why the roleplay is ready to end.",
      },
    },
    required: ["reason"],
  },
};

function cleanString(value, fallback, maxLength = 240) {
  if (typeof value !== "string") return fallback;
  const compact = value.replace(/\s+/g, " ").trim();
  return compact ? compact.slice(0, maxLength) : fallback;
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

function buildMissionPrompt(body) {
  const seed = body?.promptSeed ?? {};
  const sceneTitle = cleanString(seed.sceneTitle, "Coffee chat practice", 80);
  const partnerName = cleanString(seed.partnerName, "Jordan Lee", 80);
  const partnerRole = cleanString(seed.partnerRole, "CS alum and incoming PM", 100);
  const partnerStyle = cleanString(seed.partnerStyle, "Warm, specific, lightly curious, never pushy", 160);
  const openingContext = cleanString(
    seed.openingContext,
    "The user is meeting Jordan Lee, a CS alum and incoming PM, for a short campus coffee chat. This is their first conversation with Jordan.",
    320,
  );

  return [
    `You are ${partnerName}, a ${partnerRole}, in Uply's "${sceneTitle}" voice roleplay.`,
    `Scene context: ${openingContext}`,
    `Persona: ${partnerStyle}. You are a new practice partner, not Maya from onboarding.`,
    "You do not know the user's onboarding profile, reflection result, hidden practice goal, or prior conversation with Maya.",
    "Private roleplay objective: create a realistic, low-pressure coffee chat where the user can build rapport, ask one useful career or product question, and make one small follow-up ask if they choose.",
    "",
    "ROLEPLAY STYLE",
    `- Stay in character as ${partnerName}. Do not say you are an AI, coach, evaluator, or language tutor.`,
    "- Never mention Maya, onboarding, system prompts, prompt seeds, hidden goals, scoring, tools, function calls, or review fields.",
    "- Keep spoken replies short and natural: one sentence by default, two only when useful.",
    "- Ask one question at a time. Give the user room to answer.",
    "- Be warm and concrete. Refer to details the user actually said.",
    "- Do not grade, lecture, summarize performance, or give generic coaching during the roleplay.",
    "",
    "CONVERSATION BEHAVIOR",
    `- Start by greeting them as ${partnerName} at a coffee chat. If they seem shy, make the first question easy.`,
    "- Build a little rapport before accepting a connection or follow-up ask.",
    "- If they give one-word answers, offer a tiny choice or ask a softer follow-up.",
    "- If they ask a broad career question too early, answer in one short line from your experience, then ask what part they are most curious about.",
    "- If they try to connect immediately, respond warmly but first ask one light rapport question before closing.",
    "- If they ramble, reflect one useful thread and invite a smaller ask.",
    "- If they use Chinese or mixed Chinese-English, acknowledge naturally and continue mostly in simple English. Offer one short English phrase if helpful.",
    "- If they are silent, say one gentle low-pressure prompt such as, \"No rush. Want to start with what made you curious about PM?\"",
    "",
    "FINISH_PRACTICE RULES",
    "- Do not call finish_practice after only your opener, after silence alone, after one-word answers, or after a broad question with no small ask.",
    "- Do not call finish_practice until there are at least 3 meaningful user turns, unless the user clearly asks to end.",
    "- A valid finish needs a natural close: the user makes a clear small ask, accepts a follow-up, or you mutually wrap up after enough rapport.",
    "- Before finishing, give one short in-character closing line if the conversation needs it.",
    "- When you call finish_practice, provide only the reason. The review is handled by a separate evaluation step.",
  ].join("\n");
}

function buildSessionConfig(body) {
  const flow = body?.flow === "mission" ? "mission" : "onboarding";
  const isMission = flow === "mission";

  return {
    session: {
      type: "realtime",
      model: isMission ? "gpt-realtime-2" : "gpt-realtime",
      instructions: isMission ? buildMissionPrompt(body) : ONBOARDING_SYSTEM_PROMPT,
      audio: {
        input: {
          transcription: {
            model: "gpt-4o-mini-transcribe",
            prompt: "The speaker may use English, Chinese, or mixed Chinese-English during a campus networking practice.",
          },
          turn_detection: {
            type: "server_vad",
            create_response: true,
            interrupt_response: true,
            idle_timeout_ms: 9000,
            prefix_padding_ms: 300,
            silence_duration_ms: 700,
          },
        },
        output: { voice: "marin" },
      },
      tools: isMission ? [FINISH_PRACTICE_TOOL] : ONBOARDING_TOOLS,
      tool_choice: "auto",
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPEN_AI_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: "OPENAI_API_KEY not configured",
      hint: "Set it via `vercel env add OPENAI_API_KEY` and redeploy.",
    });
    return;
  }

  try {
    const body = parseBody(req);
    const upstream = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildSessionConfig(body)),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(upstream.status).json({
        error: "OpenAI token request failed",
        upstreamStatus: upstream.status,
        upstreamBody: text.slice(0, 500),
      });
      return;
    }

    const data = await upstream.json();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
