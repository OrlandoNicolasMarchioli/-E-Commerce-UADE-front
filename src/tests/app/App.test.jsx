import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { stubDataFetch } from '../../test/mockDataFetch';

beforeEach(() => {
  localStorage.clear(); // Aísla sesiones entre pruebas.
  stubDataFetch();
});

// Cuando la ruta es el Home, deja terminar la carga de productos y categorías.
const settleHome = async () => {
  await waitFor(() => expect(document.querySelectorAll('.ui-product-card').length).toBeGreaterThan(0));
  await screen.findByRole('tab', { name: 'Tecnología' });
};

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider><CartProvider><App /></CartProvider></AuthProvider>
    </MemoryRouter>,
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
    ['/admin/products', 'Admin · Productos'],
    ['/admin/products/new', 'Admin · Alta / edición de producto'],
    ['/admin/products/3/edit', 'Admin · Alta / edición de producto'],
    ['/admin/categories', 'Admin · Categorías'],
    ['/admin/users', 'Admin · Usuarios'],
    ['/admin/orders', 'Admin · Pedidos'],
  ])('%s muestra "%s" dentro del layout admin', (path, title) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('/admin redirige a /admin/products', () => {
    renderAt('/admin');
    expect(screen.getByRole('heading', { level: 1, name: 'Admin · Productos' })).toBeInTheDocument();
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
    renderAt('/admin/products');
    await user.click(screen.getByRole('link', { name: 'Categories' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Admin · Categorías' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Users' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Admin · Usuarios' })).toBeInTheDocument();
  });
});
