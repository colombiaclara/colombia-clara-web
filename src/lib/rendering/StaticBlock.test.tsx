import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { StaticBlock } from './StaticBlock';
import { context } from '../../../tests/support';
it('elige un bloque conocido sin ejecutar nombres externos', () => {
  render(
    <StaticBlock
      block={{ id: 'h', type: 'heading', level: 2, content: 'Apartado' }}
      context={context}
    />,
  );
  expect(screen.getByRole('heading', { level: 2, name: 'Apartado' })).toBeVisible();
});
