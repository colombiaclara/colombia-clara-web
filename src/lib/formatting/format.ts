export const labels: Record<string, string> = {
  explainer: 'Explicación',
  investigation: 'Investigación',
  'fact-check': 'Verificación',
  'data-story': 'Análisis de datos',
  testimony: 'Testimonio',
  guide: 'Guía',
  report: 'Informe',
  dataset: 'Dataset',
  'academic-paper': 'Artículo académico',
  'news-article': 'Artículo periodístico',
  'official-record': 'Registro oficial',
  interview: 'Entrevista',
  'web-page': 'Página web',
};
export const sectionNames: Record<string, string> = {
  'sin-mordaza': 'Sin Mordaza',
  'datos-claros': 'Datos Claros',
  'planeta-comun': 'Planeta Común',
  'voces-claras': 'Voces Claras',
  'escuela-clara': 'Escuela Clara',
};
export const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Bogota',
      }).format(new Date(date + 'T12:00:00Z'))
    : '';
export function formatNumber(value: number | null, unit = '', decimals = 1) {
  if (value === null) return 'Sin dato';
  const n = new Intl.NumberFormat('es-CO', { maximumFractionDigits: decimals }).format(value);
  return n + (unit ? ' ' + unit : '');
}
export function percentageChange(value: number, base: number) {
  return base === 0 ? null : ((value - base) / Math.abs(base)) * 100;
}
export function withBase(path: string, base: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return base + path.replace(/^\/+/, '');
}
export function csvValue(value: unknown) {
  const v = value === null ? '' : String(value);
  const safe = /^[=+@\t\r]/.test(v) || (/^-/.test(v) && !Number.isFinite(Number(v))) ? "'" + v : v;
  return '"' + safe.replaceAll('"', '""') + '"';
}
