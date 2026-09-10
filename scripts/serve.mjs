import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const root = path.resolve(process.argv[2] || 'dist');
const port = Number(process.env.PORT || 4321);
let compiledBase = '/';
try {
  compiledBase = JSON.parse(await readFile('.generated/model.json', 'utf8')).base;
} catch {}
const base = process.env.CC_BASE_PATH || compiledBase;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!pathname.startsWith(base)) throw Error('404');
    let file = path.resolve(root, '.' + ('/' + pathname.slice(base.length)).replace(/\/+/g, '/'));
    if (!file.startsWith(root + path.sep) && file !== root) throw Error('404');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    let bytes = await readFile(file);
    const ext = path.extname(file);
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    if (
      /gzip/.test(req.headers['accept-encoding'] || '') &&
      ['.html', '.css', '.js', '.json', '.xml', '.svg'].includes(ext)
    ) {
      bytes = gzipSync(bytes);
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
    }
    res.setHeader('Content-Length', bytes.length);
    res.end(bytes);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    try {
      res.end(await readFile(path.join(root, '404.html')));
    } catch {
      res.end('No encontrado');
    }
  }
}).listen(port, '0.0.0.0', () =>
  console.log(`Salida estática servida en puerto ${port}, prefijo ${base}. Sin fallback SPA.`),
);
