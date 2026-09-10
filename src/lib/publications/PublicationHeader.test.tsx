import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { PublicationHeader } from './PublicationHeader';
import { publication, context } from '../../../tests/support';
it('muestra un único h1, fechas reales y tiempo estimado', () => {
  render(
    <PublicationHeader
      publication={{ ...publication, updatedAt: '2026-09-10' }}
      authors={[]}
      minutes={4}
      context={context}
    />,
  );
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByText('4 min de lectura estimada')).toBeVisible();
  expect(screen.getByText(/Actualizado: 10 de septiembre/)).toBeVisible();
});
