import { spawn, spawnSync } from 'node:child_process';
import { watch } from 'node:fs';
const mode = process.argv[2] ?? 'build';
process.env.ASTRO_TELEMETRY_DISABLED = '1';
if (['demo', 'build-demo'].includes(mode)) process.env.CC_DEMO = '1';
if (['dev', 'demo'].includes(mode)) process.env.CC_INCLUDE_DRAFTS = '1';
if (process.env.CC_DEMO === '1' && !['demo', 'build-demo'].includes(mode))
  throw new Error(
    'Usa build:demo o dev:demo para contenido sintético; build de producción no lo admite.',
  );
const isDev = ['dev', 'demo'].includes(mode);
const execute = (file, args = []) => {
  const r = spawnSync(process.execPath, [file, ...args], { stdio: 'inherit', env: process.env });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
execute('scripts/generate-types.mjs');
execute('--import', ['tsx', 'scripts/prepare.ts']);
if (isDev) {
  const child = spawn(
    process.execPath,
    ['node_modules/astro/bin/astro.mjs', 'dev', ...process.argv.slice(3)],
    { stdio: 'inherit', env: process.env },
  );
  let timer;
  const watcher = watch(
    process.env.CC_DEMO === '1' ? 'tests/fixtures/demo/content' : 'content',
    { recursive: true },
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        spawnSync(process.execPath, ['--import', 'tsx', 'scripts/prepare.ts'], {
          stdio: 'inherit',
          env: process.env,
        });
      }, 200);
    },
  );
  child.on('exit', (code) => {
    watcher.close();
    process.exit(code ?? 0);
  });
  process.on('SIGTERM', () => child.kill('SIGTERM'));
  process.on('SIGINT', () => child.kill('SIGINT'));
} else {
  execute('node_modules/astro/bin/astro.mjs', ['build']);
  execute('--import', ['tsx', 'scripts/check-dist.ts']);
}
