import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { ChartCanvas } from './ChartCanvas';
import { dataset, chart } from '../../../tests/support';
import { transformChart } from '../charts/model';
it('barras horizontales parten de cero y reflejan 120/150', () => {
  const { container } = render(
    <ChartCanvas block={chart} model={transformChart(chart, dataset)} />,
  );
  const bars = container.querySelectorAll<HTMLElement>('.bar-fill');
  expect(bars[0].style.width).toBe('80%');
  expect(bars[1].style.width).toBe('100%');
  expect(screen.getByText('120')).toBeVisible();
});
it('dona tiene arcos y total, sin inventar composición incompleta', () => {
  const b = { ...chart, kind: 'donut' as const };
  const { container, rerender } = render(
    <ChartCanvas block={b} model={transformChart(b, dataset)} />,
  );
  expect(container.querySelectorAll('path')).toHaveLength(2);
  expect(screen.getByText('270')).toBeVisible();
  rerender(
    <ChartCanvas
      block={b}
      model={transformChart(b, {
        ...dataset,
        rows: [
          { categoria: 'A', cantidad: null },
          { categoria: 'B', cantidad: 150 },
        ],
      })}
    />,
  );
  expect(screen.getByText(/Composición incompleta/)).toBeVisible();
  expect(container.querySelector('svg')).toBeNull();
});
