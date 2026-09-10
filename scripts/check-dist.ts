import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { model } from '../src/build/get-model';
const root = path.resolve(process.env['CC_DEMO'] === '1' ? 'dist-demo' : 'dist');
const html = new Map<string, ReturnType<typeof load>>();
const files: string[] = [];
async function walk(dir: string) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) await walk(f);
    else files.push(f);
  }
}
await walk(root);
for (const file of files) {
  if (/\.(html|json|js|xml|txt|css|svg)$/.test(file)) {
    const text = await readFile(file, 'utf8');
    if (text.includes('BORRADOR_NO_PUBLICAR_7f83') && !process.env['CC_INCLUDE_DRAFTS'])
      throw Error(`Borrador filtrado a la salida: ${file}`);
    if (process.env['CC_DEMO'] !== '1' && /Autoría de demostración|src-demo-|pub-demo-/.test(text))
      throw Error(`Fixture sintético en producción: ${file}`);
    if (file.endsWith('.html')) html.set(file, load(text));
  }
}
async function target(url: URL) {
  if (!url.pathname.startsWith(model.base))
    throw Error(`URL sin prefijo ${model.base}: ${url.pathname}`);
  let file = path.resolve(root, url.pathname.slice(model.base.length));
  if (!file.startsWith(root + path.sep) && file !== root)
    throw Error(`Ruta fuera de dist: ${url.pathname}`);
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    await stat(file);
  } catch {
    throw Error(`Archivo inexistente: ${url.pathname}`);
  }
  if (url.hash && html.has(file)) {
    const id = decodeURIComponent(url.hash.slice(1));
    if (
      !html.get(file)!('[id]')
        .toArray()
        .some((e) => html.get(file)!(e).attr('id') === id)
    )
      throw Error(`Ancla inexistente: ${url.pathname}${url.hash}`);
  }
  return file;
}
for (const [file, $] of html) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  const pageUrl = new URL(model.base + relative.replace(/index\.html$/, ''), model.origin);
  const ids = $('[id]')
    .toArray()
    .map((e) => $(e).attr('id'));
  if (ids.length !== new Set(ids).size) throw Error(`IDs repetidos en ${file}`);
  for (const e of $('[href],[src],[srcset],[component-url],[renderer-url]').toArray()) {
    const values = ['href', 'src', 'component-url', 'renderer-url']
      .map((a) => $(e).attr(a))
      .filter((x): x is string => !!x);
    const srcset = $(e).attr('srcset');
    if (srcset) values.push(...srcset.split(',').map((v) => v.trim().split(' ')[0]));
    for (const value of values) {
      if (/^(data:|mailto:|tel:)/.test(value)) continue;
      const u = new URL(value, pageUrl);
      if (u.origin === model.origin) await target(u);
    }
  }
  if (!$('h1').length && !$('meta[http-equiv=refresh]').length) throw Error(`Falta h1: ${file}`);
  const image = $('meta[property="og:image"]').attr('content');
  if (image) await target(new URL(image));
  for (const match of $.html().matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    if (match[1].startsWith('data:')) continue;
    const u = new URL(match[1], pageUrl);
    if (u.origin === model.origin) await target(u);
  }
}
for (const filename of ['sitemap.xml', 'rss.xml']) {
  const $ = load(await readFile(path.join(root, filename), 'utf8'), { xmlMode: true });
  for (const e of $('loc,link,guid').toArray()) {
    const value = $(e).text();
    if (value.startsWith(model.origin)) await target(new URL(value));
  }
}
console.log(
  `Salida verificada: ${html.size} páginas HTML, ${files.length} archivos. Enlaces, anclas, fuentes tipográficas, metadatos y exclusión de borradores correctos. Base: ${model.base}`,
);
