import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { SourceCard } from './SourceCard';
import { source } from '../../../tests/support';
it('cuenta publicaciones recibidas, no citas', () => {
  render(<SourceCard source={source} base="/cc/" count={1} />);
  expect(screen.getByText('1 publicación la utiliza')).toBeVisible();
  expect(screen.getByRole('link', { name: source.title })).toHaveAttribute(
    'href',
    '/cc/fuentes/src-demo-recuento/',
  );
});
