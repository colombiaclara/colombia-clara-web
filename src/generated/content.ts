/* Generado desde schemas/editorial.schema.json. No editar. */

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | QuoteBlock
  | ImageBlock
  | ContextBlock
  | TimelineBlock
  | MethodologyBlock
  | MetricBlock
  | TableBlock
  | ChartBlock;
/**
 * Texto plano o nodos inline permitidos. No HTML ni Markdown.
 */
export type RichContent = string | InlineNode[];
export type InlineNode =
  | {
      /**
       * Tipo de publicación, bloque, nodo o variable dentro del contrato.
       */
      type: "text" | "emphasis" | "strong";
      /**
       * Texto plano o nodos inline permitidos. No HTML ni Markdown.
       */
      content: string;
    }
  | {
      /**
       * Tipo de publicación, bloque, nodo o variable dentro del contrato.
       */
      type: "link";
      /**
       * Texto plano o nodos inline permitidos. No HTML ni Markdown.
       */
      content: string;
      /**
       * Enlace HTTP(S), ruta interna desde / o ancla; no esquemas ejecutables.
       */
      href: string;
    }
  | {
      /**
       * Tipo de publicación, bloque, nodo o variable dentro del contrato.
       */
      type: "citation";
      citation: Citation;
    };
/**
 * Texto plano o nodos inline permitidos. No HTML ni Markdown.
 */
export type RichContent1 = string | InlineNode[];
/**
 * Texto plano o nodos inline permitidos. No HTML ni Markdown.
 */
export type RichContent2 = string | InlineNode[];
/**
 * Texto plano o nodos inline permitidos. No HTML ni Markdown.
 */
export type RichContent3 = string | InlineNode[];
/**
 * Texto plano o nodos inline permitidos. No HTML ni Markdown.
 */
export type RichContent4 = string | InlineNode[];
/**
 * Texto plano o nodos inline permitidos. No HTML ni Markdown.
 */
export type RichContent5 = string | InlineNode[];

/**
 * Contrato canónico Colombia Clara v1.0. Los tipos TypeScript se generan desde este archivo.
 */
