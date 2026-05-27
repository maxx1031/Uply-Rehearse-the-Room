function extUpper(name, mime) {
  const fromName = typeof name === "string" && name.includes(".")
    ? name.split(".").pop()
    : "";
  const fromMime = typeof mime === "string" && mime.includes("/")
    ? mime.split("/").pop()
    : "";
  return (fromName || fromMime || "FILE").toUpperCase();
}

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

function buildUserPrompt(userMessage, file) {
  const lines = [];
  lines.push("You are a concise networking and academic outreach coach.");
  lines.push("Analyze the uploaded content and answer in plain English.");
  lines.push("Output format:");
  lines.push("1) One-line judgment");
  lines.push("2) 2-3 concrete improvements");
  lines.push("3) A polished draft the user can send");
  lines.push("");
  if (userMessage) {
    lines.push(`User context: ${userMessage}`);
    lines.push("");
  }
  lines.push(`File name: ${file?.name || "unknown"}`);
  lines.push(`File type: ${file?.type || "unknown"}`);
  lines.push(`File size bytes: ${file?.size ?? 0}`);
  return lines.join("\n");
}

function buildMultiFilePrompt(userMessage, files) {
  const lines = [];
  lines.push("You are a concise networking and academic outreach coach.");
  lines.push("Analyze all uploaded files together and answer in plain English.");
  lines.push("Mimic this style: direct answer first, practical next steps second, polished draft third.");
  lines.push("Output format:");
  lines.push("1) One-line overall judgment");
  lines.push("2) 3-5 concrete improvements");
  lines.push("3) One polished draft the user can send");
  lines.push("");
  if (userMessage) {
    lines.push(`User context: ${userMessage}`);
    lines.push("");
  }
  lines.push(`File count: ${files.length}`);
  files.forEach((file, idx) => {
    lines.push(`${idx + 1}. ${file?.name || "unknown"} | ${file?.type || "unknown"} | ${file?.size ?? 0} bytes`);
  });
  return lines.join("\n");
}

async function uploadFileToOpenAI(apiKey, file) {
  const mime = file.type || "application/octet-stream";
  const binary = Buffer.from(file.base64, "base64");
  const blob = new Blob([binary], { type: mime });
  const form = new FormData();
  form.append("purpose", "user_data");
  form.append("file", blob, file.name || "upload.bin");

  const response = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`File upload failed ${response.status}: ${text.slice(0, 220)}`);
  }
  const data = await response.json();
  return typeof data?.id === "string" ? data.id : null;
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
    const userMessage = typeof body.userMessage === "string" ? body.userMessage.trim() : "";
    const filesRaw = Array.isArray(body.files)
      ? body.files
      : body.file && typeof body.file === "object"
        ? [body.file]
        : [];
    const files = filesRaw
      .filter((f) => f && typeof f === "object" && typeof f.base64 === "string" && f.base64.length > 0)
      .slice(0, 6);
    if (!files.length) {
      res.status(400).json({ error: "Missing file payload" });
      return;
    }

    const model = process.env.OPENAI_REVIEW_MODEL || "gpt-4o-mini";

    const content = [{ type: "input_text", text: buildMultiFilePrompt(userMessage, files) }];
    for (const file of files) {
      const mime = file.type || "application/octet-stream";
      if (mime.startsWith("image/")) {
        content.push({ type: "input_image", image_url: `data:${mime};base64,${file.base64}` });
        continue;
      }
      let fileId = null;
      try {
        fileId = await uploadFileToOpenAI(apiKey, file);
      } catch {
        fileId = null;
      }
      if (fileId) {
        content.push({ type: "input_file", file_id: fileId });
      } else {
        const fallbackSnippet = file.base64.slice(0, 30000);
        content.push({
          type: "input_text",
          text:
            `Fallback bytes for ${file.name || "unknown"} (truncated):\n${fallbackSnippet}\n\n` +
            "If this file is incomplete, mention uncertainty briefly.",
        });
      }
    }
    const input = [{ role: "user", content }];

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input,
        max_output_tokens: 450,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(upstream.status).json({
        error: "OpenAI review request failed",
        upstreamStatus: upstream.status,
        upstreamBody: text.slice(0, 500),
      });
      return;
    }

    const data = await upstream.json();
    const advice = extractOutputText(data);
    if (!advice) {
      res.status(200).json({
        advice:
          "That is a positive sign. Please share your exact goal, tone check, rewrite, or reply draft, and I will refine it in one pass.",
        model,
        fileLabel: `${files.length} file(s) uploaded`,
      });
      return;
    }

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      advice,
      model,
      fileLabel: `${files.length} file(s) uploaded`,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
