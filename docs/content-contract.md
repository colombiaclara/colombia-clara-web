# Contrato editorial v1.0

## Ejemplo mínimo de publicación

Copia una plantilla y completa `page.json`. El contrato canónico es `schemas/editorial.schema.json`; los demás archivos de schemas enlazan a sus definiciones. TypeScript se genera con `npm run generate:types`, nunca se mantiene a mano.

```json
{
  "schemaVersion": "1.0",
  "id": "pub-nueva-historia",
  "slug": "nueva-historia",
  "status": "draft",
  "title": "Título que debes completar",
  "description": "Resumen fiel al contenido que vas a escribir.",
  "section": "escuela-clara",
  "type": "guide",
  "authors": ["autor-por-definir"],
  "tags": [],
  "lead": { "content": "Entradilla que debes completar." },
  "blocks": [
    {
      "id": "introduccion",
      "type": "paragraph",
      "evidence": "transition",
      "content": "Desarrolla el asunto y añade referencias para las afirmaciones factuales."
    }
  ]
}
```

Este JSON es una plantilla para editar; la ficha de autor debe existir. Cambia su identidad por la autoría real antes de publicar. `published` exige `publishedAt`. El directorio coincide con `slug`, mientras `id` conserva identidad al cambiar el título.

Un párrafo enriquecido utiliza una secuencia como `[{"type":"strong","content":"Una idea"},{"type":"text","content":" y su explicación."}]`. Las citas inline usan `{"type":"citation","citation":{"sourceId":"fuente-registrada"}}`. No se permite HTML, JSX, imports, funciones ni CSS editorial.

Los ejemplos completos y conectados de publicación, fuente, dataset e imagen están en `tests/fixtures/demo/content/`. Son sintéticos y su sitio queda aislado de producción.

## Campos y enums

Las siguientes tablas se derivan del esquema canónico. Los requisitos editoriales que no pueden decidirse automáticamente se explican en las guías de [edición](editorial-guide.md), [fuentes](source-guide.md) y [gráficos](chart-guide.md).

### Citation

| Campo      | Obligatorio | Tipo o valores     | Descripción                                                      |
| ---------- | ----------- | ------------------ | ---------------------------------------------------------------- |
| `sourceId` | Sí          | string             | ID de una ficha en content/sources/.                             |
| `locator`  | No          | object             | Página, sección, tabla, fragmento o minuto que respalda la cita. |
| `role`     | No          | primary, secondary | Papel primario o secundario de la fuente en esta cita concreta.  |
| `note`     | No          | string             | Alcance o límite de la evidencia, visible junto a la referencia. |

### RichText

| Campo       | Obligatorio | Tipo o valores | Descripción                                                               |
| ----------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `content`   | Sí          | RichContent    | Texto plano o nodos inline permitidos. No HTML ni Markdown.               |
| `citations` | No          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |

### ImageSpec

| Campo     | Obligatorio | Tipo o valores | Descripción                                                                    |
| --------- | ----------- | -------------- | ------------------------------------------------------------------------------ |
| `src`     | Sí          | string         | Ruta local dentro de assets/, sin salir de la carpeta.                         |
| `alt`     | Sí          | string         | Descripción alternativa de la información visual; vacío solo si es decorativa. |
| `credit`  | Sí          | string         | Autoría o procedencia confirmada de la imagen.                                 |
| `caption` | No          | string         | Pie que aporta contexto a la imagen.                                           |
| `license` | No          | string         | Licencia o condición de uso comprobada.                                        |

### Column

| Campo   | Obligatorio | Tipo o valores       | Descripción                                                               |
| ------- | ----------- | -------------------- | ------------------------------------------------------------------------- |
| `id`    | Sí          | string               | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `label` | Sí          | string               | Nombre legible que verá la persona usuaria.                               |
| `type`  | Sí          | string, number, date | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `unit`  | No          | string               | Unidad observada y comparable; % son puntos de porcentaje, no fracciones. |

### Dataset

