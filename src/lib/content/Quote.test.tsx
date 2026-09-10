import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Quote } from './Quote';
import { source, context, citation } from '../../../tests/support';
it('muestra atribución separada de la cita y fuente original', () => {
  render(
    <Quote
      block={{
        id: 'q',
        type: 'quote',
        content: 'Una frase atribuida',
        attribution: 'Persona de prueba',
        citations: [citation],
      }}
      context={context}
    />,
  );
  expect(document.querySelector('blockquote')).toHaveTextContent('Una frase atribuida');
  expect(screen.getByText('Persona de prueba')).toBeVisible();
  expect(screen.getByRole('link', { name: /Abrir original/ })).toHaveAttribute('href', source.url);
});