export interface EditorialModel {
  publication: Publication;
  page: Page;
  source: Source;
  author: Author;
  dataset: Dataset;
  site: Site;
  home: Home;
  sections: Sections;
}
export interface Publication {
  /**
   * Ruta al esquema local para autocompletado; opcional.
   */
  $schema?: string;
  /**
   * Versión del contrato. Usa 1.0.
   */
  schemaVersion: "1.0";
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Nombre de la carpeta y de la URL, sin tildes ni espacios.
   */
  slug: string;
  /**
   * draft excluye producción; published requiere revisión editorial y fecha.
   */
  status: "draft" | "published";
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  /**
   * Resumen fiel al contenido, sin introducir afirmaciones adicionales.
   */
  description: string;
  /**
   * Fecha editorial real AAAA-MM-DD. No inventar si se desconoce en fuentes.
   */
  publishedAt?: string;
  /**
   * Fecha real de cambio editorial; nunca la fecha de recompilación.
   */
  updatedAt?: string;
  /**
   * Lista ordenada de bloques que forman toda la lectura.
   *
   * @minItems 1
   * @maxItems 300
   */
  blocks: Block[];
  /**
   * Slugs anteriores para generar páginas estáticas de traslado.
   */
  previousSlugs?: string[];
  /**
   * Cambios sustanciales con fecha, explicación y apartados afectados.
   */
  corrections?: Correction[];
  /**
   * Identificador de una de las cinco líneas editoriales.
   */
  section: "sin-mordaza" | "datos-claros" | "planeta-comun" | "voces-claras" | "escuela-clara";
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "explainer" | "investigation" | "fact-check" | "data-story" | "testimony" | "guide";
  /**
   * IDs de fichas de autoría reales, sin nombres escritos directamente aquí.
   *
   * @minItems 1
   */
  authors: string[];
  /**
   * Etiquetas breves para encontrar contenido relacionado; sin duplicados.
   *
   * @maxItems 12
   */
  tags: string[];
  lead: RichText1;
  /**
   * Hasta tres ideas iniciales y sus citas cuando expresen hechos.
   *
   * @maxItems 3
   */
  keyPoints?: RichText[];
  cover?: ImageSpec1;
  /**
   * @maxItems 4
   */
  related?: string[];
}
export interface ParagraphBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "paragraph";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  content: RichContent;
  /**
   * Naturaleza editorial del párrafo; no equivale a una certificación.
   */
  evidence: "fact" | "declaration" | "analysis" | "opinion" | "transition";
}
export interface Citation {
  /**
   * ID de una ficha en content/sources/.
   */
  sourceId: string;
  /**
   * Página, sección, tabla, fragmento o minuto que respalda la cita.
   */
  locator?: {
    /**
     * Tipo de publicación, bloque, nodo o variable dentro del contrato.
     */
    type: "page" | "section" | "table" | "fragment" | "timestamp";
    /**
     * Valor del campo o localizador según el tipo de bloque.
     */
    value: string;
  };
  /**
   * Papel primario o secundario de la fuente en esta cita concreta.
   */
  role?: "primary" | "secondary";
  /**
   * Alcance o límite de la evidencia, visible junto a la referencia.
   */
  note?: string;
}
export interface HeadingBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "heading";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  /**
   * Texto plano o nodos inline permitidos. No HTML ni Markdown.
   */
  content: string;
  /**
   * Nivel 2 o 3, sin saltar la jerarquía de encabezados.
   */
  level: 2 | 3;
}
export interface ListBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "list";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  /**
   * Elementos ordenados del componente.
   *
   * @minItems 1
   * @maxItems 100
   */
  items: RichText[];
  /**
   * true crea una lista numerada.
   */
  ordered?: boolean;
}
export interface RichText {
  content: RichContent1;
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
}
export interface QuoteBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "quote";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  content: RichContent2;
  /**
   * Persona o documento al que se atribuye la cita.
   */
  attribution: string;
}
export interface ImageBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "image";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  image: ImageSpec;
}
/**
 * Ficha de imagen con ruta, alt y crédito.
 */
