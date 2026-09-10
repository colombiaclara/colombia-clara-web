import type { ListBlock } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { Inline } from '../rendering/Inline';
import { SourceReference } from '../sources/SourceReference';
export function List({ block, context }: { block: ListBlock; context: ContentContext }) {
  const Tag = block.ordered ? 'ol' : 'ul';
  return (
    <Tag>
      {block.items.map((item, i) => (
        <li key={i}>
          <Inline content={item.content} context={context} />{' '}
          <SourceReference citations={item.citations} context={context} />
        </li>
      ))}
    </Tag>
  );
}
