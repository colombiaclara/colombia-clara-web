import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { SourcePublicationLinks } from './SourcePublicationLinks';
it('separa páginas institucionales y retorna al bloque exacto', () => {
  render(
    <SourcePublicationLinks
      uses={[
        {
          id: 'p',
          title: 'Publicación',
          url: '/cc/articulos/p/',
          institutional: false,
          anchors: ['dato', 'grafico'],
        },
        { id: 'm', title: 'Método', url: '/cc/metodo/', institutional: true, anchors: ['nota'] },
      ]}
    />,
  );
  expect(
    screen.getByRole('heading', { name: 'Otras páginas que citan esta fuente' }),
  ).toBeVisible();
  expect(screen.getByRole('link', { name: 'Ir a la cita 2' })).toHaveAttribute(
    'href',
    '/cc/articulos/p/#grafico',
  );
});
