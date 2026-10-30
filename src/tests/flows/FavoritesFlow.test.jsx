import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../../App';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { makeStore } from '../../store';
import { stubDataFetch } from '../../test/mockDataFetch';
import { clearMockCache } from '../../services/api/mockClient';

beforeEach(() => {
  localStorage.clear();
  clearMockCache();
  stubDataFetch();
});

const renderRoute = (path) => render(
  <Provider store={makeStore()}>
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider><CartProvider><App /></CartProvider></AuthProvider>
    </MemoryRouter>
  </Provider>,
);

// Prueba que el botón, el contador del Navbar y la página comparten el mismo estado de Redux.
it('marcar un favorito actualiza el Navbar y aparece en /favorites', async () => {
  const user = userEvent.setup();
  renderRoute('/products/1');
  expect(await screen.findByRole('heading', { name: /Notebook Lenovo/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Favoritos (0)' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /Agregar a favoritos/ }));
  await user.click(screen.getByRole('button', { name: 'Favoritos (1)' }));

  expect(await screen.findByRole('heading', { name: 'Mis favoritos' })).toBeInTheDocument();
  expect(screen.getByText(/Notebook Lenovo/)).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /Quitar/ }));
  expect(screen.getByText('Todavía no tenés favoritos')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Favoritos (0)' })).toBeInTheDocument();
});

it('desde un favorito se puede volver al detalle del producto', async () => {
  const user = userEvent.setup();
  renderRoute('/products/1');
  await user.click(await screen.findByRole('button', { name: /Agregar a favoritos/ }));
  await user.click(screen.getByRole('button', { name: 'Favoritos (1)' }));
  await user.click(await screen.findByRole('button', { name: 'Ver producto' }));
  expect(await screen.findByRole('button', { name: /En favoritos/ })).toBeInTheDocument();
});
