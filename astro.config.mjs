import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { site, base } from './config/deployment.mjs';
import { browserQA } from './scripts/browser-qa-plugin.mjs';
export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  publicDir: '.generated/public',
  outDir: process.env.CC_DEMO === '1' ? 'dist-demo' : 'dist',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  server: { host: '0.0.0.0', port: 4173 },
  vite: { server: { allowedHosts: ['terminal.local'] }, plugins: [browserQA(base)] },
  devToolbar: { enabled: false },
});
