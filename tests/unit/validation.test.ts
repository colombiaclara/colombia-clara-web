// @vitest-environment node
import { it, expect } from 'vitest';
import {
  validateSchema,
  validateDataset,
  validateDocumentDates,
  localAsset,
} from '../../src/build/validate';
import { validateChart } from '../../src/build/chart-validation';
import { loadContent } from '../../src/build/load';
import { dataset, publication, chart } from '../support';
import { cp, mkdtemp, readFile, writeFile, rm, mkdir, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
it('rechaza campos desconocidos, fechas imposibles y bloques desconocidos', () => {
  expect(() =>
    validateSchema('Publication', { ...publication, descripton: 'error' }, 'articulo'),
  ).toThrow(/descripton/);
  expect(() =>
    validateSchema('Publication', { ...publication, publishedAt: '2026-02-30' }, 'articulo'),
  ).toThrow();
  expect(() =>
    validateSchema('Block', { id: 'x', type: 'ejecutar', content: 'x' }, 'bloque'),
  ).toThrow();
});
it('rechaza URLs ejecutables y HTML como campo en lugar de contenido', () => {
  expect(() =>
    validateSchema(
      'InlineNode',
      { type: 'link', content: 'Abrir', href: 'javascript:alert(1)' },
      'inline',
    ),
  ).toThrow();
  expect(() =>
    validateSchema(
      'Block',
      { id: 'p', type: 'paragraph', evidence: 'transition', html: '<b>no</b>' },
      'bloque',
    ),
  ).toThrow();
});
it('rechaza números como texto y columnas omitidas; conserva null y cero', () => {
  expect(() =>
    validateDataset({ ...dataset, rows: [{ categoria: 'A', cantidad: '120' }] }, 'datos'),
  ).toThrow(/number/);
  expect(() => validateDataset({ ...dataset, rows: [{ categoria: 'A' }] }, 'datos')).toThrow();
  expect(() =>
    validateDataset(
      {
        ...dataset,
        rows: [
          { categoria: 'A', cantidad: null },
          { categoria: 'B', cantidad: 0 },
        ],
      },
      'datos',
    ),
  ).not.toThrow();
});
it('bloquea fecha futura, saltos de encabezado y IDs repetidos', () => {
  expect(() =>
    validateDocumentDates({ ...publication, publishedAt: '2099-01-01' }, '2026-09-09'),
  ).toThrow(/futura/);
  expect(() =>
    validateDocumentDates(
      { ...publication, blocks: [{ id: 'h', type: 'heading', level: 3, content: 'Mal salto' }] },
      '2026-09-09',
    ),
  ).toThrow(/saltes/);
  expect(() =>
    validateDocumentDates(
      { ...publication, blocks: [publication.blocks[0], publication.blocks[0]] },
      '2026-09-09',
    ),
  ).toThrow(/duplicados/);
});
it('rechaza columnas equivocadas, tortas negativas y apilado incompatible', () => {
  expect(() =>
    validateChart(
      { ...chart, encoding: { category: 'categoria', value: 'no-existe' } },
      dataset,
      'chart',
    ),
  ).toThrow(/columna/);
  expect(() =>
    validateChart(
      { ...chart, kind: 'pie', options: {} },
      { ...dataset, rows: [{ categoria: 'A', cantidad: -5 }] },
      'chart',
    ),
  ).toThrow(/negativas/);
  expect(() => validateChart({ ...chart, kind: 'line' }, dataset, 'chart')).toThrow();
});
it('no permite traversal ni symlinks fuera del directorio editorial', async () => {
  const temp = await mkdtemp(path.join(tmpdir(), 'cc-assets-'));
  try {
    await mkdir(path.join(temp, 'assets'));
    await writeFile(path.join(temp, 'outside.txt'), 'secreto');
    await symlink(path.join(temp, 'outside.txt'), path.join(temp, 'assets/link.txt'));
    await expect(localAsset(path.join(temp, 'assets'), '../outside.txt')).rejects.toThrow(
      /Ruta no permitida/,
    );
    await expect(localAsset(path.join(temp, 'assets'), 'link.txt')).rejects.toThrow(/sale/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
it('construye la relación inversa desde inline y dataset sin contar citas como artículos', async () => {
  const model = await loadContent({
    root: 'tests/fixtures/demo/content',
    today: '2026-09-09',
    base: '/cc/',
  });
  expect(model.publications).toHaveLength(2);
  expect(model.sources['src-secreto']).toBeUndefined();
  const uses = model.uses['src-demo-recuento'];
  expect(uses).toHaveLength(2);
  expect(uses.find((u) => u.id === 'pub-demo-comparacion')!.anchors).toContain(
    'comparacion-categorias',
  );
  expect(uses.find((u) => u.id === 'pub-demo-comparacion')!.anchors).toContain('explicacion');
  expect(uses[0].url).toMatch(/^\/cc\/articulos\//);
});
it('una publicación que vuelve a borrador desaparece y la fuente compartida permanece', async () => {
  const temp = await mkdtemp(path.join(tmpdir(), 'cc-content-'));
  try {
    await cp('tests/fixtures/demo/content', temp, { recursive: true });
    const file = path.join(temp, 'publications/leer-una-comparacion/page.json');
    const p = JSON.parse(await readFile(file, 'utf8'));
    p.status = 'draft';
    await writeFile(file, JSON.stringify(p));
    const model = await loadContent({ root: temp, today: '2026-09-09' });
    expect(model.publications).toHaveLength(1);
    expect(model.uses['src-demo-recuento']).toHaveLength(1);
    expect(model.sources['src-demo-metodo']).toBeUndefined();
    expect(model.sources['src-demo-recuento']).toBeDefined();
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
it('informa la referencia inexistente y la ubicación del bloque', async () => {
  const temp = await mkdtemp(path.join(tmpdir(), 'cc-ref-'));
  try {
    await cp('tests/fixtures/demo/content', temp, { recursive: true });
    const file = path.join(temp, 'publications/leer-una-comparacion/page.json');
    const p = JSON.parse(await readFile(file, 'utf8'));
    p.blocks[1].citations = [{ sourceId: 'fuente-ausente' }];
    await writeFile(file, JSON.stringify(p));
    await expect(loadContent({ root: temp, today: '2026-09-09' })).rejects.toThrow(
      /leer-una-comparacion, explicacion: fuente inexistente/,
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
it('informa las opciones incompatibles y bloquea marcadores de plantilla publicados', () => {
  expect(() => validateChart({ ...chart, options: { bins: 5 } }, dataset, 'gráfico')).toThrow(
    /histogramas/,
  );
  expect(() =>
    validateChart({ ...chart, encoding: { ...chart.encoding, x: 'cantidad' } }, dataset, 'gráfico'),
  ).toThrow(/encoding.x/);
  expect(() =>
    validateDocumentDates({ ...publication, authors: ['autor-por-definir'] }, '2026-09-09'),
  ).toThrow(/marcadores/);
});
