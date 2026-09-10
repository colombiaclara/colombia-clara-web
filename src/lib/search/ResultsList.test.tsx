import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { ResultsList } from './ResultsList';
it('muestra un vacío explicativo y después resultados enlazados', () => {
  const { rerender } = render(<ResultsList items={[]} />);
  expect(screen.getByRole('heading', { name: 'No encontramos resultados' })).toBeVisible();
  rerender(
    <ResultsList
      items={[
        {
          id: 'a',
          title: 'Agua',
          description: 'Contexto',
          url: '/cc/a/',
          text: '',
          type: 'explainer',
        },
      ]}
    />,
  );
  expect(screen.getByRole('link', { name: 'Agua' })).toHaveAttribute('href', '/cc/a/');
});
