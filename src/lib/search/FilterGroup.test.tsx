import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect, vi } from 'vitest';
import { FilterGroup } from './FilterGroup';
it('expone opciones nativas y valor seleccionado', async () => {
  const fn = vi.fn();
  render(
    <FilterGroup
      label="Tipo"
      value=""
      options={[{ value: 'dataset', label: 'Dataset' }]}
      onChange={fn}
    />,
  );
  await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Tipo' }), 'dataset');
  expect(fn).toHaveBeenCalledWith('dataset');
});
