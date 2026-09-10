import { bin, max } from 'd3-array';
import type { ChartBlock, Column, Dataset } from '../../generated/content';
import { csvValue } from '../formatting/format';
export type Row = Record<string, string | number | null>;
export interface ChartModel {
  columns: Column[];
  rows: Row[];
  series: string[];
  missing: number;
  note: string;
  totals?: Row[];
}
export interface ChartFilters {
  series?: string[];
  from?: string;
  to?: string;
}
export function transformChart(
  block: ChartBlock,
  dataset: Dataset,
  filters: ChartFilters = {},
): ChartModel {
  const e = block.encoding;
  const original =
    e.series ??
    (e.value ? [e.value] : e.start && e.end ? [e.start, e.end] : e.x && e.y ? [e.x, e.y] : []);
  const series = filters.series ? original.filter((s) => filters.series!.includes(s)) : original;
  let rows: Row[] = dataset.rows.map((r) => ({ ...r }));
  if (e.category && dataset.columns.find((c) => c.id === e.category)?.type === 'date')
    rows.sort((a, b) => String(a[e.category!]).localeCompare(String(b[e.category!]), 'en'));
  if (filters.from) rows = rows.filter((r) => String(r[e.category!]) >= filters.from!);
  if (filters.to) rows = rows.filter((r) => String(r[e.category!]) <= filters.to!);
  const missing = rows.reduce((n, r) => n + series.filter((s) => r[s] === null).length, 0);
  let columns = dataset.columns.filter((c) => !original.includes(c.id) || series.includes(c.id));
  rows = rows.map((r) => Object.fromEntries(columns.map((c) => [c.id, r[c.id]])));
  if (block.options?.format === 'percent')
    columns = columns.map((c) => (series.includes(c.id) ? { ...c, unit: '%' } : c));
  if (block.options?.format === 'currency')
    columns = columns.map((c) =>
      series.includes(c.id) ? { ...c, unit: block.options?.currency ?? 'COP' } : c,
    );
  let note = 'Sin imputación ni eliminación de valores atípicos.';
  if (block.kind === 'histogram') {
    const values = rows.map((r) => r[e.value!]).filter((v): v is number => typeof v === 'number');
    const bins = values.length ? bin().thresholds(block.options?.bins ?? 10)(values) : [];
    rows = bins.map((b, i) => ({
      intervalo: `[${b.x0}, ${b.x1}${i === bins.length - 1 ? ']' : ')'}`,
      frecuencia: b.length,
      inicio: b.x0!,
      fin: b.x1!,
    }));
    columns = [
      { id: 'intervalo', label: 'Intervalo', type: 'string' },
      { id: 'frecuencia', label: 'Frecuencia', type: 'number', unit: 'observaciones' },
      {
        id: 'inicio',
        label: 'Límite inferior',
        type: 'number',
        unit: dataset.columns.find((c) => c.id === e.value)?.unit,
      },
      {
        id: 'fin',
        label: 'Límite superior',
        type: 'number',
        unit: dataset.columns.find((c) => c.id === e.value)?.unit,
      },
    ];
    note = `Agrupación D3 con objetivo de ${block.options?.bins ?? 10} intervalos; se obtuvieron ${bins.length}. Intervalos cerrados por la izquierda y abiertos por la derecha, salvo el último. ${missing} observaciones sin dato excluidas del recuento y declaradas aquí.`;
    return { columns, rows, series: ['frecuencia'], missing, note };
  }
  if (block.kind === 'stacked-bar-100') {
    rows = rows.map((r) => {
      const incomplete = series.some((s) => r[s] === null);
      const total = incomplete ? null : series.reduce((n, s) => n + Number(r[s]), 0);
      return {
        ...r,
        ...Object.fromEntries(
          series.map((s) => [
            s,
            total === null || total === 0 ? null : (Number(r[s]) / total) * 100,
          ]),
        ),
        total,
      };
    });
    columns = columns
      .map((c) => (series.includes(c.id) ? { ...c, unit: '%' } : c))
      .concat([
        {
          id: 'total',
          label: 'Total del grupo',
          type: 'number',
          unit: dataset.columns.find((c) => c.id === series[0])?.unit,
        },
      ]);
    note =
      'Cada porcentaje usa el total del grupo como base. Un grupo con componentes ausentes o total cero no recibe porcentajes; no se completa artificialmente hasta 100 %.';
  }
  if (block.options?.sort && block.options.sort !== 'input' && e.value)
    rows.sort((a, b) =>
      a[e.value!] === null
        ? b[e.value!] === null
          ? 0
          : 1
        : b[e.value!] === null
          ? -1
          : (Number(a[e.value!]) - Number(b[e.value!])) *
            (block.options!.sort === 'ascending' ? 1 : -1),
    );
  if (block.kind === 'area')
    note +=
      ' Áreas independientes desde cero, sin acumulación; los huecos conservan datos ausentes.';
  if (block.options?.scale === 'log')
    note += ' Escala logarítmica; las distancias representan razones.';
  if (block.options?.domain)
    note += ` Escala vertical recortada: ${block.options.domain.join(' a ')}.`;
  if (['pie', 'donut'].includes(block.kind) && rows.length > 6)
    note += ' Hay más de seis categorías: consulta la tabla para comparaciones precisas.';
  if (block.kind === 'scatter') note += ' Una asociación entre variables no demuestra causalidad.';
  return { columns, rows, series, missing, note };
}
export function modelCSV(model: ChartModel) {
  return [
    model.columns.map((c) => csvValue(c.label + (c.unit ? ` (${c.unit})` : ''))).join(','),
    ...model.rows.map((row) => model.columns.map((c) => csvValue(row[c.id])).join(',')),
  ].join('\r\n');
}
export const finiteMaximum = (values: (number | null)[]) =>
  max(values.filter((v): v is number => v !== null)) ?? 0;
