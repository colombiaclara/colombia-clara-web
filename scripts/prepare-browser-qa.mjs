// Solo para una revisión de navegador ya iniciada: no inicia servidores ni controla el navegador.
// Genera archivos estáticos aislados; una nueva compilación de producción los borra.
import { spawnSync } from 'node:child_process';
import { cp, mkdir, rm } from 'node:fs/promises';
const run = (args, env = {}) => {
  const result = spawnSync(process.execPath, args, {
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', ...env },
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
await mkdir('.qa', { recursive: true });
for (const [base, mode, target] of [
  ['/', 'build', 'production-root'],
  ['/colombia-clara-web/', 'build', 'production-prefix'],
  ['/colombia-clara-web/__qa/fixtures/', 'build-demo', 'fixtures'],
  ['/colombia-clara-web/__qa/production/', 'build', 'production'],
]) {
  run(['scripts/run.mjs', mode], { CC_BASE_PATH: base });
  await rm('.qa/' + target, { recursive: true, force: true });
  await cp(mode === 'build-demo' ? 'dist-demo' : 'dist', '.qa/' + target, { recursive: true });
}
run(['--import', 'tsx', 'scripts/prepare.ts']);
await mkdir('.generated/public/__qa', { recursive: true });
for (const name of ['fixtures', 'production'])
  await cp('.qa/' + name, '.generated/public/__qa/' + name, { recursive: true });
await cp('tests/visual/browser-harness.html', '.generated/public/__qa/index.html');
await cp('node_modules/axe-core/axe.min.js', '.generated/public/__qa/axe.min.js');
console.log(
  'Revisión local preparada. Sus recursos no forman parte de ninguna compilación de producción.',
);
