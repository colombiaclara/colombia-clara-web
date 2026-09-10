import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { Methodology } from './Methodology';
import { context, citation } from '../../../tests/support';
it('expone el procedimiento y sus referencias', () => {
  render(
    <Methodology
      block={{
        id: 'm',
        type: 'methodology',
        title: 'Cómo se calculó',
        content: 'Se dividió entre la base.',
        citations: [citation],
      }}
      context={context}
    />,
  );
  expect(screen.getByRole('region', { name: 'Cómo se calculó' })).toHaveTextContent('Se dividió');
});
