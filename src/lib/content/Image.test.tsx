import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Image } from './Image';
it('mantiene alt, dimensiones, crédito y prioridad de portada', () => {
  render(
    <Image
      image={{
        src: '/cc/img.webp',
        width: 800,
        height: 600,
        alt: 'Muestra de color',
        credit: 'Autor confirmado',
        caption: 'Pie de imagen',
      }}
      priority
    />,
  );
  const img = screen.getByRole('img', { name: 'Muestra de color' });
  expect(img).toHaveAttribute('width', '800');
  expect(img).toHaveAttribute('loading', 'eager');
  expect(screen.getByText(/Crédito: Autor confirmado/)).toBeVisible();
});
