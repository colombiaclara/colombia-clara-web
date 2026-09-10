import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Citation } from './Citation';
import { context, citation } from '../../../tests/support';
it('ofrece un enlace estable y un nombre accesible', () => {
  render(<Citation citation={citation} context={context} />);
  expect(screen.getByRole('link', { name: /Fuente 1: Recuento simulado/ })).toHaveAttribute(
    'href',
    '/cc/fuentes/src-demo-recuento/',
  );
});
