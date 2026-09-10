import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Metric } from './Metric';
import { context, citation } from '../../../tests/support';
it('distingue una base cero de una variación cero', () => {
  render(
    <Metric
      block={{
        id: 'm',
        type: 'metric',
        title: 'Indicador',
        value: 15,
        unit: 'unidades',
        period: 'Final',
        comparison: { value: 0, period: 'Inicial', kind: 'relative' },
        citations: [citation],
      }}
      context={context}
    />,
  );
  expect(screen.getByText(/no definida/)).toBeVisible();
  expect(screen.queryByText(/Infinity/)).toBeNull();
});
it('calcula puntos porcentuales sin confundirlos con variación relativa', () => {
  render(
    <Metric
      block={{
        id: 'm',
        type: 'metric',
        title: 'Proporción',
        value: 25,
        unit: '%',
        period: 'Final',
        comparison: { value: 20, period: 'Inicial', kind: 'percentage-points' },
        citations: [citation],
      }}
      context={context}
    />,
  );
  expect(screen.getByText(/5 puntos porcentuales/)).toBeVisible();
});
