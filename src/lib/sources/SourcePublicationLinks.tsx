import type { Usage } from '../../build/types';
export function SourcePublicationLinks({ uses }: { uses: Usage[] }) {
  return (
    <section id="citas" className="source-uses">
      {[false, true].map((institutional) => {
        const rows = uses.filter((u) => u.institutional === institutional);
        return rows.length ? (
          <div key={String(institutional)}>
            <h2>
              {institutional
                ? 'Otras páginas que citan esta fuente'
                : 'Publicaciones que utilizan esta fuente'}
            </h2>
            {rows.map((u) => (
              <article key={u.id}>
                <h3>
                  <a href={u.url}>{u.title}</a>
                </h3>
                <div className="anchor-links">
                  {u.anchors.map((a, i) => (
                    <a key={a} href={`${u.url}#${a}`}>
                      Ir a la cita {i + 1}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : null;
      })}
    </section>
  );
}
