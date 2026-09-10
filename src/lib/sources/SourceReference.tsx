import type { Citation as CitationData } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { Citation } from './Citation';
export function SourceReference({
  citations = [],
  context,
}: {
  citations?: CitationData[];
  context: ContentContext;
}) {
  return (
    <span className="source-references">
      {citations.map((c, i) => (
        <span key={i}>
          <Citation citation={c} context={context} />
          {c.locator && <span className="locator"> {c.locator.value}</span>}
          {context.sources[c.sourceId]?.url && (
            <a
              className="original-link"
              href={context.sources[c.sourceId].url}
              aria-label={`Abrir original: ${context.sources[c.sourceId].title}`}
            >
              Original ↗
            </a>
          )}
          {c.note && <span className="citation-note">{c.note}</span>}
        </span>
      ))}
    </span>
  );
}
