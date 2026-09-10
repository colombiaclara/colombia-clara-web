import { it, expect } from 'vitest';
import { percentageChange, formatDate, withBase, formatNumber } from './format';
it('calcula porcentaje sobre su base y reconoce base cero', () => {
  expect(percentageChange(150, 120)).toBe(25);
  expect(percentageChange(120, 150)).toBe(-20);
  expect(percentageChange(4, 0)).toBeNull();
});
it('mantiene el día de Colombia y distingue cero de null', () => {
  expect(formatDate('2026-09-09')).toContain('9 de septiembre');
  expect(formatNumber(0)).toBe('0');
  expect(formatNumber(null)).toBe('Sin dato');
  expect(withBase('/fuentes/', '/cc/')).toBe('/cc/fuentes/');
  expect(withBase('https://example.org', '/cc/')).toBe('https://example.org');
});
