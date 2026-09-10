import { loadContent } from '../src/build/load';
try {
  const m = await loadContent();
  console.log(
    `Contenido válido. ${m.publications.length} publicaciones públicas; ${m.pages.length} páginas.`,
  );
  m.warnings.forEach((w) => console.log('REVISIÓN: ' + w));
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}
