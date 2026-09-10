import type { Source } from '../../generated/content';
import { labels } from '../formatting/format';
export function SourceCard({
  source,
  base,
  count,
}: {
  source: Source;
  base: string;
  count: number;
}) {
  return (
    <article className="source-card">
      <span className="kicker">{labels[source.kind]}</span>
      <h3>
        <a href={`${base}fuentes/${source.id}/`}>{source.title}</a>
      </h3>
      <p>{source.creators.map((c) => c.name).join(', ')}</p>
      <p className="small">
        {count} {count === 1 ? 'publicación la utiliza' : 'publicaciones la utilizan'}
      </p>
    </article>
  );
}
