import { mkdir, readFile, writeFile, access, cp } from 'node:fs/promises';
import path from 'node:path';
const type = process.argv[2],
  slug = process.argv[3];
const types = [
  'explainer',
  'investigation',
  'fact-check',
  'data-story',
  'testimony',
  'guide',
  'page',
];
if (!types.includes(type) || !slug || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(slug)) {
  console.log(
    'Uso: npm run content:new -- <tipo> <slug>\nTipos: ' +
      types.join(', ') +
      '\nEjemplo: npm run content:new -- explainer agua-y-territorio',
  );
  process.exit(type ? 1 : 0);
}
const kind = type === 'page' ? 'pages' : 'publications',
  old = type === 'page' ? 'nueva-pagina' : 'nueva-publicacion',
  target = `content/${kind}/${slug}/page.json`;
try {
  await access(target);
  throw new Error(`La carpeta ${slug} ya contiene page.json; no se sobrescribe.`);
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
const data = JSON.parse(await readFile(`templates/${type}/${kind}/${old}/page.json`, 'utf8'));
data.id = (type === 'page' ? 'page-' : 'pub-') + slug;
data.slug = slug;
data.$schema = '../../../schemas/' + (type === 'page' ? 'page' : 'publication') + '.schema.json';
await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, JSON.stringify(data, null, 2) + '\n');
await mkdir(`content/${kind}/${slug}/assets`, { recursive: true });
await mkdir(`content/${kind}/${slug}/datasets`, { recursive: true });
try {
  await cp(`templates/${type}/${kind}/${old}/datasets`, `content/${kind}/${slug}/datasets`, {
    recursive: true,
    force: false,
  });
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
if (type !== 'page') {
  const source = 'content/sources/src-por-definir/source.json';
  try {
    await access(source);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    await mkdir(path.dirname(source), { recursive: true });
    await cp(`templates/${type}/sources/src-por-definir/source.json`, source, { force: false });
  }
  const author = 'content/authors/autor-por-definir/author.json';
  try {
    await access(author);
  } catch {
    await mkdir(path.dirname(author), { recursive: true });
    await writeFile(
      author,
      await readFile(`templates/${type}/authors/autor-por-definir/author.json`),
    );
  }
}
console.log(
  `Creado ${target} como borrador. Completa contenido y autoría real, valida y revisa antes de publicar.`,
);
