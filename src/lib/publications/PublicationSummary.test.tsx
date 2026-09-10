import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { PublicationSummary } from './PublicationSummary';
import { publication } from '../../../tests/support';
it('mantiene URL con prefijo, sección y fecha', () => {
  render(<PublicationSummary publication={publication} base="/cc/" />);
  expect(screen.getByRole('link', { name: publication.title })).toHaveAttribute(
    'href',
    '/cc/articulos/leer-una-comparacion/',
  );
  expect(screen.getByText(/Datos Claros/)).toBeVisible();
  expect(document.querySelector('time')).toHaveTextContent('9 de septiembre');
});
