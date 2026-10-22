import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const FOOTER_COLUMNS = [
  { heading: 'Shop', links: [
    { label: 'Home', href: '/' }, { label: 'Search products', href: '/search' },
    { label: 'My cart', href: '/cart' },
  ] },
  { heading: 'Account', links: [
    { label: 'Sign in', href: '/login' }, { label: 'Sign up', href: '/register' },
    { label: 'My orders', href: '/my-orders' },
  ] },
  { heading: 'UADE E-Commerce', links: [{ label: 'Aplicaciones Interactivas · 2C-2026' }] },
];

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count } = useCart();

  const signOut = () => {
    logout();
    navigate('/', { replace: true });
  };
  return (
    <div className="app-shell">
      <Navbar user={user} cartCount={count} onNavigate={navigate} onLogout={signOut}
        onSearch={(q) => navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search')}
        onCart={() => navigate('/cart')} onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')} />
      <main className="app-main"><Outlet /></main>
      <Footer columns={FOOTER_COLUMNS}
        copyright="© 2026 UADE E-Commerce · Aplicaciones Interactivas" onNavigate={navigate} />
    </div>
  );
};

export default Layout;