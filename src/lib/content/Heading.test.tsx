import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Heading } from './Heading';
it('conserva el nivel semántico y un título largo', () => {
  render(
    <Heading
      block={{
        id: 'h',
        type: 'heading',
        level: 3,
        content: 'Un título con acentos y suficientes palabras para explicar el apartado',
      }}
    />,
  );
  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('acentos');
  expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
});