export interface ImageSpec {
  /**
   * Ruta local dentro de assets/, sin salir de la carpeta.
   */
  src: string;
  /**
   * Descripción alternativa de la información visual; vacío solo si es decorativa.
   */
  alt: string;
  /**
   * Autoría o procedencia confirmada de la imagen.
   */
  credit: string;
  /**
   * Pie que aporta contexto a la imagen.
   */
  caption?: string;
  /**
   * Licencia o condición de uso comprobada.
   */
  license?: string;
}
export interface ContextBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "context";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  content: RichContent3;
  /**
   * context, uncertainty o correction para presentar la nota.
   */
  tone: "context" | "uncertainty" | "correction";
}
export interface TimelineBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "timeline";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  /**
   * Elementos ordenados del componente.
   *
   * @minItems 1
   */
  items: {
    /**
     * Fecha editorial AAAA-MM-DD, sin hora.
     */
    date: string;
    /**
     * Título concreto y legible que describe el asunto o el componente.
     */
    title: string;
    content: RichContent4;
    /**
     * Fuentes que respaldan este contenido, con localizador cuando corresponda.
     *
     * @minItems 1
     */
    citations: Citation[];
  }[];
}
export interface MethodologyBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "methodology";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  content: RichContent5;
}
export interface MetricBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "metric";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  /**
   * Valor del campo o localizador según el tipo de bloque.
   */
  value: number;
  /**
   * Unidad observada y comparable; % son puntos de porcentaje, no fracciones.
   */
  unit: string;
  /**
   * Periodo o marco temporal al que se refiere la cifra.
   */
  period: string;
  /**
   * Valor y periodo base para la comparación del indicador.
   */
  comparison?: {
    /**
     * Valor del campo o localizador según el tipo de bloque.
     */
    value: number;
    /**
     * Periodo o marco temporal al que se refiere la cifra.
     */
    period: string;
    /**
     * Tipo conocido de gráfico o de documento fuente.
     */
    kind: "relative" | "percentage-points";
  };
}
export interface TableBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "table";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  /**
   * Ruta datasets/<id>.json dentro del directorio de la publicación.
   */
  dataset: string;
}
export interface ChartBlock {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "chart";
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
  /**
   * reading o wide. Los gráficos y tablas se adaptan a su contenedor.
   */
  width?: "reading" | "wide";
  /**
   * Tipo conocido de gráfico o de documento fuente.
   */
  kind:
    | "bar"
    | "grouped-bar"
    | "stacked-bar"
    | "stacked-bar-100"
    | "line"
    | "area"
    | "pie"
    | "donut"
    | "scatter"
    | "histogram"
    | "dumbbell"
    | "heatmap";
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  /**
   * Resumen fiel al contenido, sin introducir afirmaciones adicionales.
   */
  description: string;
  /**
   * Ruta datasets/<id>.json dentro del directorio de la publicación.
   */
  dataset: string;
  /**
   * Relación declarativa entre columnas y los elementos del gráfico.
   */
  encoding: {
    /**
     * ID de columna de categorías; date en líneas y áreas.
     */
    category?: string;
    /**
     * Valor del campo o localizador según el tipo de bloque.
     */
    value?: string;
    /**
     * ID de columna del eje X; numérica en dispersión.
     */
    x?: string;
    /**
     * ID de columna del eje Y; numérica en dispersión.
     */
    y?: string;
    /**
     * IDs de columnas numéricas que se comparan; unidades compatibles.
     *
     * @minItems 1
     * @maxItems 12
     */
    series?: string[];
    /**
     * ID de la columna numérica del primer momento.
     */
    start?: string;
    /**
     * ID de la columna numérica del segundo momento.
     */
    end?: string;
  };
  options?: ChartOptions;
}
/**
 * Opciones semánticas conocidas; no acepta funciones ni CSS.
 */
export interface ChartOptions {
  /**
   * Barras horizontales o verticales.
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Objetivo de 2 a 50 intervalos para el histograma; D3 puede ajustar límites.
   */
  bins?: number;
  /**
   * Permite activar y desactivar las series del gráfico.
   */
  seriesFilter?: boolean;
  /**
   * Permite filtrar desde/hasta sobre la columna de fechas.
   */
  periodFilter?: boolean;
  /**
   * Orden de entrada, ascendente o descendente en gráficos categóricos compatibles.
   */
  sort?: "input" | "ascending" | "descending";
  /**
   * number, percent o currency; no convierte unidades ni divisas.
   */
  format?: "number" | "percent" | "currency";
  /**
   * Moneda de los datos: COP, USD, EUR o CHF.
   */
  currency?: "COP" | "USD" | "EUR" | "CHF";
  /**
   * Máximo de decimales visibles, de 0 a 6. El CSV conserva precisión.
   */
  decimals?: number;
  /**
   * linear o log; log solo en líneas de valores positivos.
   */
  scale?: "linear" | "log";
  /**
   * Mínimo y máximo explícitos de una línea; nunca oculta observaciones.
   *
   * @minItems 2
   * @maxItems 2
   */
  domain?: number[];
}
export interface Correction {
  /**
   * Fecha editorial AAAA-MM-DD, sin hora.
   */
  date: string;
  /**
   * Resumen fiel al contenido, sin introducir afirmaciones adicionales.
   */
  description: string;
  /**
   * Lista ordenada de bloques que forman toda la lectura.
   *
   * @minItems 1
   */
  blocks: string[];
}
/**
 * Entradilla, texto o nodos inline con sus referencias.
 */
export interface RichText1 {
  content: RichContent1;
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @maxItems 50
   */
  citations?: Citation[];
}
/**
 * Imagen opcional de portada, con ruta, alt y crédito.
 */
