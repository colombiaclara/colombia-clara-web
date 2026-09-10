import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { KeyPoints } from './KeyPoints';
import { context, citation } from '../../../tests/support';
it('conserva las referencias en las ideas iniciales', () => {
  render(
    <KeyPoints items={[{ content: 'Una cifra clave', citations: [citation] }]} context={context} />,
  );
  expect(screen.getByRole('heading', { name: 'Claves de lectura' })).toBeVisible();
  expect(screen.getByRole('link', { name: /Fuente 1/ })).toBeVisible();
});
