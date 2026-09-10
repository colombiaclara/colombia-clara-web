import type { Publication } from '../../generated/content';
import { PublicationSummary } from './PublicationSummary';
export function RelatedPublications({
  publications,
  base,
}: {
  publications: Publication[];
  base: string;
}) {
  return publications.length ? (
    <section id="relacionados" className="related">
      <h2>Para seguir leyendo</h2>
      <div className="publication-grid">
        {publications.map((p) => (
          <PublicationSummary key={p.id} publication={p} base={base} />
        ))}
      </div>
    </section>
  ) : null;
}
