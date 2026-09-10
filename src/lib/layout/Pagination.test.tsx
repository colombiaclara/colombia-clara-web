import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect, vi } from 'vitest';
import { Pagination } from './Pagination';
it('marca la página actual e impide retroceder desde la primera', async () => {
  const fn = vi.fn();
  render(<Pagination page={1} pages={4} onPage={fn} />);
  expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page');
  await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
  expect(fn).toHaveBeenCalledWith(2);
});