| Campo           | Obligatorio | Tipo o valores | Descripción                                                               |
| --------------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `$schema`       | No          | string         | Ruta al esquema local para autocompletado; opcional.                      |
| `schemaVersion` | Sí          | 1.0            | Versión del contrato. Usa 1.0.                                            |
| `id`            | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `title`         | Sí          | string         | Título concreto y legible que describe el asunto o el componente.         |
| `columns`       | Sí          | array          | Definición única de las columnas y sus tipos.                             |
| `rows`          | Sí          | array          | Filas por ID de columna. Usa null para ausente y 0 para cero observado.   |
| `citations`     | Sí          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `methodology`   | Sí          | string         | Origen, selección, transformaciones y límites del dataset.                |
| `geography`     | No          | string         | Cobertura territorial de los datos cuando corresponde.                    |
| `period`        | No          | string         | Periodo o marco temporal al que se refiere la cifra.                      |
| `calculation`   | No          | object         | Fórmula y entradas utilizadas para producir datos calculados.             |

### ChartOptions

| Campo          | Obligatorio | Tipo o valores               | Descripción                                                                     |
| -------------- | ----------- | ---------------------------- | ------------------------------------------------------------------------------- |
| `orientation`  | No          | horizontal, vertical         | Barras horizontales o verticales.                                               |
| `bins`         | No          | integer                      | Objetivo de 2 a 50 intervalos para el histograma; D3 puede ajustar límites.     |
| `seriesFilter` | No          | boolean                      | Permite activar y desactivar las series del gráfico.                            |
| `periodFilter` | No          | boolean                      | Permite filtrar desde/hasta sobre la columna de fechas.                         |
| `sort`         | No          | input, ascending, descending | Orden de entrada, ascendente o descendente en gráficos categóricos compatibles. |
| `format`       | No          | number, percent, currency    | number, percent o currency; no convierte unidades ni divisas.                   |
| `currency`     | No          | COP, USD, EUR, CHF           | Moneda de los datos: COP, USD, EUR o CHF.                                       |
| `decimals`     | No          | integer                      | Máximo de decimales visibles, de 0 a 6. El CSV conserva precisión.              |
| `scale`        | No          | linear, log                  | linear o log; log solo en líneas de valores positivos.                          |
| `domain`       | No          | array                        | Mínimo y máximo explícitos de una línea; nunca oculta observaciones.            |

### ParagraphBlock

| Campo       | Obligatorio | Tipo o valores                                   | Descripción                                                               |
| ----------- | ----------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| `id`        | Sí          | string                                           | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`      | Sí          | paragraph                                        | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations` | No          | array                                            | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`     | No          | reading, wide                                    | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `content`   | Sí          | RichContent                                      | Texto plano o nodos inline permitidos. No HTML ni Markdown.               |
| `evidence`  | Sí          | fact, declaration, analysis, opinion, transition | Naturaleza editorial del párrafo; no equivale a una certificación.        |

### HeadingBlock

| Campo       | Obligatorio | Tipo o valores | Descripción                                                               |
| ----------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `id`        | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`      | Sí          | heading        | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations` | No          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`     | No          | reading, wide  | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `content`   | Sí          | string         | Texto plano o nodos inline permitidos. No HTML ni Markdown.               |
| `level`     | Sí          | 2, 3           | Nivel 2 o 3, sin saltar la jerarquía de encabezados.                      |

### ListBlock

| Campo       | Obligatorio | Tipo o valores | Descripción                                                               |
| ----------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `id`        | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`      | Sí          | list           | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations` | No          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`     | No          | reading, wide  | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `items`     | Sí          | array          | Elementos ordenados del componente.                                       |
| `ordered`   | No          | boolean        | true crea una lista numerada.                                             |

### QuoteBlock

| Campo         | Obligatorio | Tipo o valores | Descripción                                                               |
| ------------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `id`          | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`        | Sí          | quote          | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations`   | Sí          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`       | No          | reading, wide  | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `content`     | Sí          | RichContent    | Texto plano o nodos inline permitidos. No HTML ni Markdown.               |
| `attribution` | Sí          | string         | Persona o documento al que se atribuye la cita.                           |

### ImageBlock

