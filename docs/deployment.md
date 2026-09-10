# Publicar en GitHub Pages

## Configuración inicial

El repositorio está preparado para `https://colombiaclara.github.io/colombia-clara-web/`. Es un ejemplo técnico de origen y prefijo, no una afirmación de que ese repositorio o dominio se haya publicado durante esta entrega.

1. Sube el código a tu repositorio y conserva `package-lock.json`.
2. En **Settings → Pages**, elige **GitHub Actions** como fuente.
3. En **Settings → Secrets and variables → Actions → Variables**, configura `CC_SITE_URL` y `CC_BASE_PATH` si cambias de escenario.
4. Abre una pull request y revisa el job `validate`. El workflow despliega exclusivamente `main` después de las comprobaciones.

| Escenario      | CC_SITE_URL                       | CC_BASE_PATH           |
| -------------- | --------------------------------- | ---------------------- |
| Proyecto       | `https://colombiaclara.github.io` | `/colombia-clara-web/` |
| Organización   | `https://colombiaclara.github.io` | `/`                    |
| Dominio propio | Origen HTTPS confirmado           | `/`                    |

Para un dominio propio, añade y verifica el dominio en Settings → Pages y configura DNS según GitHub. No se incluye un CNAME ni un dominio inventado. Activa HTTPS cuando la validación de DNS lo permita. La disponibilidad de Pages depende del plan y de la visibilidad del repositorio; consulta la [guía oficial](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Workflow

`.github/workflows/pages.yml` valida PRs, pushes a `main` y ejecuciones manuales. Instala Node 24, usa `npm ci`, valida contenido y plantillas, comprueba tipos y tests por componente y ejecuta Playwright sobre dos bases. Después vuelve a construir producción; solo `dist/` se entrega a `upload-pages-artifact`. Las salidas `.qa/` y `dist-demo/` nunca se suben.

`pages: write` e `id-token: write` están limitados al job `deploy`, que depende de `validate` y usa el entorno `github-pages`. La restricción de rama también se mantiene en `workflow_dispatch`. Acciones oficiales consultadas: checkout v7, setup-node v7, upload-pages-artifact v5 y deploy-pages v5. El workflow aún debe ejecutarse en el repositorio de destino.

## Preview estático

`npm run preview` sirve el resultado con el origen y prefijo de compilación; no usa fallback SPA. Abrir `dist/index.html` con `file://` no reproduce Pages. Los artículos se escriben como `articulos/<slug>/index.html` y soportan entrada directa y recarga.

En PowerShell se pueden definir variables antes de compilar:

```powershell
$env:CC_SITE_URL = 'https://colombiaclara.github.io'
$env:CC_BASE_PATH = '/colombia-clara-web/'
npm run build
npm run preview
```

En Bash:

```sh
CC_SITE_URL=https://colombiaclara.github.io CC_BASE_PATH=/ npm run build
CC_BASE_PATH=/ npm run preview
```

`.env.example` documenta variables; no contiene secretos. No se necesita un token de lectura entre repositorios. El código editorial no lee `.env` ni credenciales en el navegador.

## Recuperación

Revierte el cambio de contenido o código con Git y reconstruye. Los IDs permanecen estables al cambiar títulos. `previousSlugs` genera páginas HTML de traslado, no HTTP 301. Al cambiar base/origen, reconstruye también canonical, sitemap, RSS, tarjetas sociales e índices.

Los borradores no se publican por Pages, pero siguen visibles en el repositorio si este es público. Una configuración de robots no protege contenido privado. No alojes investigación reservada en este repositorio.
