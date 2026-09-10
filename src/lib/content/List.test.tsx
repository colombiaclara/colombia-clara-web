import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { List } from './List';
import { context, citation } from '../../../tests/support';
it('ofrece orden y citas por elemento', () => {
  render(
    <List
      block={{
        id: 'l',
        type: 'list',
        ordered: true,
        items: [{ content: 'Primer paso', citations: [citation] }, { content: 'Segundo paso' }],
      }}
      context={context}
    />,
  );
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByRole('list').tagName).toBe('OL');
  expect(screen.getByRole('link', { name: /Fuente 1/ })).toBeVisible();
});
