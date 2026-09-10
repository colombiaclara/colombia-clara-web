import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Footer } from './Footer';
import { site } from '../../../tests/support';
it('no inventa contacto y permite suscribirse mediante RSS', () => {
  render(<Footer site={site} base="/cc/" />);
  expect(screen.getByRole('link', { name: 'RSS' })).toHaveAttribute('href', '/cc/rss.xml');
  expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
});
