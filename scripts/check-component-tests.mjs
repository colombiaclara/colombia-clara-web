import { readdir, access, readFile } from 'node:fs/promises';
import path from 'node:path';
const files = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (p.endsWith('.tsx') && !p.endsWith('.test.tsx')) files.push(p);
  }
}
await walk('src/lib');
const missing = [];
for (const file of files) {
  const test = file.replace(/\.tsx$/, '.test.tsx');
  try {
    await access(test);
    const body = await readFile(test, 'utf8');
    if (!/\b(?:it|test)\(/.test(body) && !/\bit\.each\(/.test(body))
      missing.push(test + ' (sin casos)');
  } catch {
    missing.push(test);
  }
}
if (missing.length) {
  console.error('Faltan pruebas por componente:\n' + missing.join('\n'));
  process.exit(1);
}
console.log(`${files.length} componentes; ${files.length} archivos de pruebas correspondientes.`);
