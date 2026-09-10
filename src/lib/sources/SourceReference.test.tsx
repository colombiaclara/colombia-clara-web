import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { SourceReference } from './SourceReference';
import { source, context, citation } from '../../../tests/support';
it('separa ficha, localizador y documento original', () => {
  render(<SourceReference citations={[citation]} context={context} />);
  expect(screen.getByText('Tabla 1')).toBeVisible();
  expect(screen.getByRole('link', { name: /Abrir original/ })).toHaveAttribute('href', source.url);
});
