const GEDISA_URL = "https://api.gedisa.com.br/interno/api/v1/valida-codigo-vendedor";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const upstream = await fetch(GEDISA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: typeof req.body === "string" ? req.body : JSON.stringify(req.body || {}),
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const text = await upstream.text();

    res.status(upstream.status);
    res.setHeader("Content-Type", contentType);

    if (!text) return res.end();

    if (contentType.includes("application/json")) {
      try {
        return res.json(JSON.parse(text));
      } catch {
        return res.send(text);
      }
    }

    return res.send(text);
  } catch {
    return res.status(502).json({
      status: "error",
      message: "Falha ao comunicar com a API da Gedisa",
    });
  }
}
