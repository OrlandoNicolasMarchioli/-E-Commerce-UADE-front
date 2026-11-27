import { beforeEach, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../../App';
import { makeStore } from '../../store';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { stubDataFetch } from '../../test/mockDataFetch';
import { clearMockCache } from '../../services/api/mockClient';
import { createMockToken } from '../../services/mockToken';

beforeEach(() => {
  localStorage.clear();
  clearMockCache();
  stubDataFetch();
});

const renderRoute = (path, preloadedState) => render(
  <Provider store={makeStore(preloadedState)}>
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider><CartProvider><App /></CartProvider></AuthProvider>
    </MemoryRouter>
  </Provider>,
);

it('la ruta /cart sin sesión demostrativa redirige al login', () => {
  renderRoute('/cart');
  expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
});

it('usuario mock agrega al carrito y confirma una compra simulada', async () => {
  const users = await (await fetch('/data/users.json')).json();
  // La sesión ahora vive en el authSlice: se arranca con el usuario ya logueado.
  const session = { token: createMockToken(users[0]), user: users[0], status: 'succeeded', error: null };
  const user = userEvent.setup();
  renderRoute('/products/1', { auth: session });
  expect(await screen.findByRole('heading', { name: /Notebook Lenovo/ })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Add to cart' }));
  expect(await screen.findByText('Agregado al carrito')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Cart \(1 items\)/ }));
  expect(await screen.findByRole('heading', { name: 'Carrito' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Confirm purchase' }));
  await user.click(screen.getByRole('button', { name: 'Confirm', exact: true }));
  await waitFor(() => expect(screen.getByRole('heading', { name: /Detalle de compra/ })).toBeInTheDocument());
  expect(localStorage.getItem(`uade_mock_orders_${users[0].id}`)).toContain('PENDING');
});