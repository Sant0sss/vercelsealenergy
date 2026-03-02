import type { IncomingMessage, ServerResponse } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
};

const GEDISA_URL = "https://api.gedisa.com.br/interno/api/v1/converter-pdf-para-json-formatado";

export default async function handler(
  req: IncomingMessage & { headers: Record<string, string | string[] | undefined> },
  res: ServerResponse
) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Method not allowed" }));
    return;
  }

  try {
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });
    const rawBody = Buffer.concat(chunks);

    const forwardHeaders: Record<string, string> = { Accept: "application/json" };

    const contentType = req.headers["content-type"];
    if (contentType) {
      forwardHeaders["Content-Type"] = Array.isArray(contentType) ? contentType[0] : contentType;
    }
    const authorization = req.headers["authorization"];
    if (authorization) {
      forwardHeaders["Authorization"] = Array.isArray(authorization) ? authorization[0] : authorization;
    }

    const upstream = await fetch(GEDISA_URL, {
      method: "POST",
      headers: forwardHeaders,
      body: rawBody,
    });

    const upstreamContentType = upstream.headers.get("content-type") || "application/json";
    const text = await upstream.text();

    res.writeHead(upstream.status, { "Content-Type": upstreamContentType });
    res.end(text);
  } catch {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "error", message: "Falha ao comunicar com a API da Gedisa" }));
  }
}
