import { mkdir, rm, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { loadContent, visibleText } from '../src/build/load';
import { localAsset } from '../src/build/validate';
import type { ImageSpec, Publication } from '../src/generated/content';
// @ts-ignore configuration is deliberately plain JS, also used by Astro.
import { base, site as origin } from '../config/deployment.mjs';
const demo = process.env['CC_DEMO'] === '1';
const root = demo ? 'tests/fixtures/demo/content' : 'content';
const model = await loadContent({
  root,
  demo,
  includeDrafts: process.env['CC_INCLUDE_DRAFTS'] === '1',
  base,
  origin,
});
const out = '.generated/public';
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const write = async (file: string, content: string | Uint8Array) => {
  const dest = path.join(out, file);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, content);
};
const json = async (file: string, value: unknown) => write(file, JSON.stringify(value));
await mkdir(`${out}/fonts`, { recursive: true });
for (const font of ['source-serif-4', 'source-sans-3'])
  for (const weight of [400, 600, 700]) {
    const name = `${font}-latin-${weight}-normal.woff2`;
    await copyFile(`node_modules/@fontsource/${font}/files/${name}`, `${out}/fonts/${name}`);
  }
await write(
  'favicon.svg',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="#006d77"/><text x="32" y="45" text-anchor="middle" font-family="Georgia,serif" font-size="46" fill="white">c</text></svg>',
);
await write('.nojekyll', '');
const url = (v: string) => base + v;
for (const r of [...model.publications, ...model.pages]) {
  const kind = r.institutional ? 'pages' : 'publications';
  const dir = path.join(root, kind, r.document.slug);
  const imageSpecs: ImageSpec[] = [
    ...('cover' in r.document && r.document.cover ? [r.document.cover] : []),
    ...r.document.blocks.flatMap((b) => (b.type === 'image' ? [b.image] : [])),
  ];
  for (const spec of imageSpecs) {
    if (r.images[spec.src]) continue;
    const f = await localAsset(dir, spec.src);
    const bytes = await readFile(f);
    const meta = await sharp(bytes).metadata();
    if (!meta.width || !meta.height) throw new Error(`${f}: imagen sin dimensiones.`);
    const stem = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
    const widths = [480, 800, 1200].filter((w) => w < meta.width!);
    widths.push(Math.min(meta.width, 1600));
    for (const width of widths)
      await write(
        `assets/images/${stem}-${width}.webp`,
        await sharp(bytes)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer(),
      );
    const width = Math.max(...widths);
    r.images[spec.src] = {
      ...spec,
      src: url(`assets/images/${stem}-${width}.webp`),
      srcSet: widths.map((w) => `${url(`assets/images/${stem}-${w}.webp`)} ${w}w`).join(', '),
      width,
      height: Math.round((meta.height * width) / meta.width),
    };
  }
  for (const d of Object.values(r.datasets))
    await json(`data/${kind}/${r.document.slug}/${d.id}.json`, d);
  await json(`data/${kind}/${r.document.slug}/page.json`, r.document);
}
for (const [id, source] of Object.entries(model.sources)) {
  await json(`data/sources/${id}.json`, source);
  if (source.asset) {
    const f = await localAsset(path.join(root, 'sources', id), source.asset);
    await write(`assets/sources/${id}/${path.basename(f)}`, await readFile(f));
  }
}
const pubIndex = model.publications.map((r) => ({
  id: r.document.id,
  title: r.document.title,
  description: r.document.description,
  url: r.url,
  section: (r.document as Publication).section,
  type: (r.document as Publication).type,
  date: r.document.publishedAt ?? '',
  text:
    visibleText((r.document as Publication).lead) +
    ' ' +
    r.document.blocks.map(visibleText).join(' '),
  tags: (r.document as Publication).tags,
}));
const sourceIndex = Object.values(model.sources)
  .sort((a, b) => a.title.localeCompare(b.title, 'es'))
  .map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    url: url(`fuentes/${s.id}/`),
    type: s.kind,
    text: [
      s.title,
      s.publisher ?? '',
      s.description,
      ...s.creators.map((c) => c.name),
      s.url ? new URL(s.url).hostname : '',
    ].join(' '),
    sections: [...new Set(model.uses[s.id].flatMap((u) => (u.section ? [u.section] : [])))],
    uses: model.uses[s.id].filter((u) => !u.institutional).length,
  }));
await json('search/publications.json', pubIndex);
await json('search/sources.json', sourceIndex);
const escape = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!,
  );
const canonical = (v: string) => new URL(v, origin).href;
const routes = [
  '',
  'publicaciones/',
  'fuentes/',
  ...model.sections.items.map((s) => `lineas/${s.id}/`),
  ...model.publications.map((r) => `articulos/${r.document.slug}/`),
  ...model.pages.map((r) => `${r.document.slug}/`),
  ...Object.keys(model.sources).map((s) => `fuentes/${s}/`),
];
await write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${escape(canonical(url(r)))}</loc></url>`).join('')}</urlset>`,
);
await write(
  'robots.txt',
  `${demo ? 'User-agent: *\nDisallow: /' : 'User-agent: *\nAllow: /'}\nSitemap: ${canonical(url('sitemap.xml'))}\n`,
);
await write(
  'rss.xml',
  `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Colombia Clara</title><link>${escape(canonical(base))}</link><description>${escape(model.site.description)}</description><language>es-co</language>${model.publications.map((r) => `<item><title>${escape(r.document.title)}</title><link>${escape(canonical(r.url))}</link><guid isPermaLink="true">${escape(canonical(r.url))}</guid><description>${escape(r.document.description)}</description>${r.document.publishedAt ? `<pubDate>${new Date(r.document.publishedAt + 'T12:00:00Z').toUTCString()}</pubDate>` : ''}</item>`).join('')}</channel></rss>`,
);
// Deterministic typographic social images; no documentary photographs are invented.
for (const [key, title] of [
  ['home', 'Colombia Clara'],
  ...model.publications.map((r) => [r.document.id, r.document.title]),
]) {
  const words = title.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).length > 34) {
      lines.push(line);
      line = word;
    } else line += (line ? ' ' : '') + word;
  }
  if (line) lines.push(line);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#fff"/><rect x="70" y="80" width="60" height="8" fill="#006d77"/><text x="70" y="145" font-family="serif" font-size="30" fill="#006d77">COLOMBIA CLARA</text>${lines
    .slice(0, 5)
    .map(
      (s, i) =>
        `<text x="70" y="${240 + i * 64}" font-family="serif" font-size="54" fill="#17252b">${escape(s)}</text>`,
    )
    .join(
      '',
    )}<text x="70" y="575" font-family="sans-serif" font-size="24" fill="#526168">Periodismo cívico para comprender y actuar.</text></svg>`;
  await write(`social/${key}.png`, await sharp(Buffer.from(svg)).png().toBuffer());
}
await mkdir('.generated', { recursive: true });
await writeFile('.generated/model.json', JSON.stringify(model));
console.log(
  `${demo ? 'DEMOSTRACIÓN LOCAL' : 'PRODUCCIÓN'}: ${model.publications.length} publicaciones, ${model.pages.length} páginas, ${Object.keys(model.sources).length} fuentes utilizadas.`,
);
for (const warning of model.warnings) console.log('REVISIÓN EDITORIAL: ' + warning);
