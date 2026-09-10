import type { ContextBlock } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { Inline } from '../rendering/Inline';
import { SourceReference } from '../sources/SourceReference';
export function ContextNote({ block, context }: { block: ContextBlock; context: ContentContext }) {
  return (
    <aside className={`context-note tone-${block.tone}`} aria-label={block.title}>
      <strong>{block.title}</strong>
      <p>
        <Inline content={block.content} context={context} />{' '}
        <SourceReference citations={block.citations} context={context} />
      </p>
    </aside>
  );
}
