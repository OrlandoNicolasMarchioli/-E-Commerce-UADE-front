import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';

// Columnas del footer. Los href que empiezan con "/" navegan con el router.
const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Search products', href: '/search' },
      { label: 'My cart', href: '/cart' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign in', href: '/login' },
      { label: 'Sign up', href: '/register' },
      { label: 'My orders', href: '/my-orders' },
    ],
  },
  {
    heading: 'UADE E-Commerce',
    links: [{ label: 'Aplicaciones Interactivas · 2C-2026' }],
  },
];

/** Layout público: Navbar + contenido de la ruta (Outlet) + Footer. */
const Layout = () => {
  const navigate = useNavigate();

  // TODO (Parte 2): reemplazar por los datos reales del AuthContext y CartContext.
  const user = null;
  const cartCount = 0;

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        cartCount={cartCount}
        onNavigate={navigate}
        onSearch={(q) => navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search')}
        onCart={() => navigate('/cart')}
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer
        columns={FOOTER_COLUMNS}
        copyright="© 2026 UADE E-Commerce · Aplicaciones Interactivas"
        onNavigate={navigate}
      />
    </div>
  );
};

export default Layout;
