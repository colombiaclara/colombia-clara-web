import type { RichText } from '../../generated/content';
import type { ContentContext } from '../rendering/context';
import { Inline } from '../rendering/Inline';
import { SourceReference } from '../sources/SourceReference';
export function KeyPoints({ items, context }: { items: RichText[]; context: ContentContext }) {
  return items.length ? (
    <aside id="ideas" className="key-points">
      <h2>Claves de lectura</h2>
      <ol>
        {items.map((item, i) => (
          <li key={i}>
            <Inline content={item.content} context={context} />{' '}
            <SourceReference citations={item.citations} context={context} />
          </li>
        ))}
      </ol>
    </aside>
  ) : null;
}
