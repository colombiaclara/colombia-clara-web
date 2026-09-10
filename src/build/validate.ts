import Ajv2020 from 'ajv/dist/2020.js';
import type { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import type { Dataset, Publication, Page } from './types';
const schema = JSON.parse(
  await readFile(new URL('../../schemas/editorial.schema.json', import.meta.url), 'utf8'),
);
const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
addFormats(ajv);
ajv.addSchema(schema);
const validators = new Map<string, ReturnType<typeof ajv.compile>>();
function explainError(e: ErrorObject): string {
  const p = e.params;
  switch (e.keyword) {
    case 'required':
      return `falta el campo «${p['missingProperty']}»`;
    case 'additionalProperties':
      return `campo desconocido «${p['additionalProperty']}»`;
    case 'enum':
      return `usa uno de: ${p['allowedValues'].join(', ')}`;
    case 'const':
      return `el valor debe ser ${JSON.stringify(p['allowedValue'])}`;
    case 'type':
      return `tipo incorrecto; se esperaba ${p['type']}`;
    case 'format':
      return `formato ${p['format']} inválido`;
    case 'pattern':
      return `el valor no cumple el patrón permitido: ${p['pattern']}`;
    case 'minLength':
      return `debe contener al menos ${p['limit']} caracteres`;
    case 'maxLength':
      return `no debe superar ${p['limit']} caracteres`;
    case 'minItems':
      return `debe contener al menos ${p['limit']} elementos`;
    case 'maxItems':
      return `no debe superar ${p['limit']} elementos`;
    case 'minimum':
      return `el mínimo permitido es ${p['limit']}`;
    case 'maximum':
      return `el máximo permitido es ${p['limit']}`;
    case 'uniqueItems':
      return 'hay elementos duplicados';
    case 'oneOf':
    case 'anyOf':
      return 'el contenido no coincide con una variante permitida del esquema';
    default:
      return `incumple la regla «${e.keyword}» del esquema`;
  }
}
export function validateSchema(kind: string, value: unknown, file: string) {
  let validate = validators.get(kind);
  if (!validate) {
    validate = ajv.compile({ $ref: `${schema.$id}#/$defs/${kind}` });
    validators.set(kind, validate);
  }
  if (!validate(value)) {
    const errors = (validate.errors ?? [])
      .slice(0, 12)
      .map((e) => `${file}${e.instancePath || '/'}: ${explainError(e)}`)
      .join('\n');
    throw new Error(errors);
  }
}
export const normalize = (v: string) =>
  v
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
    .trim();
export async function localAsset(dir: string, relative: string) {
  if (
    relative.includes('\\') ||
    relative.split('/').includes('..') ||
    path.isAbsolute(relative) ||
    /[%?#\0]/.test(relative)
  )
    throw new Error(`Ruta no permitida «${relative}»: utiliza un archivo dentro del directorio.`);
  const root = await realpath(dir);
  let absolute: string;
  try {
    absolute = await realpath(path.resolve(root, relative));
  } catch {
    throw new Error(`${dir}: falta el archivo «${relative}».`);
  }
  if (!absolute.startsWith(root + path.sep) || (await stat(absolute)).isDirectory())
    throw new Error(`El recurso «${relative}» sale de su directorio.`);
  return absolute;
}
export function validateDataset(d: Dataset, label: string) {
  const cols = new Map(d.columns.map((c) => [c.id, c]));
  if (cols.size !== d.columns.length)
    throw new Error(`${label}: identificador de columna duplicado.`);
  for (const [i, row] of d.rows.entries()) {
    for (const key of Object.keys(row))
      if (!cols.has(key)) throw new Error(`${label}, fila ${i + 1}: columna desconocida «${key}».`);
    for (const c of d.columns) {
      const v = row[c.id];
      if (v === null) continue;
      if (
        v === undefined ||
        (c.type === 'number' ? typeof v !== 'number' || !Number.isFinite(v) : typeof v !== 'string')
      )
        throw new Error(
          `${label}, fila ${i + 1}, ${c.id}: se esperaba ${c.type}; usa null para datos ausentes.`,
        );
      if (c.type === 'date' && !validDate(String(v)))
        throw new Error(`${label}, fila ${i + 1}: fecha inválida en ${c.id}.`);
    }
  }
}
export function validDate(d: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(d) &&
    !Number.isNaN(Date.parse(d)) &&
    new Date(d + 'T12:00:00Z').toISOString().slice(0, 10) === d
  );
}
export function validateDocumentDates(d: Publication | Page, today: string) {
  if (
    d.status === 'published' &&
    /(?:autor-por-definir|src-por-definir|unidad-por-definir)/.test(JSON.stringify(d))
  )
    throw new Error(
      `${d.slug}: sustituye los marcadores de autoría, fuentes y unidades de la plantilla antes de publicar.`,
    );
  if (d.status === 'published' && !d.publishedAt)
    throw new Error(`${d.slug}: añade publishedAt antes de publicar.`);
  if (d.status === 'published' && d.publishedAt! > today)
    throw new Error(
      `${d.slug}: la fecha ${d.publishedAt} es futura. Cambia a draft; no hay programación automática.`,
    );
  if (d.updatedAt && d.publishedAt && d.updatedAt < d.publishedAt)
    throw new Error(`${d.slug}: updatedAt es anterior a publishedAt.`);
  if (d.updatedAt && d.updatedAt > today)
    throw new Error(`${d.slug}: updatedAt no puede ser futura.`);
  const ids = d.blocks.map((b) => b.id);
  if (new Set(ids).size !== ids.length) throw new Error(`${d.slug}: hay IDs de bloque duplicados.`);
  const reserved = [
    'entrada',
    'ideas',
    'fuentes',
    'correcciones',
    'relacionados',
    'contenido',
    'indice',
  ];
  for (const id of ids)
    if (reserved.includes(id)) throw new Error(`${d.slug}: el ID «${id}» está reservado.`);
  let level = 1;
  for (const b of d.blocks)
    if (b.type === 'heading') {
      if (b.level > level + 1)
        throw new Error(`${d.slug}, ${b.id}: no saltes un nivel de encabezado.`);
      level = b.level;
    }
  for (const c of d.corrections ?? []) {
    if (c.date > today) throw new Error(`${d.slug}: corrección con fecha futura.`);
    for (const id of c.blocks)
      if (!ids.includes(id))
        throw new Error(`${d.slug}: corrección apunta a bloque inexistente «${id}».`);
  }
  if ('tags' in d && new Set(d.tags.map(normalize)).size !== d.tags.length)
    throw new Error(`${d.slug}: etiquetas duplicadas al ignorar tildes y mayúsculas.`);
}