export interface ImageSpec1 {
  /**
   * Ruta local dentro de assets/, sin salir de la carpeta.
   */
  src: string;
  /**
   * Descripción alternativa de la información visual; vacío solo si es decorativa.
   */
  alt: string;
  /**
   * Autoría o procedencia confirmada de la imagen.
   */
  credit: string;
  /**
   * Pie que aporta contexto a la imagen.
   */
  caption?: string;
  /**
   * Licencia o condición de uso comprobada.
   */
  license?: string;
}
export interface Page {
  /**
   * Ruta al esquema local para autocompletado; opcional.
   */
  $schema?: string;
  /**
   * Versión del contrato. Usa 1.0.
   */
  schemaVersion: "1.0";
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Nombre de la carpeta y de la URL, sin tildes ni espacios.
   */
  slug: string;
  /**
   * draft excluye producción; published requiere revisión editorial y fecha.
   */
  status: "draft" | "published";
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  /**
   * Resumen fiel al contenido, sin introducir afirmaciones adicionales.
   */
  description: string;
  /**
   * Fecha editorial real AAAA-MM-DD. No inventar si se desconoce en fuentes.
   */
  publishedAt?: string;
  /**
   * Fecha real de cambio editorial; nunca la fecha de recompilación.
   */
  updatedAt?: string;
  /**
   * Lista ordenada de bloques que forman toda la lectura.
   *
   * @minItems 1
   * @maxItems 300
   */
  blocks: Block[];
  /**
   * Slugs anteriores para generar páginas estáticas de traslado.
   */
  previousSlugs?: string[];
  /**
   * Cambios sustanciales con fecha, explicación y apartados afectados.
   */
  corrections?: Correction[];
}
export interface Source {
  /**
   * Ruta al esquema local para autocompletado; opcional.
   */
  $schema?: string;
  /**
   * Versión del contrato. Usa 1.0.
   */
  schemaVersion: "1.0";
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  /**
   * Tipo conocido de gráfico o de documento fuente.
   */
  kind: "report" | "dataset" | "academic-paper" | "news-article" | "official-record" | "interview" | "web-page";
  /**
   * Autorías del documento fuente, no nombres inventados.
   *
   * @minItems 1
   */
  creators: {
    /**
     * Nombre público confirmado.
     */
    name: string;
  }[];
  /**
   * Institución o entidad editora cuando se conoce.
   */
  publisher?: string;
  /**
   * URL HTTP(S) pública del recurso original.
   */
  url?: string;
  /**
   * Fecha editorial real AAAA-MM-DD. No inventar si se desconoce en fuentes.
   */
  publishedAt?: string;
  /**
   * Día en que se consultó el recurso, formato AAAA-MM-DD.
   */
  accessedAt: string;
  /**
   * Idioma de la fuente, por ejemplo es.
   */
  language: string;
  /**
   * Resumen fiel al contenido, sin introducir afirmaciones adicionales.
   */
  description: string;
  /**
   * URL HTTP(S) de una copia archivada identificable.
   */
  archivedUrl?: string;
  /**
   * Edición o versión del documento consultado.
   */
  edition?: string;
  /**
   * Ruta a un recurso local publicable dentro de assets/.
   */
  asset?: string;
}
export interface Author {
  /**
   * Ruta al esquema local para autocompletado; opcional.
   */
  $schema?: string;
  /**
   * Versión del contrato. Usa 1.0.
   */
  schemaVersion: "1.0";
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Nombre público confirmado.
   */
  name: string;
  /**
   * Biografía breve y confirmada.
   */
  bio: string;
  /**
   * URL HTTP(S) pública del recurso original.
   */
  url?: string;
}
/**
 * Ruta datasets/<id>.json dentro del directorio de la publicación.
 */
