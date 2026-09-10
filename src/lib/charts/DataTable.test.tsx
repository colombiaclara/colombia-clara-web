import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { DataTable } from './DataTable';
import { dataset } from '../../../tests/support';
it('distingue cero y null, conserva encabezados y región de scroll', () => {
  render(
    <DataTable
      title="Datos"
      columns={dataset.columns}
      rows={[
        { categoria: 'A', cantidad: 0 },
        { categoria: 'B', cantidad: null },
      ]}
    />,
  );
  expect(screen.getByRole('region', { name: 'Tabla: Datos' })).toHaveAttribute('tabindex', '0');
  expect(screen.getByRole('cell', { name: '0' })).toBeVisible();
  expect(screen.getByRole('cell', { name: 'Sin dato' })).toBeVisible();
  expect(screen.getAllByRole('columnheader')).toHaveLength(2);
});
