import type { ChartBlock, Dataset } from '../generated/content';
export function validateChart(b: ChartBlock, d: Dataset, label: string) {
  const e = b.encoding;
  const cols = new Map(d.columns.map((c) => [c.id, c]));
  const need = (id: string | undefined, numeric = false) => {
    if (!id || !cols.has(id))
      throw new Error(`${label}: falta una columna válida en encoding (${id ?? 'sin definir'}).`);
    if (numeric && cols.get(id)!.type !== 'number')
      throw new Error(`${label}: «${id}» debe ser numérica.`);
    return id;
  };
  const multi = ['grouped-bar', 'stacked-bar', 'stacked-bar-100', 'line', 'area'];
  const keys = multi.includes(b.kind)
    ? ['category', 'series']
    : b.kind === 'scatter'
      ? ['x', 'y']
      : b.kind === 'heatmap'
        ? ['x', 'y', 'value']
        : b.kind === 'dumbbell'
          ? ['category', 'start', 'end']
          : b.kind === 'histogram'
            ? ['value']
            : ['category', 'value'];
  for (const key of Object.keys(e))
    if (!keys.includes(key))
      throw new Error(`${label}: encoding.${key} no corresponde al gráfico ${b.kind}.`);
  if (b.options?.orientation && b.kind !== 'bar')
    throw new Error(`${label}: orientation solo corresponde a barras simples.`);
  if (b.options?.bins !== undefined && b.kind !== 'histogram')
    throw new Error(`${label}: bins solo corresponde a histogramas.`);
  if (b.options?.seriesFilter && !multi.includes(b.kind))
    throw new Error(`${label}: seriesFilter necesita un gráfico con series.`);
  if (b.options?.sort && b.options.sort !== 'input' && !['bar', 'pie', 'donut'].includes(b.kind))
    throw new Error(
      `${label}: sort por valor solo corresponde a barras simples, tortas y anillos.`,
    );
  if (b.options?.currency && b.options.format !== 'currency')
    throw new Error(`${label}: currency necesita format currency.`);
  if (b.kind === 'stacked-bar-100' && cols.has('total'))
    throw new Error(
      `${label}: total está reservado para la base calculada del apilado porcentual.`,
    );
  if (multi.includes(b.kind)) {
    need(e.category);
    if (!e.series?.length) throw new Error(`${label}: define encoding.series.`);
    for (const s of e.series) need(s, true);
    if (new Set(e.series).size !== e.series.length) throw new Error(`${label}: series duplicadas.`);
    if (new Set(e.series.map((s) => cols.get(s)?.unit ?? '')).size > 1)
      throw new Error(`${label}: las series usan unidades incompatibles.`);
  } else if (b.kind === 'scatter') {
    need(e.x, true);
    need(e.y, true);
  } else if (b.kind === 'histogram') {
    need(e.value, true);
  } else if (b.kind === 'dumbbell') {
    need(e.category);
    need(e.start, true);
    need(e.end, true);
    if (cols.get(e.start!)?.unit !== cols.get(e.end!)?.unit)
      throw new Error(`${label}: los periodos tienen unidades diferentes.`);
  } else if (b.kind === 'heatmap') {
    need(e.x);
    need(e.y);
    need(e.value, true);
  } else {
    need(e.category);
    need(e.value, true);
  }
  const category = e.category;
  if (category && new Set(d.rows.map((r) => r[category])).size !== d.rows.length)
    throw new Error(
      `${label}: categorías repetidas; agrupa explícitamente el dataset y documenta el método.`,
    );
  if (category && d.rows.some((r) => r[category] === null))
    throw new Error(`${label}: una categoría no puede ser null.`);
  if (['line', 'area'].includes(b.kind) && cols.get(category!)?.type !== 'date')
    throw new Error(`${label}: líneas y áreas requieren una columna date como category.`);
  if (
    b.kind === 'heatmap' &&
    new Set(d.rows.map((r) => JSON.stringify([r[e.x!], r[e.y!]]))).size !== d.rows.length
  )
    throw new Error(`${label}: hay celdas de matriz duplicadas.`);
  if (['pie', 'donut'].includes(b.kind)) {
    if (d.rows.some((r) => r[e.value!] !== null && Number(r[e.value!]) < 0))
      throw new Error(`${label}: las partes del total no pueden ser negativas.`);
    if (
      d.rows.length &&
      d.rows.every((r) => r[e.value!] !== null) &&
      d.rows.reduce((n, r) => n + Number(r[e.value!]), 0) <= 0
    )
      throw new Error(`${label}: el total debe ser positivo.`);
  }
  if (
    ['stacked-bar', 'stacked-bar-100', 'area'].includes(b.kind) &&
    d.rows.some((r) => e.series!.some((s) => r[s] !== null && Number(r[s]) < 0))
  )
    throw new Error(`${label}: esta composición no admite valores negativos.`);
  const values =
    e.series ??
    (e.value ? [e.value] : e.start && e.end ? [e.start, e.end] : e.x && e.y ? [e.x, e.y] : []);
  if (b.options?.format === 'percent' && values.some((s) => cols.get(s)?.unit !== '%'))
    throw new Error(
      `${label}: format percent requiere valores expresados en puntos de porcentaje y unit %. No convierte fracciones automáticamente.`,
    );
  if (b.options?.format === 'currency') {
    const c = b.options.currency ?? 'COP';
    for (const id of values)
      if (cols.get(id)?.unit !== c)
        throw new Error(
          `${label}: la moneda ${c} debe coincidir con la unidad del dataset; no se convierten divisas.`,
        );
  }
  if (b.options?.scale === 'log') {
    if (b.kind !== 'line') throw new Error(`${label}: escala logarítmica solo en líneas.`);
    if (d.rows.some((r) => e.series!.some((s) => r[s] !== null && Number(r[s]) <= 0)))
      throw new Error(`${label}: una escala logarítmica necesita valores positivos.`);
  }
  if (b.options?.domain) {
    const [lo, hi] = b.options.domain;
    if (b.options.scale === 'log' && lo <= 0)
      throw new Error(`${label}: el mínimo logarítmico debe ser positivo.`);
    if (b.kind !== 'line' || lo >= hi)
      throw new Error(`${label}: dominio recortado solo para líneas, con mínimo menor que máximo.`);
    if (
      d.rows.some((r) =>
        e.series!.some((s) => r[s] !== null && (Number(r[s]) < lo || Number(r[s]) > hi)),
      )
    )
      throw new Error(`${label}: el dominio ocultaría observaciones.`);
  }
  if (b.options?.periodFilter && cols.get(category!)?.type !== 'date')
    throw new Error(`${label}: periodFilter requiere fechas.`);
}