export interface Dataset {
  /**
   * Ruta al esquema local para autocompletado; opcional.
   */
  $schema?: string;
  /**
   * Versión del contrato. Usa 1.0.
   */
  schemaVersion: "1.0";
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  /**
   * Definición única de las columnas y sus tipos.
   *
   * @minItems 1
   * @maxItems 50
   */
  columns: Column[];
  /**
   * Filas por ID de columna. Usa null para ausente y 0 para cero observado.
   *
   * @maxItems 20000
   */
  rows: {
    [k: string]: string | number | null;
  }[];
  /**
   * Fuentes que respaldan este contenido, con localizador cuando corresponda.
   *
   * @minItems 1
   */
  citations: Citation[];
  /**
   * Origen, selección, transformaciones y límites del dataset.
   */
  methodology: string;
  /**
   * Cobertura territorial de los datos cuando corresponde.
   */
  geography?: string;
  /**
   * Periodo o marco temporal al que se refiere la cifra.
   */
  period?: string;
  /**
   * Fórmula y entradas utilizadas para producir datos calculados.
   */
  calculation?: {
    /**
     * Descripción legible de la fórmula; no código ejecutable.
     */
    formula: string;
    /**
     * Datos de entrada o sus referencias publicables.
     *
     * @minItems 1
     */
    inputs: string[];
    /**
     * Regla de redondeo aplicada al cálculo.
     */
    rounding?: string;
  };
}
export interface Column {
  /**
   * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
   */
  id: string;
  /**
   * Nombre legible que verá la persona usuaria.
   */
  label: string;
  /**
   * Tipo de publicación, bloque, nodo o variable dentro del contrato.
   */
  type: "string" | "number" | "date";
  /**
   * Unidad observada y comparable; % son puntos de porcentaje, no fracciones.
   */
  unit?: string;
}
export interface Site {
  /**
   * Ruta al esquema local para autocompletado; opcional.
   */
  $schema?: string;
  /**
   * Versión del contrato. Usa 1.0.
   */
  schemaVersion: "1.0";
  /**
   * Nombre público confirmado.
   */
  name: string;
  /**
   * Lema público de Colombia Clara.
   */
  tagline: string;
  /**
   * Descripción institucional del proyecto.
   */
  descriptor: string;
  /**
   * Resumen fiel al contenido, sin introducir afirmaciones adicionales.
   */
  description: string;
  /**
   * Enlaces públicos de navegación, con etiqueta y ruta.
   *
   * @minItems 1
   */
  navigation: {
    /**
     * Nombre legible que verá la persona usuaria.
     */
    label: string;
    /**
     * Ruta pública interna empezando por /.
     */
    path: string;
  }[];
  /**
   * Correo confirmado; omitir si no existe un canal real.
   */
  contact?: string;
}
export interface Home {
  /**
   * Ruta al esquema local para autocompletado; opcional.
   */
  $schema?: string;
  /**
   * Versión del contrato. Usa 1.0.
   */
  schemaVersion: "1.0";
  /**
   * Etiqueta breve de contexto de la portada.
   */
  eyebrow: string;
  /**
   * Título concreto y legible que describe el asunto o el componente.
   */
  title: string;
  /**
   * Introducción breve editable para la portada.
   */
  introduction: string;
  /**
   * IDs publicados para priorizar en portada; opcional.
   *
   * @maxItems 5
   */
  featured?: string[];
}
export interface Sections {
  /**
   * Ruta al esquema local para autocompletado; opcional.
   */
  $schema?: string;
  /**
   * Versión del contrato. Usa 1.0.
   */
  schemaVersion: "1.0";
  /**
   * Elementos ordenados del componente.
   *
   * @minItems 5
   * @maxItems 5
   */
  items: {
    /**
     * Identidad estable en minúsculas y guiones; no cambia al corregir títulos.
     */
    id: "sin-mordaza" | "datos-claros" | "planeta-comun" | "voces-claras" | "escuela-clara";
    /**
     * Nombre público confirmado.
     */
    name: string;
    /**
     * Resumen fiel al contenido, sin introducir afirmaciones adicionales.
     */
    description: string;
    /**
     * Pregunta que orienta una línea editorial.
     */
    question: string;
  }[];
}
