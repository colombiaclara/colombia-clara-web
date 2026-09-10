import type { RichContent } from '../../generated/content';
import type { ContentContext } from './context';
import { Citation } from '../sources/Citation';
import { withBase } from '../formatting/format';
export function Inline({ content, context }: { content: RichContent; context: ContentContext }) {
  if (typeof content === 'string') return <>{content}</>;
  return (
    <>
      {content.map((node, i) =>
        node.type === 'citation' ? (
          <Citation key={i} citation={node.citation} context={context} />
        ) : node.type === 'strong' ? (
          <strong key={i}>{node.content}</strong>
        ) : node.type === 'emphasis' ? (
          <em key={i}>{node.content}</em>
        ) : node.type === 'link' ? (
          <a key={i} href={withBase(node.href, context.base)}>
            {node.content}
          </a>
        ) : (
          <span key={i}>{node.content}</span>
        ),
      )}
    </>
  );
}
