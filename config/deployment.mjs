export const site = process.env.CC_SITE_URL || 'https://colombiaclara.github.io';
const segments = (process.env.CC_BASE_PATH ?? '/colombia-clara-web/').split('/').filter(Boolean);
export const base = segments.length ? '/' + segments.join('/') + '/' : '/';
if (!/^https?:\/\/[^/]+\/?$/.test(site))
  throw new Error('CC_SITE_URL debe ser un origen HTTP(S), sin ruta.');
