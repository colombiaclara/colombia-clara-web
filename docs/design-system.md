# Sistema de diseño

## Reutilizar una pieza

Elige el tipo de bloque y su variante semántica en JSON. El editor no selecciona fuentes, colores hexadecimales ni estilos libres. Los tokens están en `src/styles/tokens.css` y la composición en `global.css`.

| Token             | Valor     | Uso                |
| ----------------- | --------- | ------------------ |
| `--paper`         | `#ffffff` | Fondo principal    |
| `--subtle`        | `#f5f4ef` | Contexto           |
| `--ink`           | `#17252b` | Texto              |
| `--muted`         | `#526168` | Metadatos          |
| `--brand`         | `#006d77` | Firma y enlaces    |
| `--focus`         | `#004bb5` | Foco visible       |
| `--control`       | `#78888e` | Borde de controles |
| `--sin-mordaza`   | `#a52a3a` | Investigación      |
| `--datos-claros`  | `#2457a7` | Datos              |
| `--planeta-comun` | `#28734f` | Ambiente           |
| `--voces-claras`  | `#75449a` | Testimonios        |
| `--escuela-clara` | `#8a5700` | Aprendizaje        |

El contenido de lectura utiliza Source Serif 4 a 18 px y un interlineado de 1,65. La interfaz usa Source Sans 3. Solo se cargan los pesos 400, 600 y 700 que necesita cada página; `font-display: swap` evita ocultar texto.

La composición cambia a partir de 720 y 1000 px según el espacio disponible. La revisión contempla 320, 390, 768, 1024 y 1440 px. Las tablas tienen scroll interno con región etiquetada y operable por teclado. Los títulos no tienen alturas fijas ni recorte por líneas.

El foco utiliza un contorno visible con separación. La navegación móvil usa `details/summary`, sirve sin JavaScript y admite Escape con retorno de foco. Las citas siguen siendo enlaces. El scroll es nativo y se respeta `prefers-reduced-motion`.

## Biblioteca

| Grupo         | Componentes                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| Lectura       | Paragraph, Heading, List, Quote, Image, ContextNote, Timeline, Methodology, Corrections |
| Datos         | ChartFrame, ChartCanvas, DataTable, Metric                                              |
| Evidencia     | Citation, SourceReference, SourceCard, SourceDetails, SourcePublicationLinks            |
| Publicaciones | PublicationHeader, PublicationSummary, AuthorByline, KeyPoints, RelatedPublications     |
| Navegación    | Header, MobileNavigation, Breadcrumbs, Footer, Pagination                               |
| Exploración   | Search, SearchInput, FilterGroup, ResultsList, EmptyState                               |
| Composición   | Inline, StaticBlock, Share                                                              |

Cada componente tiene props tipadas y un archivo de pruebas correspondiente. `npm run check:component-tests` comprueba ese inventario. Para inspeccionar los estados usa `npm run dev:demo`; la publicación «Un gráfico para cada pregunta» es el catálogo gráfico. Las pruebas de componente cubren también estados vacíos, fuentes incompletas, base cero y navegación.
