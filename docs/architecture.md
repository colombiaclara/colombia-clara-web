# Arquitectura

## Recorrido de una publicación

`content/` → JSON Schema → validación semántica → selección pública → relaciones → recursos necesarios → Astro → `dist/`.

`src/build/load.ts` descubre carpetas por convención, comprueba contratos y referencias, calcula usos de fuentes y produce un modelo de lectura. `scripts/prepare.ts` selecciona los recursos utilizados, optimiza imágenes, genera índices, RSS, sitemap y el modelo temporal. `src/build/get-model.ts` es la única entrada de ese modelo a las plantillas Astro.

`src/lib/` contiene componentes React y lógica pura. No lee archivos ni importa el corpus. `src/components/Blocks.astro` usa imports explícitos y un registro conocido. Solo ChartFrame, Search y Share reciben directivas de hidratación; el resto del artículo se prerenderiza en HTML. El motor gráfico usa SVG, D3 Array, Scale y Shape. Las barras horizontales emplean HTML geométrico accesible. No se carga una segunda biblioteca gráfica.

## Fronteras

| Directorio                     | Responsabilidad                                            |
| ------------------------------ | ---------------------------------------------------------- |
| `content/site/`                | Presentación y navegación editables                        |
| `content/publications/<slug>/` | Publicación completa, sus datasets y recursos              |
| `content/pages/<slug>/`        | Páginas institucionales con plantilla genérica             |
| `content/sources/`             | Catálogo compartido de documentos concretos                |
| `schemas/`                     | JSON Schema 2020-12 canónico                               |
| `src/generated/content.ts`     | Tipos derivados; nunca editarlos a mano                    |
| `src/build/`                   | Descubrimiento, validación y modelo público                |
| `src/lib/`                     | Componentes tipados y lógica sin filesystem                |
| `src/pages/`                   | Rutas físicas generadas por Astro                          |
| `.generated/`                  | Datos temporales y recursos seleccionados; ignorado en Git |
| `tests/fixtures/`              | Contenido sintético y entradas inválidas                   |
| `dist/`                        | Artefacto de producción                                    |

## Rutas

Inicio, índice de publicaciones, cinco líneas, artículos, catálogo y fichas de fuentes, páginas institucionales y 404. Los índices HTML se paginan cada ocho entradas. La búsqueda interactiva carga un JSON separado al entrar en su página y mantiene consulta, filtros y página en la URL. El índice HTML sigue funcionando sin JavaScript.

La relación inversa se calcula desde citas de entradilla, ideas, bloques, inline y datasets usados. Se cuentan documentos únicos y se conservan sus anclas. Las páginas institucionales se identifican por separado.

## Exclusión de borradores

Todos los documentos se validan, incluidos borradores, para detectar errores de edición pronto. La selección `published` ocurre antes de copiar recursos e índices. No se copian carpetas completas ni todos los archivos de `content/`. Los recursos de fuentes solo se incluyen si la fuente está citada públicamente.

El modelo no contiene rutas absolutas del filesystem. Los componentes interactivos reciben únicamente su dataset, las referencias pertinentes y metadatos públicos. La comprobación final revisa referencias locales, anclas, fuentes tipográficas, tarjetas sociales y sentinelas de exclusión.

## Determinismo y compatibilidad

Las rutas se ordenan de manera estable; el orden editorial se basa en fechas e ID. No se generan fechas de actualización durante el build. Imágenes con nombres derivados de su SHA-256. Las fechas actuales solo intervienen en rechazar publicaciones futuras, no en serializar contenido.

No se necesita acceso remoto durante el build tras `npm ci`. `source.url` es una referencia para lectores, no una dependencia de compilación. La comprobación de enlaces externos debe hacerse por separado.

Este repositorio inicia una fase independiente de Spec, Knowledge y Agents. No utiliza `inputs.lock.json`, contratos de versiones anteriores ni tokens entre repositorios. Una futura automatización puede producir exactamente los JSON de esta versión y someterlos a la misma revisión humana; no requiere otra arquitectura de lectura.

## Seguridad de contenido

Ajv2020 con formatos y objetos cerrados rechaza campos desconocidos. Se verifican fechas, slugs, IDs, columnas, unidades y compatibilidad gráfica. Los recursos se resuelven mediante `realpath`, confinados a su directorio; se rechazan traversal y symlinks que salen de él. No hay `eval`, imports dirigidos desde JSON ni inserción de HTML editorial. El JSON-LD técnico se escapa antes de insertarse en HTML.

Límites de tamaño declarados: hasta 300 bloques por documento, 20.000 filas por dataset, 50 columnas y 12 series. No hay agregación ni reducción silenciosa de puntos. Conviene usar agregación documentada para conjuntos extensos y comprobar su coste en el navegador.
