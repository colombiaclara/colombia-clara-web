import type { SearchItem } from './search';
import { labels, sectionNames, formatDate } from '../formatting/format';
import { EmptyState } from '../ui/EmptyState';
export function ResultsList({ items }: { items: SearchItem[] }) {
  return items.length ? (
    <div className="search-results">
      {items.map((item) => (
        <article key={item.id} className="search-result">
          <span className="kicker">
            {item.section ? sectionNames[item.section] : labels[item.type]}
          </span>
          <h3>
            <a href={item.url}>{item.title}</a>
          </h3>
          <p>{item.description}</p>
          <span className="small">
            {item.date
              ? formatDate(item.date)
              : item.uses !== undefined
                ? `${item.uses} publicaciones relacionadas`
                : ''}
          </span>
        </article>
      ))}
    </div>
  ) : (
    <EmptyState
      title="No encontramos resultados"
      description="Prueba con otra palabra o elimina alguno de los filtros."
    />
  );
}
