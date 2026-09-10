import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect } from 'vitest';
import { MobileNavigation } from './MobileNavigation';
it('usa un control nativo que abre los enlaces sin hidratación', async () => {
  render(<MobileNavigation links={[{ label: 'Fuentes', href: '/cc/fuentes/' }]} />);
  expect(document.querySelector('details')).not.toHaveAttribute('open');
  await userEvent.click(screen.getByText('Menú'));
  expect(document.querySelector('details')).toHaveAttribute('open');
  expect(screen.getByRole('link', { name: 'Fuentes' })).toHaveAttribute('href', '/cc/fuentes/');
});
