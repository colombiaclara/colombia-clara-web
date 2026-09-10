import { it, expect } from 'vitest';
import { search, readSearch, searchParams } from './search';
it('combina tildes, institución, línea y tipo con desempate estable', () => {
  const rows = [
    {
      id: 'b',
      title: 'Método',
      description: '',
      text: 'Institución Pública',
      url: '/b',
      type: 'report',
      sections: ['datos-claros'],
    },
    {
      id: 'a',
      title: 'Método',
      description: '',
      text: 'Institución Pública',
      url: '/a',
      type: 'report',
      sections: ['datos-claros'],
    },
  ];
  expect(
    search(rows, { q: 'INSTITUCION metodo', section: 'datos-claros', kind: 'report', page: 1 }).map(
      (i) => i.id,
    ),
  ).toEqual(['a', 'b']);
  expect(search(rows, { q: '', section: 'planeta-comun', kind: '', page: 1 })).toEqual([]);
});
it('consulta y filtros se conservan en una URL compartible', () => {
  const s = { q: 'agua potable', section: 'datos-claros', kind: 'dataset', page: 3 };
  expect(readSearch(searchParams(s))).toEqual(s);
  expect(readSearch(new URLSearchParams('pagina=-4')).page).toBe(1);
});
