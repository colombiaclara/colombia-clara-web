import type { ParagraphBlock } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { Inline } from '../rendering/Inline';
import { SourceReference } from '../sources/SourceReference';
export function Paragraph({ block, context }: { block: ParagraphBlock; context: ContentContext }) {
  return (
    <p>
      <Inline content={block.content} context={context} />{' '}
      <SourceReference citations={block.citations} context={context} />
    </p>
  );
}
