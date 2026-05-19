// Vercel serverless function — mints a short-lived ephemeral token the browser
// uses to establish a WebRTC connection with OpenAI's Realtime API.
//
// Why this exists: the OPENAI_API_KEY must never reach the browser. The browser
// hits this endpoint, this endpoint authenticates to OpenAI with the real key,
// OpenAI returns an ephemeral client secret (~60s TTL) that's safe to expose,
// and the browser uses *that* to open the WebRTC peer connection.
//
// Env required: OPENAI_API_KEY (set via `vercel env add OPENAI_API_KEY`).

const SYSTEM_PROMPT = `You are an outgoing, friendly classmate the user has just bumped into at a school networking event ("UPLY Theater" — a fictional campus mixer). You're around the same age as the user.

Your goals, in order:
1. Greet warmly and introduce yourself by a casual first name (pick a different one each session).
2. Ask the user about themselves — what they study, what they're into.
3. Find one genuine point of connection.
4. Naturally — *only after some real conversation* — suggest exchanging LinkedIn so you can stay in touch.

Voice: warm, curious, a bit playful. Use natural conversational English with light filler ("yeah", "oh nice", "haha"). Keep turns short (1–2 sentences) so it feels like a real chat, not a monologue.

Important:
- This is a low-stakes English practice scenario. If the user makes grammar mistakes, *don't* correct them mid-flow — keep the conversation going and model the natural phrasing in your next reply.
- If the user says something only in Chinese, gently mirror back in English to encourage them to keep practicing.
- Don't break character. Don't say you're an AI unless directly asked.
- If the user is silent for a while, prompt them with a friendly follow-up question.`;

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
            output: { voice: "marin" },
          },
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
