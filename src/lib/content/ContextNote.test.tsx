import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { ContextNote } from './ContextNote';
import { context } from '../../../tests/support';
it('presenta la salvedad en el cuerpo y no la oculta', () => {
  render(
    <ContextNote
      block={{
        id: 'c',
        type: 'context',
        tone: 'uncertainty',
        title: 'Límite de los datos',
        content: 'La muestra no representa al país.',
      }}
      context={context}
    />,
  );
  expect(screen.getByRole('complementary', { name: 'Límite de los datos' })).toHaveTextContent(
    'no representa al país',
  );
});
