import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Corrections } from './Corrections';
it('enlaza al bloque corregido con fecha visible', () => {
  render(
    <Corrections
      items={[
        { date: '2026-09-09', description: 'Se corrigió la base.', blocks: ['base-correcta'] },
      ]}
    />,
  );
  expect(screen.getByRole('link', { name: 'Ver apartado corregido' })).toHaveAttribute(
    'href',
    '#base-correcta',
  );
  expect(document.querySelector('time')).toHaveTextContent('9 de septiembre');
});
it('omite la sección vacía', () => {
  const { container } = render(<Corrections items={[]} />);
  expect(container).toBeEmptyDOMElement();
});
