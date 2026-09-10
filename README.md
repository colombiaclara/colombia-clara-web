# Colombia Clara

Publicación cívica estática: comprender asuntos públicos, explorar datos y comprobar sus fuentes. Astro genera HTML completo; React construye la biblioteca reutilizable y las islas de búsqueda, gráficos y compartir.

## Arrancar

Necesitas Node 24 LTS y npm. También se admite Node 22 a partir de 22.12. No se necesitan servicios, secretos ni repositorios externos.

```sh
npm ci
npm run dev
```

Abre la dirección que indica Astro. La configuración inicial usa `/colombia-clara-web/`. `npm run dev` muestra el contenido local, incluidos borradores con etiqueta visible. Los cambios en `content/` regeneran el modelo de lectura automáticamente.

Para explorar los artículos sintéticos, los doce gráficos, indicadores, imágenes, tablas y las relaciones con fuentes:

```sh
npm run dev:demo
```

La demostración vive en `tests/fixtures/demo/`. Lleva una advertencia visible y no se incorpora a producción. La portada pública comienza sin historias ficticias; incluye presentación, cinco líneas editoriales y las páginas Acerca y Metodología.

## Primera publicación real

```sh
npm run content:new -- explainer agua-y-territorio
npm run validate:content
```

Completa `content/publications/agua-y-territorio/page.json`, registra la autoría real y las fuentes. Revisa el texto, cambia `status` a `published` y añade `publishedAt`. El sitio descubre la carpeta: no se editan rutas, imports ni índices. [Guía editorial](docs/editorial-guide.md).

## Comprobar y compilar

```sh
npm run check
npm run build
npm run preview
```

Para la batería de navegador, instala Chromium una vez:

```sh
npx playwright install chromium
npm run test:e2e
```

En Linux CI se usa `npx playwright install --with-deps chromium`. Las pruebas de navegador preparan salidas de fixtures aisladas en `.qa/` para `/` y `/colombia-clara-web/`.

`dist/` contiene la web de producción, sin servidor Node. `dist-demo/` es solo la compilación de la demostración local. No subas esta última a Pages.

## Guías

- [Publicar y corregir](docs/editorial-guide.md)
- [Contrato JSON](docs/content-contract.md)
- [Fuentes y citas](docs/source-guide.md)
- [Gráficos y datos](docs/chart-guide.md)
- [Arquitectura](docs/architecture.md)
- [Diseño](docs/design-system.md) y [decisiones visuales](docs/design-rationale.md)
- [GitHub Pages](docs/deployment.md)
- [Resultados y límites de validación](docs/validation-report.md)

El workflow está preparado, pero requiere configurar Pages en tu repositorio. Este paquete no modifica automáticamente un repositorio de GitHub ni tu DNS.
