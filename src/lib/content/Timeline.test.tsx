import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Timeline } from './Timeline';
import { context, citation } from '../../../tests/support';
it('preserva el día editorial y las fuentes de cada evento', () => {
  render(
    <Timeline
      block={{
        id: 't',
        type: 'timeline',
        title: 'Secuencia',
        items: [
          { date: '2026-09-09', title: 'Evento', content: 'Descripción', citations: [citation] },
        ],
      }}
      context={context}
    />,
  );
  expect(document.querySelector('time')).toHaveAttribute('datetime', '2026-09-09');
  expect(document.querySelector('time')).toHaveTextContent('9 de septiembre');
  expect(screen.getByRole('link', { name: /Fuente 1/ })).toBeVisible();
});
