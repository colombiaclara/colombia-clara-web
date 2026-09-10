import sourceJson from './fixtures/demo/content/sources/src-demo-recuento/source.json';
import articleJson from './fixtures/demo/content/publications/leer-una-comparacion/page.json';
import datasetJson from './fixtures/demo/content/publications/leer-una-comparacion/datasets/comparacion.json';
import siteJson from '../content/site/site.json';
import type { Source, Publication, Dataset, Site, ChartBlock } from '../src/generated/content';
export const source = sourceJson as Source;
export const publication = articleJson as Publication;
export const dataset = datasetJson as Dataset;
export const site = siteJson as Site;
export const context = { base: '/cc/', sources: { [source.id]: source } };
export const citation = {
  sourceId: source.id,
  locator: { type: 'table' as const, value: 'Tabla 1' },
};
export const chart = publication.blocks.find((b) => b.type === 'chart') as ChartBlock;
