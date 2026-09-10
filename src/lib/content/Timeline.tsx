import type { TimelineBlock } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { Inline } from '../rendering/Inline';
import { SourceReference } from '../sources/SourceReference';
import { formatDate } from '../formatting/format';
export function Timeline({ block, context }: { block: TimelineBlock; context: ContentContext }) {
  return (
    <section className="timeline" aria-label={block.title}>
      <h3>{block.title}</h3>
      <ol>
        {block.items.map((item, i) => (
          <li key={i}>
            <time dateTime={item.date}>{formatDate(item.date)}</time>
            <strong>{item.title}</strong>
            <p>
              <Inline content={item.content} context={context} />{' '}
              <SourceReference citations={item.citations} context={context} />
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
