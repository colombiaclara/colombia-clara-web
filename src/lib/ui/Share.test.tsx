import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect } from 'vitest';
import { Share } from './Share';
it('conserva el enlace aunque no exista API de compartir', async () => {
  Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
  Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
  render(<Share title="Título" url="https://example.org/articulo/" />);
  await userEvent.click(screen.getByText('Compartir publicación'));
  await userEvent.click(screen.getByRole('button', { name: 'Compartir o copiar enlace' }));
  expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.org/articulo/');
  expect(screen.getByRole('status')).toHaveTextContent('Copia el enlace');
});
