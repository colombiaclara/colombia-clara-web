import type {
  Publication,
  Page,
  Source,
  Author,
  Dataset,
  Site,
  Home,
  Sections,
  Citation,
} from '../generated/content';
export type { Publication, Page, Source, Author, Dataset, Site, Home, Sections, Citation };
export interface ResolvedImage {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  caption?: string;
  license?: string;
}
export interface Usage {
  id: string;
  title: string;
  url: string;
  section?: string;
  institutional: boolean;
  anchors: string[];
}
export interface ResolvedDocument {
  document: Publication | Page;
  url: string;
  institutional: boolean;
  demo: boolean;
  readingMinutes: number;
  sources: Record<string, Source>;
  datasets: Record<string, Dataset>;
  datasetUrls: Record<string, string>;
  images: Record<string, ResolvedImage>;
  authors: Author[];
  relatedIds: string[];
}
export interface Model {
  site: Site;
  home: Home;
  sections: Sections;
  publications: ResolvedDocument[];
  pages: ResolvedDocument[];
  sources: Record<string, Source>;
  uses: Record<string, Usage[]>;
  sourceAssets: Record<string, string>;
  base: string;
  origin: string;
  demo: boolean;
  warnings: string[];
}
