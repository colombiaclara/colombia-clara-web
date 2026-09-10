import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect, vi } from 'vitest';
import { SearchInput } from './SearchInput';
it('envía la consulta desde un input etiquetado', async () => {
  const fn = vi.fn();
  render(<SearchInput value="" onChange={fn} label="Buscar publicaciones" />);
  await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar publicaciones' }), 'a');
  expect(fn).toHaveBeenCalledWith('a');
});
