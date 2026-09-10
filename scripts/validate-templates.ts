import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateSchema } from '../src/build/validate';
let count = 0;
async function walk(dir: string) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) await walk(f);
    else if (e.name.endsWith('.json')) {
      const value = JSON.parse(await readFile(f, 'utf8'));
      const kind =
        e.name === 'author.json'
          ? 'Author'
          : e.name === 'source.json'
            ? 'Source'
            : f.includes('/datasets/')
              ? 'Dataset'
              : f.includes('/pages/')
                ? 'Page'
                : 'Publication';
      validateSchema(kind, value, f);
      count++;
    }
  }
}
await walk('templates');
console.log(`${count} JSON de plantillas válidos.`);
