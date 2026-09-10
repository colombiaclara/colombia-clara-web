import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { SourceDetails } from './SourceDetails';
import { source } from '../../../tests/support';
it('acepta fecha desconocida y entrevista sin URL', () => {
  render(
    <SourceDetails
      source={{ ...source, kind: 'interview', url: undefined, publishedAt: undefined }}
    />,
  );
  expect(screen.getByText('No conocida')).toBeVisible();
  expect(screen.getByText('Esta fuente no tiene una URL pública.')).toBeVisible();
  expect(screen.queryByRole('link', { name: /original/ })).toBeNull();
});
