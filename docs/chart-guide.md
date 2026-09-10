# Preparar y leer gráficos

## Elegir la pregunta

Cada gráfico contiene `id`, `type: chart`, `kind`, `title`, `description`, `dataset` y `encoding`. Los datos viven en `datasets/<id>.json` dentro de la misma publicación. Cada dataset contiene columnas tipadas, filas, citas y metodología.

| kind              | encoding                      | Pregunta                               | Regla                                                          |
| ----------------- | ----------------------------- | -------------------------------------- | -------------------------------------------------------------- |
| `bar`             | category, value               | ¿Qué categoría tiene más?              | Eje desde cero; horizontal por defecto                         |
| `grouped-bar`     | category, series              | ¿Cómo difieren las series?             | Unidades iguales                                               |
| `stacked-bar`     | category, series              | ¿Cómo se compone cada magnitud?        | Componentes no negativos; hueco si faltan datos                |
| `stacked-bar-100` | category, series              | ¿Qué proporción aporta cada parte?     | Total de cada grupo visible; no completar componentes ausentes |
| `line`            | category de tipo date, series | ¿Qué cambia en el tiempo?              | Orden cronológico; null crea huecos                            |
| `area`            | category de tipo date, series | ¿Cómo evoluciona cada cantidad?        | Áreas independientes desde cero, no acumuladas                 |
| `pie`             | category, value               | ¿Cuáles son las partes del total?      | No negativos y total positivo; sin 3D                          |
| `donut`           | category, value               | ¿Cómo se distribuye un total conocido? | Total central observado, no inferido                           |
| `scatter`         | x, y numéricos                | ¿Qué relación aparece?                 | No demuestra causalidad                                        |
| `histogram`       | value numérico                | ¿Cómo se distribuyen observaciones?    | D3 genera intervalos explícitos y frecuencias                  |
| `dumbbell`        | category, start, end          | ¿Qué cambia entre dos momentos?        | Periodos como etiquetas de las columnas; diferencia visible    |
| `heatmap`         | x, y, value                   | ¿Dónde se concentra la intensidad?     | Rango y celdas sin dato diferenciados                          |

`table` y `metric` también son bloques independientes. Consulta todos los ejemplos mediante `npm run dev:demo`, en la publicación «Un gráfico para cada pregunta».

## Dataset

Cada columna tiene `id`, `label`, `type` (`string`, `number`, `date`) y `unit` cuando aplica. Cada fila debe contener todas las columnas; no admite campos extra. `null` significa ausencia y `0` significa cero observado. Las fechas son `AAAA-MM-DD`.

Los gráficos no agregan categorías repetidas: prepara la agregación en el dataset y documenta fórmula, selección y redondeo. Las categorías de barras deben ser únicas; las combinaciones x/y del heatmap también. No mezcles periodos, coberturas, definiciones ni unidades sin explicarlo.

Para datos derivados registra `calculation.formula`, `calculation.inputs` y la regla `rounding` si existe. El build no ejecuta fórmulas escritas en JSON: sirve resultados y método declarados, y comprueba consistencia estructural.

## Opciones

`orientation` selecciona horizontal/vertical en barras. `seriesFilter` activa controles de series cuando existen. `periodFilter` filtra fechas. `sort` ordena categorías en gráficos de valor único; las líneas mantienen el orden temporal. `bins` indica un objetivo de intervalos: D3 selecciona límites convenientes y el gráfico explica el número efectivo.

`decimals` controla el redondeo visible. La tabla y el gráfico usan el mismo modelo; el CSV conserva su precisión. `format: percent` exige columnas en `%`, expresadas como puntos de porcentaje: 25 significa 25 %, no 0,25. `format: currency` requiere la moneda declarada en la unidad; no hay conversión de divisas.

Una escala `log` solo se admite en líneas con valores positivos. Un `domain` explícito solo se admite en líneas y se anuncia como recortado; no puede esconder observaciones. Las barras siempre conservan cero. No hay dobles ejes, suavizado ni imputación implícita.

## Comparaciones y ausencia

El indicador calcula variación relativa como `(final - base) / abs(base) × 100`. Con base cero se muestra «no definida». El modo `percentage-points` resta dos porcentajes ya expresados en puntos: 25 − 20 = 5 puntos porcentuales, mientras la variación relativa sería 25 %.

Barras al 100 % muestran el total del grupo. Si falta un componente, no dibujan porcentajes completos para ese grupo. Una torta/dona incompleta muestra un estado explicativo y conserva los valores en tabla. Las áreas son independientes, no apiladas, y conservan huecos.

## Acceso y descarga

Los gráficos tienen una representación inicial prerenderizada y una tabla disponible mediante `details`, también sin JavaScript. Los filtros y la exploración por registro usan controles nativos aptos para teclado y toque. Los SVG no obligan a tabular cada punto.

«Descargar esta tabla (CSV)» representa la selección y transformación visibles. «Dataset original (JSON)» conserva el dataset publicado. Los histogramas descargan intervalos y frecuencias de la vista y enlazan además a las observaciones originales. El prefijo de despliegue se aplica automáticamente.
