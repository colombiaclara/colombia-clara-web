import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect, vi } from 'vitest';
import { Search } from './Search';
it('busca sin tildes, guarda filtros en URL y recupera popstate', async () => {
  history.replaceState(null, '', '/fuentes/?q=metodo');
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 'a',
          title: 'Método',
          description: 'Guía',
          url: '/a/',
          text: 'Institución',
          type: 'dataset',
          sections: ['datos-claros'],
        },
        {
          id: 'b',
          title: 'Otro',
          description: 'Contexto',
          url: '/b/',
          text: '',
          type: 'report',
          sections: [],
        },
      ],
    }),
  );
  render(<Search indexUrl="/sources.json" kind="sources" />);
  expect(await screen.findByRole('link', { name: 'Método' })).toBeVisible();
  expect(screen.queryByRole('link', { name: 'Otro' })).toBeNull();
  await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'report');
  expect(location.search).toContain('tipo=report');
  expect(screen.getByRole('heading', { name: 'No encontramos resultados' })).toBeVisible();
  history.replaceState(null, '', '/fuentes/?q=otro');
  act(() => window.dispatchEvent(new PopStateEvent('popstate')));
  expect(await screen.findByRole('link', { name: 'Otro' })).toBeVisible();
  vi.unstubAllGlobals();
});
