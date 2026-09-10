import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
// Sirve únicamente la mesa de revisión local. configureServer nunca entra en el build estático.
export function browserQA(base) {
  return {
    name: 'colombia-clara-local-review',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url, 'http://localhost').pathname;
        const prefixes = [base + '__qa/', '/__qa/'];
        const prefix = prefixes.find((p) => pathname.startsWith(p));
        if (!prefix) return next();
        try {
          const root = path.resolve('.generated/public/__qa');
          let file = path.resolve(root, decodeURIComponent(pathname.slice(prefix.length)) || '.');
          if (file !== root && !file.startsWith(root + path.sep)) return next();
          if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
          const types = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.woff2': 'font/woff2',
            '.webp': 'image/webp',
            '.png': 'image/png',
            '.svg': 'image/svg+xml',
            '.xml': 'application/xml',
          };
          const data = await readFile(file);
          res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
          res.setHeader('Content-Length', data.length);
          res.setHeader('Cache-Control', 'no-store');
          res.end(data);
        } catch {
          res.statusCode = 404;
          res.end('Recurso de revisión inexistente.');
        }
      });
    },
  };
}
