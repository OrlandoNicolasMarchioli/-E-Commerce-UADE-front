import { beforeEach, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { stubDataFetch } from '../../test/mockDataFetch';
import { clearMockCache } from '../../services/api/mockClient';

beforeEach(() => {
  localStorage.clear();
  clearMockCache();
  stubDataFetch();
});

const renderRoute = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <AuthProvider><CartProvider><App /></CartProvider></AuthProvider>
  </MemoryRouter>,
);

it('la ruta /cart sin sesión demostrativa redirige al login', () => {
  renderRoute('/cart');
  expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
});

it('usuario mock agrega al carrito y confirma una compra simulada', async () => {
  const users = await (await fetch('/data/users.json')).json();
  localStorage.setItem('uade_mock_session', JSON.stringify(users[0]));
  const user = userEvent.setup();
  renderRoute('/products/1');
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