import { spawnSync, spawn } from 'node:child_process';
import { mkdir, rm, cp } from 'node:fs/promises';
await rm('.qa/site', { recursive: true, force: true });
await mkdir('.qa/site', { recursive: true });
for (const base of ['/', '/colombia-clara-web/']) {
  const env = {
    ...process.env,
    CC_BASE_PATH: base,
    CC_SITE_URL: 'https://colombiaclara.github.io',
    ASTRO_TELEMETRY_DISABLED: '1',
  };
  const r = spawnSync(process.execPath, ['scripts/run.mjs', 'build-demo'], {
    env,
    stdio: 'inherit',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
  await cp('dist-demo', base === '/' ? '.qa/site' : '.qa/site/colombia-clara-web', {
    recursive: true,
  });
}
const child = spawn(process.execPath, ['scripts/serve.mjs', '.qa/site'], {
  env: { ...process.env, CC_BASE_PATH: '/', PORT: '4321' },
  stdio: 'inherit',
});
process.on('SIGTERM', () => child.kill());
process.on('SIGINT', () => child.kill());
child.on('exit', (code) => process.exit(code ?? 0));