| Campo       | Obligatorio | Tipo o valores | Descripción                                                               |
| ----------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `id`        | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`      | Sí          | image          | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations` | No          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`     | No          | reading, wide  | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `image`     | Sí          | ImageSpec      | Ficha de imagen con ruta, alt y crédito.                                  |

### ContextBlock

| Campo       | Obligatorio | Tipo o valores                   | Descripción                                                               |
| ----------- | ----------- | -------------------------------- | ------------------------------------------------------------------------- |
| `id`        | Sí          | string                           | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`      | Sí          | context                          | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations` | No          | array                            | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`     | No          | reading, wide                    | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `title`     | Sí          | string                           | Título concreto y legible que describe el asunto o el componente.         |
| `content`   | Sí          | RichContent                      | Texto plano o nodos inline permitidos. No HTML ni Markdown.               |
| `tone`      | Sí          | context, uncertainty, correction | context, uncertainty o correction para presentar la nota.                 |

### TimelineBlock

| Campo       | Obligatorio | Tipo o valores | Descripción                                                               |
| ----------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `id`        | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`      | Sí          | timeline       | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations` | No          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`     | No          | reading, wide  | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `title`     | Sí          | string         | Título concreto y legible que describe el asunto o el componente.         |
| `items`     | Sí          | array          | Elementos ordenados del componente.                                       |

### MethodologyBlock

| Campo       | Obligatorio | Tipo o valores | Descripción                                                               |
| ----------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `id`        | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`      | Sí          | methodology    | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations` | No          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`     | No          | reading, wide  | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `title`     | Sí          | string         | Título concreto y legible que describe el asunto o el componente.         |
| `content`   | Sí          | RichContent    | Texto plano o nodos inline permitidos. No HTML ni Markdown.               |

### MetricBlock

| Campo        | Obligatorio | Tipo o valores | Descripción                                                               |
| ------------ | ----------- | -------------- | ------------------------------------------------------------------------- |
| `id`         | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`       | Sí          | metric         | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations`  | Sí          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`      | No          | reading, wide  | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `title`      | Sí          | string         | Título concreto y legible que describe el asunto o el componente.         |
| `value`      | Sí          | number         | Valor del campo o localizador según el tipo de bloque.                    |
| `unit`       | Sí          | string         | Unidad observada y comparable; % son puntos de porcentaje, no fracciones. |
| `period`     | Sí          | string         | Periodo o marco temporal al que se refiere la cifra.                      |
| `comparison` | No          | object         | Valor y periodo base para la comparación del indicador.                   |

### TableBlock

| Campo       | Obligatorio | Tipo o valores | Descripción                                                               |
| ----------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `id`        | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`      | Sí          | table          | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations` | No          | array          | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`     | No          | reading, wide  | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `title`     | Sí          | string         | Título concreto y legible que describe el asunto o el componente.         |
| `dataset`   | Sí          | string         | Ruta datasets/<id>.json dentro del directorio de la publicación.          |

### ChartBlock

| Campo         | Obligatorio | Tipo o valores                                                                                                | Descripción                                                               |
| ------------- | ----------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `id`          | Sí          | string                                                                                                        | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `type`        | Sí          | chart                                                                                                         | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `citations`   | No          | array                                                                                                         | Fuentes que respaldan este contenido, con localizador cuando corresponda. |
| `width`       | No          | reading, wide                                                                                                 | reading o wide. Los gráficos y tablas se adaptan a su contenedor.         |
| `kind`        | Sí          | bar, grouped-bar, stacked-bar, stacked-bar-100, line, area, pie, donut, scatter, histogram, dumbbell, heatmap | Tipo conocido de gráfico o de documento fuente.                           |
| `title`       | Sí          | string                                                                                                        | Título concreto y legible que describe el asunto o el componente.         |
| `description` | Sí          | string                                                                                                        | Resumen fiel al contenido, sin introducir afirmaciones adicionales.       |
| `dataset`     | Sí          | string                                                                                                        | Ruta datasets/<id>.json dentro del directorio de la publicación.          |
| `encoding`    | Sí          | object                                                                                                        | Relación declarativa entre columnas y los elementos del gráfico.          |
| `options`     | No          | ChartOptions                                                                                                  | Opciones semánticas conocidas; no acepta funciones ni CSS.                |

### Correction

| Campo         | Obligatorio | Tipo o valores | Descripción                                                         |
| ------------- | ----------- | -------------- | ------------------------------------------------------------------- |
| `date`        | Sí          | string         | Fecha editorial AAAA-MM-DD, sin hora.                               |
| `description` | Sí          | string         | Resumen fiel al contenido, sin introducir afirmaciones adicionales. |
| `blocks`      | Sí          | array          | Lista ordenada de bloques que forman toda la lectura.               |

