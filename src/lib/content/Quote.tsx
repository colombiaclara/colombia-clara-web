import type { QuoteBlock } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { Inline } from '../rendering/Inline';
import { SourceReference } from '../sources/SourceReference';
export function Quote({ block, context }: { block: QuoteBlock; context: ContentContext }) {
  return (
    <blockquote>
      <p>
        <Inline content={block.content} context={context} />
      </p>
      <footer>
        {block.attribution} <SourceReference citations={block.citations} context={context} />
      </footer>
    </blockquote>
  );
}
