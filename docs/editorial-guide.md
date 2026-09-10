# Crear, revisar y publicar

## Copiar una carpeta

Elige una plantilla de `templates/`: `explainer`, `investigation`, `fact-check`, `data-story`, `testimony`, `guide` o `page`. Copia su directorio `publications/nueva-publicacion` a `content/publications/<slug>`, o usa `npm run content:new -- explainer <slug>`. El slug utiliza minúsculas, números y guiones; empieza por letra y debe coincidir con el campo `slug`.

Completa la ficha de autoría dentro de `content/authors/<id>/author.json`. El campo `authors` contiene esos identificadores. Los nombres de plantilla deben sustituirse por autoría real antes de publicar.

El cuerpo completo se escribe en `page.json`. Guarda imágenes dentro de `assets/` y los datasets dentro de `datasets/`. Añadir un párrafo, una cita, una imagen o un gráfico conocido nunca requiere editar React, Astro ni configuración.

## Un recorrido de lectura

Empieza con un título concreto y una entradilla que añada información. Explica qué sucede, por qué importa y qué se puede comprobar. Usa hasta tres ideas iniciales cuando ayuden en piezas largas. Los párrafos de 40–90 palabras y las entradillas de 35–65 palabras son orientaciones, no límites del validador.

Separa hechos, declaraciones, análisis y opinión. Citar que una persona dijo algo no demuestra que lo declarado sea verdadero. Incluye incertidumbres cerca de las afirmaciones relevantes. No conviertas una correlación en una causa ni una diferencia en una denuncia automática.

Para enriquecer texto usa nodos inline de `strong`, `emphasis`, `link` y `citation`; no HTML ni Markdown. [Contrato y ejemplo](content-contract.md).

## Revisar antes de publicar

1. Ejecuta `npm run dev` y abre la publicación. Los borradores aparecen con una etiqueta.
2. Comprueba título, entradilla, evidencia local, autorías, unidades, periodos y limitaciones.
3. Abre las fuentes y vuelve al apartado citado. Revisa gráficos, tabla y descarga.
4. Ejecuta `npm run validate:content`. El error identifica archivo o slug, campo o bloque y causa.
5. Cambia `status` a `published`; añade una fecha real `publishedAt`, por ejemplo `2026-09-09`.
6. Guarda y solicita revisión mediante una pull request. El pipeline comprueba estructura y funcionamiento. La decisión editorial corresponde a una persona.

Una fecha futura publicada bloquea el build: no existe un servicio de publicación programada. `updatedAt` registra un cambio editorial, no una recompilación. Las fechas de solo día conservan ese día en Colombia.

## Trabajar desde GitHub

Abre `templates/<tipo>/publications/nueva-publicacion/page.json`, copia su contenido y usa **Add file → Create new file** para crear `content/publications/<slug>/page.json`. Completa los campos y guarda en una rama. Para imágenes y datasets usa **Add file → Upload files** dentro de las carpetas correspondientes. Crea las fichas de fuentes y autoría del mismo modo.

La interfaz de GitHub no copia carpetas completas con un solo botón. El camino más rápido para varias imágenes es subir la carpeta preparada desde el ordenador. Abre una pull request: Actions valida los JSON y ejecuta las pruebas. El informe técnico de Actions no reemplaza la previsualización visual; para ver borradores usa `npm run dev` en el ordenador. No se publican previews editoriales en la web pública.

## Corregir

Mantén `id`. Corrige el texto o dataset, añade `updatedAt` y, si cambia información sustancial, una entrada en `corrections` con `date`, `description` y los IDs de `blocks` afectados. La nota aparece en el artículo y enlaza al apartado.

Para retirar una publicación cambia a `draft` y recompila. Desaparecerá de HTML, JSON, RSS, sitemap, búsqueda y relaciones. Una fuente compartida permanece si otro contenido público la utiliza. Si se cambia el slug, registra el anterior en `previousSlugs`; se genera una redirección HTML, no un HTTP 301.

## Información publicable

En un repositorio público los archivos y el historial son visibles, incluidos borradores. `draft` excluye la salida de la web; no ofrece confidencialidad al repositorio. No guardes identidades protegidas, credenciales ni documentos reservados. Revertir la publicación no elimina copias ya descargadas ni el historial.

No crees formularios de contacto, denuncias, comentarios o suscripción que no tengan un canal real. La dirección `contact` solo se configura cuando está confirmada.
