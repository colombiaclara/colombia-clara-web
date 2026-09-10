import type { Citation as CitationData } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
export function Citation({
  citation,
  context,
}: {
  citation: CitationData;
  context: ContentContext;
}) {
  const s = context.sources[citation.sourceId];
  const n = Object.keys(context.sources).sort().indexOf(citation.sourceId) + 1;
  return (
    <a
      className="citation"
      href={`${context.base}fuentes/${citation.sourceId}/`}
      title={[s?.title, citation.locator?.value, citation.note].filter(Boolean).join(' · ')}
      aria-label={`Fuente ${n}: ${s?.title ?? citation.sourceId}`}
    >
      [{n}]
    </a>
  );
}
