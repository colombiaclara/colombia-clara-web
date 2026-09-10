import type { Block } from '../../generated/content';
import type { ContentContext } from './context';
import { Paragraph } from '../content/Paragraph';
import { Heading } from '../content/Heading';
import { List } from '../content/List';
import { Quote } from '../content/Quote';
import { ContextNote } from '../content/ContextNote';
import { Timeline } from '../content/Timeline';
import { Methodology } from '../content/Methodology';
import { Metric } from '../charts/Metric';
export function StaticBlock({ block, context }: { block: Block; context: ContentContext }) {
  switch (block.type) {
    case 'paragraph':
      return <Paragraph block={block} context={context} />;
    case 'heading':
      return <Heading block={block} />;
    case 'list':
      return <List block={block} context={context} />;
    case 'quote':
      return <Quote block={block} context={context} />;
    case 'context':
      return <ContextNote block={block} context={context} />;
    case 'timeline':
      return <Timeline block={block} context={context} />;
    case 'methodology':
      return <Methodology block={block} context={context} />;
    case 'metric':
      return <Metric block={block} context={context} />;
    default:
      return null;
  }
}
