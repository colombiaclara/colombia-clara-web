import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import {
  validateSchema,
  validateDataset,
  validateDocumentDates,
  localAsset,
  normalize,
} from './validate';
import { validateChart } from './chart-validation';
import type {
  Model,
  Publication,
  Page,
  Source,
  Author,
  Dataset,
  Citation,
  ResolvedDocument,
} from './types';
export interface LoadOptions {
  root?: string;
  includeDrafts?: boolean;
  demo?: boolean;
  today?: string;
  base?: string;
  origin?: string;
}
async function json(file: string) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (e) {
    throw new Error(`${file}: JSON ilegible. ${e instanceof Error ? e.message : String(e)}`);
  }
}
async function discover(root: string, folder: string, file: string, kind: string) {
  const dir = path.join(root, folder);
  let dirs;
  try {
    dirs = await readdir(dir, { withFileTypes: true });
  } catch {
    return [] as { dir: string; data: any }[];
  }
  const out = [];
  for (const entry of dirs.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (!entry.isDirectory()) continue;
    const f = path.join(dir, entry.name, file);
    const data = await json(f);
    validateSchema(kind, data, f);
    const identity = kind === 'Publication' || kind === 'Page' ? data.slug : data.id;
    if (identity !== entry.name)
      throw new Error(`${f}: el identificador «${identity}» no coincide con la carpeta.`);
    out.push({ dir: path.join(dir, entry.name), data });
  }
  return out;
}
export function citationsIn(value: unknown): Citation[] {
  const result: Citation[] = [];
  const visit = (v: unknown, depth: number) => {
    if (depth > 16) throw new Error('El contenido excede 16 niveles de anidación.');
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) {
      v.forEach((x) => visit(x, depth + 1));
      return;
    }
    const o = v as Record<string, unknown>;
    if (typeof o['sourceId'] === 'string') result.push(o as unknown as Citation);
    else Object.values(o).forEach((x) => visit(x, depth + 1));
  };
  visit(value, 0);
  return result;
}
export function visibleText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(visibleText).join(' ');
  if (!value || typeof value !== 'object') return '';
  const o = value as Record<string, unknown>;
  return ['content', 'title', 'description', 'items', 'attribution']
    .map((k) => visibleText(o[k]))
    .join(' ');
}
export async function loadContent(options: LoadOptions = {}): Promise<Model> {
  const root = path.resolve(options.root ?? 'content');
  const base = '/' + (options.base ?? '/').split('/').filter(Boolean).join('/') + '/';
  const prefix = base === '//' ? '/' : base;
  const url = (s: string) => prefix + s.replace(/^\//, '');
  const site = await json(path.join(root, 'site/site.json'));
  validateSchema('Site', site, 'site/site.json');
  const home = await json(path.join(root, 'site/home.json'));
  validateSchema('Home', home, 'site/home.json');
  const sections = await json(path.join(root, 'site/sections.json'));
  validateSchema('Sections', sections, 'site/sections.json');
  if (new Set(sections.items.map((s: { id: string }) => s.id)).size !== 5)
    throw new Error('sections.json: deben aparecer las cinco líneas, sin duplicados.');
  const rawPublications = await discover(root, 'publications', 'page.json', 'Publication');
  const rawPages = await discover(root, 'pages', 'page.json', 'Page');
  const rawSources = await discover(root, 'sources', 'source.json', 'Source');
  const rawAuthors = await discover(root, 'authors', 'author.json', 'Author');
  const sources: Record<string, Source> = Object.fromEntries(
    rawSources.map((x) => [x.data.id, x.data as Source]),
  );
  const authors: Record<string, Author> = Object.fromEntries(
    rawAuthors.map((x) => [x.data.id, x.data as Author]),
  );
  const all = [...rawPublications, ...rawPages];
  const ids = all.map((x) => x.data.id);
  if (new Set(ids).size !== ids.length)
    throw new Error('Hay identidades de publicación o página duplicadas.');
  const reserved = [
    'articulos',
    'publicaciones',
    'lineas',
    'fuentes',
    'assets',
    'data',
    'search',
    'social',
    'schemas',
    '404',
    '404.html',
    'robots.txt',
    'sitemap.xml',
    'rss.xml',
    'catalogo',
    '_astro',
    'fonts',
  ];
  const pageSlugs = rawPages.flatMap((x) => [x.data.slug, ...(x.data.previousSlugs ?? [])]);
  if (new Set(pageSlugs).size !== pageSlugs.length || pageSlugs.some((x) => reserved.includes(x)))
    throw new Error('Hay una página institucional con slug reservado o duplicado.');
  const articleSlugs = rawPublications.flatMap((x) => [
    x.data.slug,
    ...(x.data.previousSlugs ?? []),
  ]);
  if (new Set(articleSlugs).size !== articleSlugs.length)
    throw new Error('Hay un slug actual o anterior duplicado.');
  const model: Model = {
    site,
    home,
    sections,
    publications: [],
    pages: [],
    sources: {},
    uses: {},
    sourceAssets: {},
    base: prefix,
    origin: options.origin ?? 'https://colombiaclara.github.io',
    demo: !!options.demo,
    warnings: [],
  };
  const sourceUrls = new Map<string, string>();
  for (const s of Object.values(sources)) {
    if (s.url) {
      const u = new URL(s.url);
      u.hash = '';
      for (const k of [...u.searchParams.keys()])
        if (k.startsWith('utm_')) u.searchParams.delete(k);
      const key = u.toString().replace(/\/$/, '');
      if (sourceUrls.has(key))
        model.warnings.push(
          `Posible fuente duplicada: ${s.id} y ${sourceUrls.get(key)}. Revisar, sin fusionar automáticamente.`,
        );
      sourceUrls.set(key, s.id);
    }
  }
  const today = options.today ?? new Date().toISOString().slice(0, 10);
  for (const raw of all) {
    const d = raw.data as Publication | Page;
    const institutional = !('section' in d);
    validateDocumentDates(d, today);
    if (!institutional)
      for (const id of (d as Publication).authors)
        if (!authors[id]) throw new Error(`${d.slug}: falta la ficha de autor «${id}».`);
    const r: ResolvedDocument = {
      document: d,
      url: url(institutional ? `${d.slug}/` : `articulos/${d.slug}/`),
      institutional,
      demo: !!options.demo,
      readingMinutes: Math.max(
        1,
        Math.ceil(
          (
            visibleText('lead' in d ? d.lead : '') +
            ' ' +
            d.blocks
              .filter((b) => !['chart', 'table'].includes(b.type))
              .map(visibleText)
              .join(' ')
          )
            .split(/\s+/)
            .filter(Boolean).length / 220,
        ),
      ),
      sources: {},
      datasets: {},
      datasetUrls: {},
      images: {},
      authors: institutional ? [] : (d as Publication).authors.map((id) => authors[id]),
      relatedIds: [],
    };
    const refs: { citation: Citation; anchor: string }[] = [];
    if ('lead' in d) {
      citationsIn(d.lead).forEach((c) => refs.push({ citation: c, anchor: 'entrada' }));
      citationsIn(d.keyPoints).forEach((c) => refs.push({ citation: c, anchor: 'ideas' }));
    }
    for (const b of d.blocks) {
      citationsIn(b).forEach((c) => refs.push({ citation: c, anchor: b.id }));
      if (
        ((b.type === 'paragraph' && ['fact', 'declaration'].includes(b.evidence)) ||
          ['quote', 'metric'].includes(b.type)) &&
        !citationsIn(b).length
      )
        throw new Error(`${d.slug}, ${b.id}: añade una fuente para esta afirmación.`);
      if (b.type === 'chart' || b.type === 'table') {
        const f = await localAsset(raw.dir, b.dataset);
        const dataset = (await json(f)) as Dataset;
        validateSchema('Dataset', dataset, f);
        validateDataset(dataset, f);
        if (dataset.id !== path.basename(b.dataset, '.json'))
          throw new Error(`${f}: id no coincide con el nombre del archivo.`);
        if (b.type === 'chart') validateChart(b, dataset, `${d.slug}, ${b.id}`);
        r.datasets[b.dataset] = dataset;
        r.datasetUrls[b.dataset] = url(
          `data/${institutional ? 'pages' : 'publications'}/${d.slug}/${dataset.id}.json`,
        );
        citationsIn(dataset).forEach((c) => refs.push({ citation: c, anchor: b.id }));
      }
      if (b.type === 'image') await localAsset(raw.dir, b.image.src);
    }
    if ('cover' in d && d.cover) await localAsset(raw.dir, d.cover.src);
    const isPublic = d.status === 'published' || options.includeDrafts;
    for (const { citation: c, anchor } of refs) {
      const s = sources[c.sourceId];
      if (!s) throw new Error(`${d.slug}, ${anchor}: fuente inexistente «${c.sourceId}».`);
      if (s.kind === 'academic-paper' && !c.locator)
        throw new Error(
          `${d.slug}, ${anchor}: añade página o sección para la fuente académica ${s.id}.`,
        );
      r.sources[s.id] = s;
      if (isPublic) {
        model.sources[s.id] = s;
        const uses = (model.uses[s.id] ??= []);
        let usage = uses.find((u) => u.id === d.id);
        if (!usage) {
          usage = {
            id: d.id,
            title: d.title,
            url: r.url,
            institutional,
            anchors: [],
            ...(!institutional ? { section: (d as Publication).section } : {}),
          };
          uses.push(usage);
        }
        if (!usage.anchors.includes(anchor)) usage.anchors.push(anchor);
      }
    }
    for (const id of 'related' in d ? (d.related ?? []) : [])
      if (!rawPublications.some((x) => x.data.id === id) || id === d.id)
        throw new Error(`${d.slug}: relacionado inválido «${id}».`);
    if (isPublic) {
      (institutional ? model.pages : model.publications).push(r);
      model.warnings.push(
        `${d.slug}: revisión humana de afirmaciones, título, cifras y límites requerida.`,
      );
    }
  }
  const sort = (a: ResolvedDocument, b: ResolvedDocument) =>
    (b.document.publishedAt ?? '').localeCompare(a.document.publishedAt ?? '') ||
    a.document.id.localeCompare(b.document.id, 'en');
  model.publications.sort(sort);
  model.pages.sort((a, b) => a.document.slug.localeCompare(b.document.slug, 'en'));
  for (const r of model.publications) {
    const d = r.document as Publication;
    const eligible = model.publications.filter((x) => x.document.id !== d.id);
    r.relatedIds = (d.related ?? []).filter((id) => eligible.some((x) => x.document.id === id));
    if (!r.relatedIds.length)
      r.relatedIds = eligible
        .map((x) => ({
          id: x.document.id,
          score:
            Number((x.document as Publication).section === d.section) * 3 +
            (x.document as Publication).tags.filter((t) =>
              d.tags.map(normalize).includes(normalize(t)),
            ).length,
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id, 'en'))
        .slice(0, 3)
        .map((x) => x.id);
  }
  for (const id of home.featured ?? [])
    if (!model.publications.some((r) => r.document.id === id))
      throw new Error(`home.json: destacado «${id}» no publicado o inexistente.`);
  const knownPaths = new Set([
    '/',
    '/publicaciones/',
    '/fuentes/',
    ...model.sections.items.map((s: { id: string }) => `/lineas/${s.id}/`),
    ...model.pages.map((p) => `/${p.document.slug}/`),
  ]);
  for (const n of site.navigation)
    if (!knownPaths.has(n.path))
      throw new Error(`site.json: navegación a ruta inexistente «${n.path}».`);
  for (const raw of rawSources)
    if (model.sources[raw.data.id] && raw.data.asset) {
      await localAsset(raw.dir, raw.data.asset);
      model.sourceAssets[raw.data.id] = url(
        `assets/sources/${raw.data.id}/${path.basename(raw.data.asset)}`,
      );
    }
  return model;
}
