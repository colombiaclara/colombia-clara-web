import type { MethodologyBlock } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { Inline } from '../rendering/Inline';
import { SourceReference } from '../sources/SourceReference';
export function Methodology({
  block,
  context,
}: {
  block: MethodologyBlock;
  context: ContentContext;
}) {
  return (
    <section className="methodology" aria-label={block.title}>
      <h3>{block.title}</h3>
      <p>
        <Inline content={block.content} context={context} />{' '}
        <SourceReference citations={block.citations} context={context} />
      </p>
    </section>
  );
}
