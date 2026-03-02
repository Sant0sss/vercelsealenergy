// Edge Runtime: timeout 30s no Vercel Hobby (vs 10s no Node.js runtime)
export const runtime = "edge";

const GEDISA_URL = "https://api.gedisa.com.br/interno/api/v1/converter-pdf-para-json-formatado";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.text();

    const forwardHeaders: Record<string, string> = { Accept: "application/json" };
    const contentType = req.headers.get("content-type");
    if (contentType) forwardHeaders["Content-Type"] = contentType;
    const authorization = req.headers.get("authorization");
    if (authorization) forwardHeaders["Authorization"] = authorization;

    const upstream = await fetch(GEDISA_URL, {
      method: "POST",
      headers: forwardHeaders,
      body,
    });

    const upstreamContentType = upstream.headers.get("content-type") || "application/json";
    const text = await upstream.text();

    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": upstreamContentType },
    });
  } catch {
    return new Response(
      JSON.stringify({ status: "error", message: "Falha ao comunicar com a API da Gedisa" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
