import { useState, useEffect, useMemo } from 'react';
import { SearchInput } from './SearchInput';
import { FilterGroup } from './FilterGroup';
import { ResultsList } from './ResultsList';
import { Pagination } from '../layout/Pagination';
import { search, readSearch, searchParams, type SearchState, type SearchItem } from './search';
import { labels, sectionNames } from '../formatting/format';
export function Search({ indexUrl, kind }: { indexUrl: string; kind: 'publications' | 'sources' }) {
  const [items, setItems] = useState<SearchItem[]>([]),
    [state, setState] = useState<SearchState>({ q: '', section: '', kind: '', page: 1 }),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    const read = () => setState(readSearch(new URLSearchParams(location.search)));
    read();
    window.addEventListener('popstate', read);
    fetch(indexUrl, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error('No se pudo cargar la búsqueda.');
        return r.json();
      })
      .then((data) => {
        setItems(data);
        setLoaded(true);
      })
      .catch((e) => {
        if (e.name !== 'AbortError')
          setError('La búsqueda no está disponible. Puedes recorrer el índice que aparece debajo.');
      });
    return () => {
      controller.abort();
      window.removeEventListener('popstate', read);
    };
  }, [indexUrl]);
  const filtered = useMemo(() => search(items, state), [items, state]),
    pages = Math.max(1, Math.ceil(filtered.length / 8)),
    page = Math.min(state.page, pages);
  function update(change: Partial<SearchState>) {
    const next = { ...state, ...change };
    setState(next);
    const params = searchParams(next).toString();
    history.pushState(null, '', location.pathname + (params ? '?' + params : ''));
  }
  const kinds =
    kind === 'publications'
      ? ['explainer', 'investigation', 'fact-check', 'data-story', 'testimony', 'guide']
      : [
          'report',
          'dataset',
          'academic-paper',
          'news-article',
          'official-record',
          'interview',
          'web-page',
        ];
  return (
    <div className="search-surface js-only" data-ready={loaded}>
      {error ? (
        <p role="alert">{error}</p>
      ) : !loaded ? (
        <p role="status">Cargando búsqueda…</p>
      ) : (
        <>
          <div className="search-controls">
            <SearchInput
              label={
                kind === 'sources'
                  ? 'Buscar por título, autoría o institución'
                  : 'Buscar publicaciones'
              }
              value={state.q}
              onChange={(q) => update({ q, page: 1 })}
            />
            <FilterGroup
              label="Línea editorial"
              value={state.section}
              options={Object.entries(sectionNames).map(([value, label]) => ({ value, label }))}
              onChange={(section) => update({ section, page: 1 })}
            />
            <FilterGroup
              label="Tipo"
              value={state.kind}
              options={kinds.map((value) => ({ value, label: labels[value] }))}
              onChange={(kind) => update({ kind, page: 1 })}
            />
          </div>
          <div className="result-count">
            <p role="status">
              {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'} · Página {page}{' '}
              de {pages}
            </p>
            {(state.q || state.section || state.kind) && (
              <button
                type="button"
                onClick={() => update({ q: '', section: '', kind: '', page: 1 })}
              >
                Limpiar filtros
              </button>
            )}
          </div>
          <ResultsList items={filtered.slice((page - 1) * 8, page * 8)} />
          <Pagination page={page} pages={pages} onPage={(page) => update({ page })} />
        </>
      )}
    </div>
  );
}
