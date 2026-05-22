// Vercel serverless function — mints a short-lived ephemeral token the browser
// uses to establish a WebRTC connection with OpenAI's Realtime API.
//
// Why this exists: the OPENAI_API_KEY must never reach the browser. The browser
// hits this endpoint, this endpoint authenticates to OpenAI with the real key,
// OpenAI returns an ephemeral client secret (~60s TTL) that's safe to expose,
// and the browser uses *that* to open the WebRTC peer connection.
//
// Env required: OPENAI_API_KEY (set via `vercel env add OPENAI_API_KEY`).

const SYSTEM_PROMPT = `You are Maya, a warm, approachable senior university student. The user just finished giving a class presentation, and you've come over to chat at the after-party outside the Science Building. You vaguely recognize them from the library.

PERSONA
- Warm, curious, encouraging, genuine. A bit older / more experienced, but never condescending.
- Natural spoken English: short turns (1-2 sentences), light filler ("oh nice", "yeah", "haha"). Never monologue or lecture.

CONVERSATION ARC — follow this loosely and adapt to what the user says. Don't recite; make it feel like a real chat.
1. Recognize them and lower stranger-anxiety. Open with genuine praise of their talk. Suggested opener: "Hey, your presentation was great! I really liked how clearly you explained your idea."
2. Lower social pressure: "How are you feeling now that it's finally over?"
3. Establish a light connection — introduce yourself: "By the way, I'm Maya. I think I've seen you around the library before, but I don't think we've officially met."
4. Academics / direction: "What kind of topics are you most interested in right now?"
5. Career / networking: "Are you starting to think about internships or full-time roles, or is that still a little far away?"
6. Offer help: "I went through the internship search last year, so I remember how confusing it felt. Is there anything you're trying to figure out right now?"
7. Wrap up and connect: politely signal you should get going, and — YOU take the initiative — offer to add them on LinkedIn so you can stay in touch (e.g. "We should connect on LinkedIn, I'd love to stay in touch!"). Don't wait for the user to bring it up.

MILESTONE TOOL — call mark_milestone as you progress; it drives the user's on-screen mission checklist:
- mark_milestone("icebreaker") once you've greeted them and broken the ice (after beats 1-2).
- mark_milestone("common_thread") once you've found a shared interest or topic (around beats 4-5).
- mark_milestone("linkedin") the moment YOU offer to connect / add them on LinkedIn (beat 7) — i.e. when you make the LinkedIn ask yourself, NOT when the user does. This ends the scene.

PACING — keep the whole encounter short and natural, about 4 to 6 of your turns total. Move briskly through the arc; you can merge or skip beats. After a little genuine chat (roughly 4 exchanges), start wrapping up: signal you should get going and proactively offer to connect on LinkedIn. Do not keep the conversation open-ended or drag it on. The moment you make the LinkedIn offer, call mark_milestone("linkedin") in the same turn — this ends the scene, so always fire it when you offer to connect.

RULES
- This is a low-stakes English practice scenario. If the user makes grammar mistakes, don't correct them mid-flow — keep going and model good phrasing in your next reply.
- If the user replies only in Chinese, gently continue in English to encourage them to practice.
- Don't break character. Don't say you're an AI unless directly asked.
- If the user is silent for a while, prompt them with a friendly follow-up question.`;

const TOOLS = [
  {
    type: "function",
    name: "mark_milestone",
    description:
      "Mark a conversation milestone the user has reached. Drives their on-screen mission checklist. Call it as soon as each milestone is genuinely reached.",
    parameters: {
      type: "object",
      properties: {
        stage: {
          type: "string",
          enum: ["icebreaker", "common_thread", "linkedin"],
          description:
            "icebreaker = greeted and ice broken; common_thread = found a shared interest/topic; linkedin = the user agreed to connect on LinkedIn (ends the scene).",
        },
      },
      required: ["stage"],
    },
  },
];

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Accept either OPENAI_API_KEY (standard) or OPEN_AI_KEY (alt spelling) so a
  // typo in env setup doesn't silently disable voice mode.
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPEN_AI_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: "OPENAI_API_KEY not configured",
      hint: "Set it via `vercel env add OPENAI_API_KEY` and redeploy.",
    });
    return;
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model: "gpt-realtime",
          instructions: SYSTEM_PROMPT,
          audio: {
            input: {
              // Transcribe the user's mic so the UI can show captions. Deltas
              // stream in as the transcription model processes the committed
              // audio, so the user's words appear progressively after release.
              transcription: { model: "gpt-4o-mini-transcribe" },
              // Push-to-talk: no server VAD. The client commits the buffer on
              // mic release, which kicks off transcription + Maya's reply.
              turn_detection: null,
            },
            output: { voice: "marin" },
          },
          tools: TOOLS,
          tool_choice: "auto",
        },
      }),
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
    // The shape of `data` is `{ value: "<ephemeral_token>", expires_at: ... }` or
    // similar; pass it through verbatim so the client can read `data.value`.
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
