import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';
it('marca la ubicación actual sin fabricar un enlace', () => {
  render(<Breadcrumbs items={[{ label: 'Inicio', href: '/cc/' }, { label: 'Artículo' }]} />);
  expect(screen.getByRole('navigation', { name: 'Ruta de navegación' })).toBeVisible();
  expect(screen.getByText('Artículo')).toHaveAttribute('aria-current', 'page');
});
