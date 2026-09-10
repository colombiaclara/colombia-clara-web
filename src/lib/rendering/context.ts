import type { Source } from '../../generated/content';
export interface ContentContext {
  base: string;
  sources: Record<string, Source>;
}
