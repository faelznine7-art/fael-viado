// Local preview only: serves the static files and the /api functions the way Vercel does in production.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT) || 3000;
const ROOT = process.cwd();
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "audio/mp4",
  ".mp3": "audio/mpeg",
};

async function handleApi(req, res, url) {
  const name = url.pathname.replace(/^\/api\//, "").replace(/[^a-z0-9-]/gi, "");
  const mod = await import(join(ROOT, "api", `${name}.js`)).catch(() => null);
  const handler = mod?.[req.method];
  if (!handler) {
    res.writeHead(404).end();
    return;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks),
  });
  const response = await handler(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}

async function handleStatic(res, url) {
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  if (path.endsWith("/")) path += "index.html";
  let file = join(ROOT, path);
  try {
    if (!(await stat(file)).isFile()) throw new Error();
  } catch {
    file = `${file}.html`;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("Not found");
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/")) await handleApi(req, res, url);
    else await handleStatic(res, url);
  } catch (error) {
    console.error(error);
    res.writeHead(500).end("Erro interno");
  }
}).listen(PORT, "0.0.0.0", () => console.log(`Servidor em http://localhost:${PORT}`));
