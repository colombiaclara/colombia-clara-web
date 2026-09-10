import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Inline } from './Inline';
import { context, citation } from '../../../tests/support';
it('renderiza énfasis, enlace con base y cita como elementos permitidos', () => {
  render(
    <Inline
      content={[
        { type: 'strong', content: 'Dato' },
        { type: 'emphasis', content: 'Contexto' },
        { type: 'link', content: 'Método', href: '/metodologia/' },
        { type: 'citation', citation },
      ]}
      context={context}
    />,
  );
  expect(document.querySelector('strong')).toHaveTextContent('Dato');
  expect(document.querySelector('em')).toHaveTextContent('Contexto');
  expect(screen.getByRole('link', { name: 'Método' })).toHaveAttribute('href', '/cc/metodologia/');
});
