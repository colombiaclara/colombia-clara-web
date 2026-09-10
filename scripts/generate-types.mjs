import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { compile } from 'json-schema-to-typescript';
const schema = JSON.parse(await readFile('schemas/editorial.schema.json', 'utf8'));
const output = await compile(schema, 'EditorialModel', {
  bannerComment: '/* Generado desde schemas/editorial.schema.json. No editar. */',
  cwd: process.cwd(),
  declareExternallyReferenced: true,
  unknownAny: false,
  ignoreMinAndMaxItems: true,
});
await mkdir('src/generated', { recursive: true });
await writeFile('src/generated/content.ts', output);
console.log('Tipos generados desde JSON Schema.');
