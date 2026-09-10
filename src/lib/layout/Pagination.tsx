export function Pagination({
  page,
  pages,
  onPage,
  links,
}: {
  page: number;
  pages: number;
  onPage?: (n: number) => void;
  links?: { label: string; href: string }[];
}) {
  if (pages < 2) return null;
  const visible = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 2,
  );
  return (
    <nav className="pagination" aria-label="Paginación">
      {links ? (
        links.map((l, i) => (
          <a key={l.href} href={l.href} aria-current={i + 1 === page ? 'page' : undefined}>
            {l.label}
          </a>
        ))
      ) : (
        <>
          <button type="button" disabled={page === 1} onClick={() => onPage?.(page - 1)}>
            Anterior
          </button>
          {visible.map((n, i) => (
            <span key={n}>
              {i > 0 && n - visible[i - 1] > 1 && <span>… </span>}
              <button
                type="button"
                aria-label={`Página ${n}`}
                aria-current={page === n ? 'page' : undefined}
                onClick={() => onPage?.(n)}
              >
                {n}
              </button>
            </span>
          ))}
          <button type="button" disabled={page === pages} onClick={() => onPage?.(page + 1)}>
            Siguiente
          </button>
        </>
      )}
    </nav>
  );
}
