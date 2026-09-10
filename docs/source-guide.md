# Registrar y recorrer fuentes

## Una ficha por documento

Crea `content/sources/<source-id>/source.json`. Una institución es autor o editor; no sustituye el documento usado. Mantén ID estable y edición cuando un documento cambia sustancialmente.

```json
{
  "schemaVersion": "1.0",
  "id": "documento-por-registrar",
  "title": "Completar con el título exacto del documento",
  "kind": "report",
  "creators": [{ "name": "Completar con autoría confirmada" }],
  "accessedAt": "2026-09-09",
  "language": "es",
  "description": "Explicar qué contiene y para qué se utiliza."
}
```

Este es un ejemplo editorial para completar, no una fuente real. Añade `url` HTTP(S) si existe, `publisher`, fecha `publishedAt`, `edition` y `archivedUrl` cuando se conozcan. No inventes metadatos para rellenar campos. Una entrevista puede no tener URL pública; necesita identificación publicable suficiente. La ausencia de fecha aparece como «No conocida».

## Citar cerca del dato

```json
{
  "sourceId": "documento-por-registrar",
  "locator": { "type": "table", "value": "Tabla 3, página 18" },
  "role": "primary",
  "note": "Explica qué respalda esta fuente y qué no permite concluir."
}
```

Localizadores: `page`, `section`, `table`, `fragment`, `timestamp`. Los artículos académicos requieren localizador en cada cita. Otras fuentes lo requieren editorialmente cuando corresponde; el build no puede inferir si una tabla es relevante por su significado. El papel primario/secundario pertenece al uso concreto y no certifica veracidad.

Los bloques de hecho, declaración, cita, indicador y las cronologías factuales necesitan referencias. Un análisis u opinión que utiliza hechos también debe respaldarlos aunque el validador no comprenda el significado del texto.

En un gráfico, las fuentes del dataset se incorporan automáticamente. No mantengas listas de publicaciones en la ficha de fuente: el build recorre las citas, deduplica documentos y genera enlaces de vuelta a IDs de bloque estables.

## Catálogo público

`/fuentes/` permite buscar título, autoría/institución, descripción y dominio; filtra por tipo y línea editorial. `/fuentes/<id>/` muestra la ficha, original, archivo alternativo y lugares donde se cita. Las citas incluyen enlace a la ficha y al original cuando está disponible.

Solo se muestran fuentes usadas desde contenido público. Un documento citado por una página institucional figura en un grupo separado de las publicaciones. El número de usos ayuda a navegar: no constituye una puntuación de calidad.

Guarda documentos locales publicables en `assets/` y referencia `asset`. La compilación no descarga documentos remotos. Si una URL está caída, conserva ficha y contexto; registra una copia archivada sin sustituir silenciosamente la referencia.

La detección de duplicados compara URLs normalizadas. No fusiona fuentes ni equipara documentos por compartir institución.
