import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { EmptyState } from './EmptyState';
it('explica un estado vacío de forma visible', () => {
  render(
    <EmptyState
      title="Sin publicaciones"
      description="Las historias aparecerán después de su revisión."
    />,
  );
  expect(screen.getByRole('heading', { name: 'Sin publicaciones' })).toBeVisible();
  expect(screen.getByText(/después de su revisión/)).toBeVisible();
});
