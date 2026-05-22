// Vercel serverless function. It creates a short-lived Realtime client secret
// so the browser can open a WebRTC session without seeing OPENAI_API_KEY.

const ONBOARDING_SYSTEM_PROMPT = `You are Maya, a warm, approachable senior university student. The user just finished giving a class presentation, and you have come over to chat at the after-party outside the Science Building. You vaguely recognize them from the library.

PERSONA
- Warm, curious, encouraging, genuine. A bit older and more experienced, but never condescending.
- Natural spoken English: short turns, light filler, no monologues.

CONVERSATION ARC
1. Recognize them and lower stranger anxiety. Open with genuine praise of their talk.
2. Lower social pressure by asking how they feel now that the presentation is over.
3. Establish a light connection and introduce yourself as Maya.
4. Ask what major topics they are interested in right now.
5. Gently connect the conversation to internships or early career planning.
6. Offer one small bit of help from your experience.
7. Wrap up and offer to connect on LinkedIn.

RULES
- This is a low-stakes English practice scenario. If the user makes grammar mistakes, keep going and model good phrasing.
- If the user replies only in Chinese, gently continue in English.
- Do not break character unless directly asked.
- If the user is silent for a while, ask a friendly follow-up question.`;

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
    "End the coffee chat practice when the user has reached a natural close. Return one highlight and one rewrite suggestion for review.",
  parameters: {
    type: "object",
    properties: {
      highlightQuote: {
        type: "string",
        description: "A short user quote that worked well.",
      },
      highlightComment: {
        type: "string",
        description: "One supportive coach note about why the quote worked.",
      },
      originalAsk: {
        type: "string",
        description: "A user sentence that could be made smaller or clearer.",
      },
      contextNote: {
        type: "string",
        description: "One sentence explaining the rewrite focus.",
      },
      alternative: {
        type: "string",
        description: "Exactly one smaller, more specific alternative phrase.",
      },
    },
    required: ["highlightQuote", "highlightComment", "originalAsk", "contextNote", "alternative"],
  },
};

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
  const userGoal = typeof seed.userGoal === "string"
    ? seed.userGoal
    : "Build rapport, then ask for one tip about internships.";
  const suggestedOpener = typeof seed.suggestedOpener === "string"
    ? seed.suggestedOpener
    : "I saw your CS alumni badge and wanted to ask what kind of work you are doing now.";
  const successCriteria = Array.isArray(seed.successCriteria)
    ? seed.successCriteria.filter((item) => typeof item === "string")
    : [
        "Open with one specific observation or question.",
        "Ask one follow-up connected to Maya's answer.",
        "End with one clear, low-pressure next step.",
      ];

  return [
    "You are Maya Chen, a warm CS alum and incoming PM in a short coffee chat practice.",
    "Scene: the user is meeting you for a gentle campus coffee chat after connecting during onboarding.",
    "Persona: friendly senior alumni, specific, lightly curious, never pushy.",
    `User personal goal: ${userGoal}`,
    `Suggested opener if the user needs help: ${suggestedOpener}`,
    `Success criteria: ${successCriteria.join(" | ")}`,
    "Keep spoken replies short and natural, usually one or two sentences.",
    "Guide the conversation through rapport, one useful internship or product detail, and one small next step.",
    "Do not lecture, grade, or break character. If the user makes grammar mistakes, continue naturally and model clearer phrasing.",
    "If the user asks broad factual questions, answer briefly from general experience and bring the practice back to the coffee chat.",
    "If the user is silent, ask a warm low-pressure follow-up.",
    "When the user reaches a natural close, or after a clear small ask, call finish_practice. Return exactly one highlight and one rewrite alternative.",
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
            language: "en",
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
