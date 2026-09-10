import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { AuthorByline } from './AuthorByline';
it('usa solo autorías recibidas y enlaces confirmados', () => {
  render(
    <AuthorByline
      authors={[
        {
          schemaVersion: '1.0',
          id: 'ana',
          name: 'Ana',
          bio: 'Editora',
          url: 'https://example.org/ana',
        },
        { schemaVersion: '1.0', id: 'luis', name: 'Luis', bio: 'Editor' },
      ]}
    />,
  );
  expect(screen.getByRole('link', { name: 'Ana' })).toHaveAttribute(
    'href',
    'https://example.org/ana',
  );
  expect(screen.queryByRole('link', { name: 'Luis' })).toBeNull();
});
