import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const base of ['/', '/colombia-clara-web/']) {
  test(`lectura → fuente → bloque; recarga directa (${base})`, async ({ page }) => {
    await page.goto(base + 'articulos/leer-una-comparacion/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Dos cifras no cuentan toda la historia',
    );
    await page
      .getByRole('link', { name: /Fuente \d+: Recuento/ })
      .first()
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Recuento simulado de categorías',
    );
    await page.locator('a[href$="leer-una-comparacion/#comparacion-categorias"]').click();
    await expect(page).toHaveURL(
      new RegExp(base + 'articulos/leer-una-comparacion/#comparacion-categorias'),
    );
    await page.reload();
    await expect(page.locator('#comparacion-categorias')).toBeVisible();
  });
  test(`búsqueda, filtros y atrás/adelante (${base})`, async ({ page }) => {
    await page.goto(base + 'publicaciones/');
    await page.getByRole('searchbox').fill('DOS CIFRAS');
    await expect(page.locator('.search-result')).toHaveCount(1);
    await page.getByLabel('Línea editorial', { exact: true }).selectOption('escuela-clara');
    await expect(page.getByRole('heading', { name: 'No encontramos resultados' })).toBeVisible();
    await page.goBack();
    await expect(page.locator('.search-result')).toHaveCount(1);
    await page.goForward();
    await expect(page.getByRole('heading', { name: 'No encontramos resultados' })).toBeVisible();
  });
  test(`gráficos, filtros, datos equivalentes y descarga (${base})`, async ({ page }) => {
    await page.goto(base + 'articulos/catalogo-de-graficos/');
    const chart = page.locator('#grafico-line');
    await chart.scrollIntoViewIfNeeded();
    await chart.getByLabel('Segunda', { exact: true }).uncheck();
    await expect(chart.locator('.chart-status')).toContainText('1 serie visible');
    await chart.getByText('Ver tabla y descargar datos', { exact: true }).click();
    await expect(chart.getByRole('columnheader')).toHaveCount(2);
    await expect(chart.getByRole('cell', { name: 'Sin dato', exact: true })).toHaveCount(1);
    const download = page.waitForEvent('download');
    await chart.getByRole('link', { name: 'Descargar esta tabla (CSV)' }).click();
    expect((await download).suggestedFilename()).toBe('tiempo-line.csv');
    await chart.getByText('Explorar los valores', { exact: true }).click();
    await chart.getByLabel('Consultar un registro', { exact: true }).selectOption('2');
    await expect(chart.locator('.data-explorer dd').last()).toHaveText('55');
  });
  test(`lectura y fuentes sin JavaScript (${base})`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321' + base + 'articulos/leer-una-comparacion/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByText('Ver tabla y descargar datos', { exact: true }).click();
    await expect(page.getByRole('cell', { name: '150', exact: true })).toBeVisible();
    await page
      .getByRole('link', { name: /Fuente \d+: Recuento/ })
      .first()
      .click();
    await expect(
      page.getByRole('heading', { name: 'Publicaciones que utilizan esta fuente' }),
    ).toBeVisible();
    await context.close();
  });
  test(`enlaces no exponen borradores y 404 no usa fallback (${base})`, async ({ request }) => {
    for (const path of [
      'search/publications.json',
      'search/sources.json',
      'sitemap.xml',
      'rss.xml',
    ]) {
      const response = await request.get(base + path);
      expect(response.status()).toBe(200);
      expect(await response.text()).not.toContain('BORRADOR_NO_PUBLICAR_7f83');
    }
    expect((await request.get(base + 'articulos/borrador-excluido/')).status()).toBe(404);
    expect((await request.get(base + 'no-existe/')).status()).toBe(404);
  });
}
test('móvil, ampliación, capturas y accesibilidad automática', async ({ page }, info) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: `test-results/${info.project.name}-home-${width}.png`,
        fullPage: true,
      });
  }
  for (const route of [
    'articulos/leer-una-comparacion/',
    'fuentes/src-demo-recuento/',
    'publicaciones/',
    'articulos/catalogo-de-graficos/',
  ]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/' + route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.screenshot({
      path: `test-results/${info.project.name}-${route.replaceAll('/', '_')}.png`,
      fullPage: true,
    });
  }
  await page.goto('/articulos/leer-una-comparacion/');
  await page.addStyleTag({ content: 'html{font-size:200% !important}' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('menú móvil y foco de teclado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.mobile-menu summary');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.mobile-menu')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open', '');
});
