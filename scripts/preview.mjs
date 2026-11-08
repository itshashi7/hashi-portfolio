// Serves the static export (out/) under the same base path GitHub Pages uses, with gzip.
// Usage: npm run serve  →  http://localhost:4173/hashi-portfolio/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const BASE = "/hashi-portfolio";
const root = path.resolve("out");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml",
  ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".pdf": "application/pdf",
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/" || url.pathname === BASE) return res.writeHead(302, { location: `${BASE}/` }).end();
    if (!url.pathname.startsWith(`${BASE}/`)) return res.writeHead(404).end("Not found (the site lives under /hashi-portfolio/)");
    let file = path.join(root, decodeURIComponent(url.pathname.slice(BASE.length)));
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      const nf = path.join(root, "404.html");
      return res.writeHead(404, { "content-type": types[".html"] }).end(fs.existsSync(nf) ? fs.readFileSync(nf) : "Not found");
    }
    const type = types[path.extname(file)] || "application/octet-stream";
    const body = fs.readFileSync(file);
    if (/text|javascript|xml|svg/.test(type) && /gzip/.test(req.headers["accept-encoding"] || "")) {
      res.writeHead(200, { "content-type": type, "content-encoding": "gzip", vary: "accept-encoding" });
      return res.end(zlib.gzipSync(body));
    }
    res.writeHead(200, { "content-type": type });
    res.end(body);
  })
  .listen(port, () => console.log(`Preview: http://localhost:${port}${BASE}/`));
