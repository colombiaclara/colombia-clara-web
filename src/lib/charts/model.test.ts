import { it, expect } from 'vitest';
import { transformChart, modelCSV } from './model';
import { dataset, chart } from '../../../tests/support';
import catalogue from '../../../tests/fixtures/demo/content/publications/catalogo-de-graficos/page.json';
import seriesJson from '../../../tests/fixtures/demo/content/publications/catalogo-de-graficos/datasets/series.json';
import timeJson from '../../../tests/fixtures/demo/content/publications/catalogo-de-graficos/datasets/tiempo.json';
import matrixJson from '../../../tests/fixtures/demo/content/publications/catalogo-de-graficos/datasets/matriz.json';
import pointsJson from '../../../tests/fixtures/demo/content/publications/catalogo-de-graficos/datasets/puntos.json';
import type { Dataset, ChartBlock } from '../../generated/content';
it('normaliza al 100 % sobre una base explícita y no inventa porcentajes si falta un componente', () => {
  const b = {
    ...chart,
    kind: 'stacked-bar-100' as const,
    encoding: { category: 'categoria', series: ['a', 'b'] },
  };
  const d = {
    ...dataset,
    columns: [
      { id: 'categoria', label: 'Categoría', type: 'string' as const },
      { id: 'a', label: 'A', type: 'number' as const },
      { id: 'b', label: 'B', type: 'number' as const },
    ],
    rows: [
      { categoria: 'Completo', a: 25, b: 75 },
      { categoria: 'Ausente', a: 25, b: null },
      { categoria: 'Cero', a: 0, b: 0 },
    ],
  };
  const model = transformChart(b, d);
  expect(model.rows[0]).toEqual({ categoria: 'Completo', a: 25, b: 75, total: 100 });
  expect(model.rows[1]['a']).toBeNull();
  expect(model.rows[1]['total']).toBeNull();
  expect(model.rows[2]['total']).toBe(0);
  expect(model.rows[2]['a']).toBeNull();
});
it('histograma conserva cada observación no ausente en intervalos conocidos', () => {
  const b = {
    ...chart,
    kind: 'histogram' as const,
    encoding: { value: 'cantidad' },
    options: { bins: 4 },
  };
  const d = {
    ...dataset,
    rows: [1, 2, 3, 4, 5, 6, 7, 8, null].map((n, i) => ({ categoria: String(i), cantidad: n })),
  };
  const m = transformChart(b, d);
  expect(m.rows.reduce((n, r) => n + Number(r['frecuencia']), 0)).toBe(8);
  expect(m.missing).toBe(1);
  expect(m.columns.map((c) => c.id)).toEqual(['intervalo', 'frecuencia', 'inicio', 'fin']);
  expect(modelCSV(m)).toContain('Frecuencia');
});
it('filtra periodos y series sin convertir huecos en cero', () => {
  const b = {
    ...chart,
    kind: 'line' as const,
    encoding: { category: 'fecha', series: ['primera', 'segunda'] },
  };
  const m = transformChart(b, timeJson as Dataset, {
    from: '2026-02-01',
    to: '2026-03-01',
    series: ['primera'],
  });
  expect(m.rows).toEqual([
    { fecha: '2026-02-01', primera: null },
    { fecha: '2026-03-01', primera: 55 },
  ]);
  expect(m.missing).toBe(1);
  expect(modelCSV(m)).not.toContain('Segunda');
});
it('el CSV no convierte una celda textual en fórmula ejecutable', () => {
  const m = transformChart(chart, { ...dataset, rows: [{ categoria: '=SUM(A1)', cantidad: 120 }] });
  expect(modelCSV(m)).toContain("'=SUM(A1)");
});
it.each(catalogue.blocks.filter((b) => b.type === 'chart').map((b) => b.kind))(
  'el tipo %s tiene modelo y columnas compatibles',
  (kind) => {
    const b = catalogue.blocks.find((b) => b.type === 'chart' && b.kind === kind) as ChartBlock;
    const data: Record<string, Dataset> = {
      'datasets/comparacion.json': dataset,
      'datasets/series.json': seriesJson as Dataset,
      'datasets/tiempo.json': timeJson as Dataset,
      'datasets/matriz.json': matrixJson as Dataset,
      'datasets/puntos.json': pointsJson as Dataset,
    };
    const m = transformChart(b, data[b.dataset]);
    expect(m.rows.length).toBeGreaterThan(0);
    expect(m.columns.length).toBeGreaterThan(1);
    for (const row of m.rows) expect(Object.keys(row)).toEqual(m.columns.map((c) => c.id));
  },
);
