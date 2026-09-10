import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect } from 'vitest';
import { ChartFrame } from './ChartFrame';
import { dataset, context, chart } from '../../../tests/support';
it('cambia filtro, estado, tabla y CSV de manera coherente', async () => {
  const d = {
    ...dataset,
    columns: [
      { id: 'categoria', label: 'Categoría', type: 'string' as const },
      { id: 'a', label: 'Serie A', type: 'number' as const },
      { id: 'b', label: 'Serie B', type: 'number' as const },
    ],
    rows: [
      { categoria: 'Uno', a: 10, b: 30 },
      { categoria: 'Dos', a: 20, b: null },
    ],
  };
  const b = {
    ...chart,
    kind: 'grouped-bar' as const,
    encoding: { category: 'categoria', series: ['a', 'b'] },
    options: { seriesFilter: true },
  };
  render(<ChartFrame block={b} dataset={d} datasetUrl="/datos.json" context={context} />);
  await userEvent.click(screen.getByLabelText('Serie B'));
  expect(screen.getByRole('status')).toHaveTextContent('1 serie visible');
  expect(screen.getAllByRole('columnheader', { hidden: true })).toHaveLength(2);
  const href = screen
    .getByRole('link', { name: 'Descargar esta tabla (CSV)', hidden: true })
    .getAttribute('href')!;
  expect(decodeURIComponent(href)).toContain('10');
  expect(decodeURIComponent(href)).not.toContain('Serie B');
  await userEvent.click(screen.getByText('Explorar los valores'));
  await userEvent.selectOptions(screen.getByLabelText('Consultar un registro'), '1');
  expect(screen.getByText('Dos', { selector: 'dd' })).toBeVisible();
  expect(screen.getByText('20', { selector: 'dd' })).toBeVisible();
});
