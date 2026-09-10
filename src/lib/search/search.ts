export interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  text: string;
  section?: string;
  sections?: string[];
  type: string;
  date?: string;
  tags?: string[];
  uses?: number;
}
export interface SearchState {
  q: string;
  section: string;
  kind: string;
  page: number;
}
export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
    .trim();
export function search(items: SearchItem[], state: SearchState) {
  const terms = normalize(state.q).split(/\s+/).filter(Boolean);
  return items
    .filter(
      (item) =>
        terms.every((t) =>
          normalize(
            item.title +
              ' ' +
              item.description +
              ' ' +
              item.text +
              ' ' +
              (item.tags ?? []).join(' '),
          ).includes(t),
        ) &&
        (!state.section ||
          item.section === state.section ||
          item.sections?.includes(state.section)) &&
        (!state.kind || item.type === state.kind),
    )
    .sort(
      (a, b) =>
        (b.date ?? '').localeCompare(a.date ?? '') ||
        a.title.localeCompare(b.title, 'es') ||
        a.id.localeCompare(b.id, 'en'),
    );
}
export function readSearch(params: URLSearchParams): SearchState {
  return {
    q: params.get('q') ?? '',
    section: params.get('linea') ?? '',
    kind: params.get('tipo') ?? '',
    page: Math.max(1, Math.floor(Number(params.get('pagina')) || 1)),
  };
}
export function searchParams(state: SearchState) {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.section) p.set('linea', state.section);
  if (state.kind) p.set('tipo', state.kind);
  if (state.page > 1) p.set('pagina', String(state.page));
  return p;
}