### Publication

| Campo           | Obligatorio | Tipo o valores                                                        | Descripción                                                               |
| --------------- | ----------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `$schema`       | No          | string                                                                | Ruta al esquema local para autocompletado; opcional.                      |
| `schemaVersion` | Sí          | 1.0                                                                   | Versión del contrato. Usa 1.0.                                            |
| `id`            | Sí          | string                                                                | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `slug`          | Sí          | string                                                                | Nombre de la carpeta y de la URL, sin tildes ni espacios.                 |
| `status`        | Sí          | draft, published                                                      | draft excluye producción; published requiere revisión editorial y fecha.  |
| `title`         | Sí          | string                                                                | Título concreto y legible que describe el asunto o el componente.         |
| `description`   | Sí          | string                                                                | Resumen fiel al contenido, sin introducir afirmaciones adicionales.       |
| `publishedAt`   | No          | string                                                                | Fecha editorial real AAAA-MM-DD. No inventar si se desconoce en fuentes.  |
| `updatedAt`     | No          | string                                                                | Fecha real de cambio editorial; nunca la fecha de recompilación.          |
| `blocks`        | Sí          | array                                                                 | Lista ordenada de bloques que forman toda la lectura.                     |
| `previousSlugs` | No          | array                                                                 | Slugs anteriores para generar páginas estáticas de traslado.              |
| `corrections`   | No          | array                                                                 | Cambios sustanciales con fecha, explicación y apartados afectados.        |
| `section`       | Sí          | sin-mordaza, datos-claros, planeta-comun, voces-claras, escuela-clara | Identificador de una de las cinco líneas editoriales.                     |
| `type`          | Sí          | explainer, investigation, fact-check, data-story, testimony, guide    | Tipo de publicación, bloque, nodo o variable dentro del contrato.         |
| `authors`       | Sí          | array                                                                 | IDs de fichas de autoría reales, sin nombres escritos directamente aquí.  |
| `tags`          | Sí          | array                                                                 | Etiquetas breves para encontrar contenido relacionado; sin duplicados.    |
| `lead`          | Sí          | RichText                                                              | Entradilla, texto o nodos inline con sus referencias.                     |
| `keyPoints`     | No          | array                                                                 | Hasta tres ideas iniciales y sus citas cuando expresen hechos.            |
| `cover`         | No          | ImageSpec                                                             | Imagen opcional de portada, con ruta, alt y crédito.                      |
| `related`       | No          | array                                                                 | Ver definición del esquema.                                               |

### Page

| Campo           | Obligatorio | Tipo o valores   | Descripción                                                               |
| --------------- | ----------- | ---------------- | ------------------------------------------------------------------------- |
| `$schema`       | No          | string           | Ruta al esquema local para autocompletado; opcional.                      |
| `schemaVersion` | Sí          | 1.0              | Versión del contrato. Usa 1.0.                                            |
| `id`            | Sí          | string           | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `slug`          | Sí          | string           | Nombre de la carpeta y de la URL, sin tildes ni espacios.                 |
| `status`        | Sí          | draft, published | draft excluye producción; published requiere revisión editorial y fecha.  |
| `title`         | Sí          | string           | Título concreto y legible que describe el asunto o el componente.         |
| `description`   | Sí          | string           | Resumen fiel al contenido, sin introducir afirmaciones adicionales.       |
| `publishedAt`   | No          | string           | Fecha editorial real AAAA-MM-DD. No inventar si se desconoce en fuentes.  |
| `updatedAt`     | No          | string           | Fecha real de cambio editorial; nunca la fecha de recompilación.          |
| `blocks`        | Sí          | array            | Lista ordenada de bloques que forman toda la lectura.                     |
| `previousSlugs` | No          | array            | Slugs anteriores para generar páginas estáticas de traslado.              |
| `corrections`   | No          | array            | Cambios sustanciales con fecha, explicación y apartados afectados.        |

### Source

