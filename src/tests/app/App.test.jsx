import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../../App';
import { makeStore } from '../../store';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { stubDataFetch } from '../../test/mockDataFetch';
import { createMockToken } from '../../services/mockToken';

beforeEach(() => {
  localStorage.clear(); // Aísla sesiones entre pruebas.
  stubDataFetch();
});

// Cuando la ruta es el Home, deja terminar la carga de productos y categorías.
const settleHome = async () => {
  await waitFor(() => expect(document.querySelectorAll('.ui-product-card').length).toBeGreaterThan(0));
  await screen.findByRole('tab', { name: 'Tecnología' });
};

// El panel admin exige una sesión con rol ADMIN (AdminLayout). Los usuarios de prueba
// de users.json todavía no traen el rol, así que la sesión se arma acá.
const ADMIN = {
  id: 1, firstName: 'Nicolas', lastName: 'Marchioli', email: 'nicolasmarchioli@uade.edu.ar',
  regNumber: '1000001', registrationDate: '2026-08-01T09:00:00', isEnabled: true, role: 'ADMIN',
};
const sessionOf = (user) => ({ auth: { token: createMockToken(user), user, status: 'succeeded', error: null } });

const renderAt = (path, preloadedState) =>
  render(
    <Provider store={makeStore(preloadedState)}>
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider><CartProvider><App /></CartProvider></AuthProvider>
      </MemoryRouter>
    </Provider>,
  );

describe('App · rutas', () => {
  it.each([
    ['/', 'Todo lo que necesitás en un solo lugar'],
    ['/search', 'Búsqueda de productos'],
    ['/category/2', 'Productos por categoría'],
    ['/login', 'Iniciar sesión'],
    ['/register', 'Registro'],
    ['/profile', 'Mi perfil'],
  ])('%s muestra "%s" dentro del layout público', async (path, title) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')[0]).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    if (path === '/') await settleHome();
  });

  it.each([
    ['/admin/products', 'Gestión de Productos'],
    ['/admin/products/new', 'Admin · Alta / edición de producto'],
    ['/admin/products/3/edit', 'Admin · Alta / edición de producto'],
    ['/admin/categories', 'Gestión de Categorías'],
    ['/admin/users', 'Gestión de Usuarios'],
    ['/admin/orders', 'Gestión de Pedidos'],
  ])('%s muestra "%s" dentro del layout admin', async (path, title) => {
    renderAt(path, sessionOf(ADMIN));
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('/admin redirige a /admin/products', async () => {
    renderAt('/admin', sessionOf(ADMIN));
    expect(await screen.findByRole('heading', { level: 1, name: 'Gestión de Productos' })).toBeInTheDocument();
  });

  it('/admin sin sesión manda al login', () => {
    renderAt('/admin/products');
    expect(screen.getByRole('heading', { level: 1, name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('/admin con un usuario que no es ADMIN vuelve al Home', async () => {
    renderAt('/admin/products', sessionOf({ ...ADMIN, id: 2, role: 'USER' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Todo lo que necesitás en un solo lugar' })).toBeInTheDocument();
    await settleHome();
  });

  it('/admin con el token vencido manda al login', () => {
    const expired = { ...sessionOf(ADMIN).auth, token: createMockToken(ADMIN, Date.now() - 2 * 60 * 60 * 1000) };
    renderAt('/admin/products', { auth: expired });
    expect(screen.getByRole('heading', { level: 1, name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('una ruta inexistente muestra la página 404 con el layout público', () => {
    renderAt('/ruta/que/no/existe');
    expect(screen.getByRole('heading', { level: 1, name: /404/ })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('pasa los parámetros de la URL a la página', () => {
    renderAt('/category/3');
    expect(screen.getByText('id=3')).toBeInTheDocument();
  });

  it('/products/:id muestra el detalle del producto dentro del layout público', async () => {
    renderAt('/products/5');
    expect(await screen.findByRole('heading', { level: 1, name: /Pack de lapiceras BIC/ })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

describe('App · navegación desde el layout', () => {
  it('buscar desde la Navbar va a /search con la consulta', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.type(screen.getByPlaceholderText('Search products...'), 'notebook{Enter}');
    expect(screen.getByRole('heading', { level: 1, name: 'Búsqueda de productos' })).toBeInTheDocument();
    expect(screen.getByText('/search?q=notebook')).toBeInTheDocument();
  });
  
it('el carrito sin sesión redirige a login', async () => {
  const user = userEvent.setup();

  renderAt('/');

  // Un usuario sin sesión intenta ingresar al carrito.
  await user.click(screen.getByRole('button', { name: /Cart/ }));

  // La ruta protegida debe mostrar el login, no el carrito.
  expect(
    await screen.findByRole('heading', {
      level: 1,
      name: 'Iniciar sesión',
    })
  ).toBeInTheDocument();
});

  it('Sign in y Sign up van a /login y /register', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Iniciar sesión' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Registro' })).toBeInTheDocument();
  });

  it('el logo vuelve al Home', async () => {
    const user = userEvent.setup();
    renderAt('/cart');
    await user.click(screen.getByRole('link', { name: 'UADE' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Todo lo que necesitás en un solo lugar' })).toBeInTheDocument();
    await settleHome();
  });

  it('los links del footer navegan sin recargar', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('link', { name: 'Search products' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Búsqueda de productos' })).toBeInTheDocument();
  });

  it('los links de la Navbar admin navegan entre secciones', async () => {
    const user = userEvent.setup();
    renderAt('/admin/products', sessionOf(ADMIN));
    await user.click(await screen.findByRole('link', { name: 'Categories' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Gestión de Categorías' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Users' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Gestión de Usuarios' })).toBeInTheDocument();
  });
});

describe('App · preferencias', () => {
  it('el botón de tema de la navbar cambia el tema de toda la página', async () => {
    const user = userEvent.setup();
    renderAt('/');
    expect(document.documentElement.dataset.theme).toBe('light');
    await user.click(screen.getByRole('button', { name: 'Activar tema oscuro' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: 'Activar tema claro' })).toBeInTheDocument();
    await settleHome();
  });

  it('la búsqueda hecha desde la navbar queda guardada para la sesión', async () => {
    const user = userEvent.setup();
    const store = makeStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <CartProvider><App /></CartProvider>
        </MemoryRouter>
      </Provider>,
    );
    await user.type(screen.getByPlaceholderText('Search products...'), 'notebook{Enter}');
    expect(store.getState().search.lastQuery).toBe('notebook');
  });
});
