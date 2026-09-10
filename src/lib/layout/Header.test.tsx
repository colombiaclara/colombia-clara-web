import { render, screen, within } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Header } from './Header';
import { site } from '../../../tests/support';
it('muestra marca y navegación con prefijo', () => {
  render(<Header site={site} base="/cc/" />);
  expect(screen.getByRole('link', { name: 'Colombia Clara · inicio' })).toHaveAttribute(
    'href',
    '/cc/',
  );
  const nav = screen.getByRole('navigation', { name: 'Navegación principal' });
  expect(within(nav).getByRole('link', { name: 'Fuentes' })).toHaveAttribute(
    'href',
    '/cc/fuentes/',
  );
});