| Campo           | Obligatorio | Tipo o valores                                                                      | Descripción                                                               |
| --------------- | ----------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `$schema`       | No          | string                                                                              | Ruta al esquema local para autocompletado; opcional.                      |
| `schemaVersion` | Sí          | 1.0                                                                                 | Versión del contrato. Usa 1.0.                                            |
| `id`            | Sí          | string                                                                              | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `title`         | Sí          | string                                                                              | Título concreto y legible que describe el asunto o el componente.         |
| `kind`          | Sí          | report, dataset, academic-paper, news-article, official-record, interview, web-page | Tipo conocido de gráfico o de documento fuente.                           |
| `creators`      | Sí          | array                                                                               | Autorías del documento fuente, no nombres inventados.                     |
| `publisher`     | No          | string                                                                              | Institución o entidad editora cuando se conoce.                           |
| `url`           | No          | string                                                                              | URL HTTP(S) pública del recurso original.                                 |
| `publishedAt`   | No          | string                                                                              | Fecha editorial real AAAA-MM-DD. No inventar si se desconoce en fuentes.  |
| `accessedAt`    | Sí          | string                                                                              | Día en que se consultó el recurso, formato AAAA-MM-DD.                    |
| `language`      | Sí          | string                                                                              | Idioma de la fuente, por ejemplo es.                                      |
| `description`   | Sí          | string                                                                              | Resumen fiel al contenido, sin introducir afirmaciones adicionales.       |
| `archivedUrl`   | No          | string                                                                              | URL HTTP(S) de una copia archivada identificable.                         |
| `edition`       | No          | string                                                                              | Edición o versión del documento consultado.                               |
| `asset`         | No          | string                                                                              | Ruta a un recurso local publicable dentro de assets/.                     |

### Author

| Campo           | Obligatorio | Tipo o valores | Descripción                                                               |
| --------------- | ----------- | -------------- | ------------------------------------------------------------------------- |
| `$schema`       | No          | string         | Ruta al esquema local para autocompletado; opcional.                      |
| `schemaVersion` | Sí          | 1.0            | Versión del contrato. Usa 1.0.                                            |
| `id`            | Sí          | string         | Identidad estable en minúsculas y guiones; no cambia al corregir títulos. |
| `name`          | Sí          | string         | Nombre público confirmado.                                                |
| `bio`           | Sí          | string         | Biografía breve y confirmada.                                             |
| `url`           | No          | string         | URL HTTP(S) pública del recurso original.                                 |

### Site

| Campo           | Obligatorio | Tipo o valores | Descripción                                                         |
| --------------- | ----------- | -------------- | ------------------------------------------------------------------- |
| `$schema`       | No          | string         | Ruta al esquema local para autocompletado; opcional.                |
| `schemaVersion` | Sí          | 1.0            | Versión del contrato. Usa 1.0.                                      |
| `name`          | Sí          | string         | Nombre público confirmado.                                          |
| `tagline`       | Sí          | string         | Lema público de Colombia Clara.                                     |
| `descriptor`    | Sí          | string         | Descripción institucional del proyecto.                             |
| `description`   | Sí          | string         | Resumen fiel al contenido, sin introducir afirmaciones adicionales. |
| `navigation`    | Sí          | array          | Enlaces públicos de navegación, con etiqueta y ruta.                |
| `contact`       | No          | string         | Correo confirmado; omitir si no existe un canal real.               |

### Home

| Campo           | Obligatorio | Tipo o valores | Descripción                                                       |
| --------------- | ----------- | -------------- | ----------------------------------------------------------------- |
| `$schema`       | No          | string         | Ruta al esquema local para autocompletado; opcional.              |
| `schemaVersion` | Sí          | 1.0            | Versión del contrato. Usa 1.0.                                    |
| `eyebrow`       | Sí          | string         | Etiqueta breve de contexto de la portada.                         |
| `title`         | Sí          | string         | Título concreto y legible que describe el asunto o el componente. |
| `introduction`  | Sí          | string         | Introducción breve editable para la portada.                      |
| `featured`      | No          | array          | IDs publicados para priorizar en portada; opcional.               |

### Sections

| Campo           | Obligatorio | Tipo o valores | Descripción                                          |
| --------------- | ----------- | -------------- | ---------------------------------------------------- |
| `$schema`       | No          | string         | Ruta al esquema local para autocompletado; opcional. |
| `schemaVersion` | Sí          | 1.0            | Versión del contrato. Usa 1.0.                       |
| `items`         | Sí          | array          | Elementos ordenados del componente.                  |
