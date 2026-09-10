import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { RelatedPublications } from './RelatedPublications';
import { publication } from '../../../tests/support';
it('no muestra relacionados cuando no hay candidatos', () => {
  const { container, rerender } = render(<RelatedPublications publications={[]} base="/cc/" />);
  expect(container).toBeEmptyDOMElement();
  rerender(<RelatedPublications publications={[publication]} base="/cc/" />);
  expect(screen.getByRole('link', { name: publication.title })).toBeVisible();
});
