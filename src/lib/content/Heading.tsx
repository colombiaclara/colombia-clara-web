import type { HeadingBlock } from '../../generated/content';
export function Heading({ block }: { block: HeadingBlock }) {
  return block.level === 2 ? <h2>{block.content}</h2> : <h3>{block.content}</h3>;
}
