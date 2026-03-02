const GEDISA_HOST = "https://api.gedisa.com.br";

function normalizeQuery(query: Record<string, unknown>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (key === "path" || value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, String(item));
      }
      continue;
    }

    params.append(key, String(value));
  }

  return params.toString();
}

export default async function handler(req: any, res: any) {
  const method = req.method || "GET";

  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const pathParts = Array.isArray(req.query?.path)
    ? req.query.path
    : req.query?.path
      ? [req.query.path]
      : [];

  const targetPath = `/${pathParts.join("/")}`;

  if (!targetPath.startsWith("/interno/api/v1/")) {
    return res.status(400).json({ message: "Invalid proxy path" });
  }

  const queryString = normalizeQuery(req.query || {});
  const targetUrl = `${GEDISA_HOST}${targetPath}${queryString ? `?${queryString}` : ""}`;

  try {
    const body = method === "GET" || method === "DELETE"
      ? undefined
      : typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body || {});

    const upstream = await fetch(targetUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body,
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const text = await upstream.text();

    res.status(upstream.status);
    res.setHeader("Content-Type", contentType);

    if (!text) {
      return res.end();
    }

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
