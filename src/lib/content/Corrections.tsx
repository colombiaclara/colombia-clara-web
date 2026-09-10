import type { Correction } from '../../generated/content';
import { formatDate } from '../formatting/format';
export function Corrections({ items }: { items: Correction[] }) {
  if (!items.length) return null;
  return (
    <section id="correcciones" className="corrections">
      <h2>Correcciones</h2>
      {items.map((c, i) => (
        <div key={i}>
          <time dateTime={c.date}>{formatDate(c.date)}</time>
          <p>{c.description}</p>
          <p>
            {c.blocks.map((id) => (
              <a key={id} href={`#${id}`}>
                Ver apartado corregido
              </a>
            ))}
          </p>
        </div>
      ))}
    </section>
  );
}
