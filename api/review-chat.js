function extractOutputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  const chunks = [];
  const outputs = Array.isArray(data?.output) ? data.output : [];
  for (const out of outputs) {
    const content = Array.isArray(out?.content) ? out.content : [];
    for (const item of content) {
      if (typeof item?.text === "string" && item.text.trim()) {
        chunks.push(item.text.trim());
      } else if (typeof item?.value === "string" && item.value.trim()) {
        chunks.push(item.value.trim());
      }
    }
  }
  return chunks.join("\n\n").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPEN_AI_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "OPENAI_API_KEY not configured" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const target = typeof body.target === "string" ? body.target : "Contact";
    const location = typeof body.location === "string" ? body.location : "LinkedIn";
    const title = typeof body.title === "string" ? body.title : "Review chat";
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const turns = messages
      .filter((m) => m && typeof m === "object" && typeof m.text === "string")
      .slice(-16);

    const model = process.env.OPENAI_REVIEW_MODEL || "gpt-4o-mini";
    const systemPrompt =
      "You are a concise communication coach for networking and academic outreach. " +
      "Mimic this style: direct answer first, then 1-2 practical suggestions, then a polished message draft when asked. " +
      "Keep replies specific and concrete, not generic. Keep to 3 short paragraphs max.";

    const transcript = turns
      .map((m) => `${m.role === "user" ? "User" : "Coach"}: ${m.text}`)
      .join("\n");

    const input = [
      {
        role: "system",
        content: [{ type: "input_text", text: systemPrompt }],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text:
              `Context: ${title} | Target: ${target} | Channel: ${location}\n\n` +
              `Conversation so far:\n${transcript}\n\n` +
              "Now respond as the coach to the latest user message.",
          },
        ],
      },
    ];

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input,
        max_output_tokens: 350,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(upstream.status).json({
        error: "OpenAI review-chat request failed",
        upstreamStatus: upstream.status,
        upstreamBody: text.slice(0, 500),
      });
      return;
    }

    const data = await upstream.json();
    const reply = extractOutputText(data);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      reply: reply || "That is a positive sign. If you share your exact draft, I can rewrite it in a warmer and more professional tone.",
      model,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
