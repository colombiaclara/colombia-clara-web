import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Paragraph } from './Paragraph';
import { context, citation } from '../../../tests/support';
it('escapa texto y conserva el enlace a la evidencia', () => {
  render(
    <Paragraph
      block={{
        id: 'p',
        type: 'paragraph',
        evidence: 'fact',
        content: '<script>no ejecutar</script>',
        citations: [citation],
      }}
      context={context}
    />,
  );
  expect(screen.getByText('<script>no ejecutar</script>')).toBeVisible();
  expect(screen.getByRole('link', { name: /Fuente 1/ })).toHaveAttribute(
    'href',
    '/cc/fuentes/src-demo-recuento/',
  );
  expect(document.querySelector('script')).toBeNull();
});
