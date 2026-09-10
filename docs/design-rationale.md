# Decisiones visuales

Consulta de referencias: 9 de septiembre de 2026. Implementación y revisión: septiembre de 2026.

La dirección es una publicación editorial de lectura cómoda: blanco, tipografía serif, reglas finas, una firma tipográfica y una marca breve de evidencia. La portada ofrece contenido cuando lo hay; su estado inicial explica honestamente el proyecto, sin simular historias publicadas.

La recopilación de [Figma sobre diseño web en 2026](https://www.figma.com/resource-library/web-design-trends/) sirve como referencia de identidad tipográfica. Es una observación editorial de tendencias, no una demostración de superioridad o dominancia de una estética. Se adopta una identidad tipográfica marcada; se omiten efectos continuos, scroll intervenido y decoraciones que compitan con la evidencia.

[Source Serif](https://github.com/adobe-fonts/source-serif) y [Source Sans](https://github.com/adobe-fonts/source-sans) se distribuyen localmente en WOFF2. Sus licencias OFL se conservan en `docs/licenses/`. Las fuentes no se solicitan a Google Fonts ni a otro proveedor en tiempo de lectura.

[WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) orienta contraste, teclado, foco y reflow. Los controles buscan 44 CSS px de altura como criterio de producto. El mínimo AA de tamaño de objetivo es distinto y admite excepciones; las capturas no son una certificación de conformidad.

Los gráficos reutilizan [D3](https://d3js.org/getting-started) para escalas, geometría e intervalos. El wrapper de React mantiene datos, tabla y descarga juntos y añade una exploración por registro apta para teclado y toque. La paleta estadística es independiente de las líneas editoriales.

Astro prerenderiza componentes y permite [hidratación selectiva](https://docs.astro.build/en/guides/framework-components/). Esa elección responde a la prioridad de lectura y al presupuesto inicial, no a una preferencia por animaciones o aplicación SPA.

Las imágenes sociales son composiciones tipográficas deterministas creadas durante el build con metadatos de cada publicación. No se generan fotografías documentales. El ejemplo de imagen del catálogo local es una muestra de color explícita.
