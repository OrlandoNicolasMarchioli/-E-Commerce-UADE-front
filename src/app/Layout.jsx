import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { selectFavoritesCount } from '../store/favoritesSlice';
import { selectTheme, toggleTheme } from '../store/preferencesSlice';
import { selectLastQuery, setLastQuery } from '../store/searchSlice';

const FOOTER_COLUMNS = [
  { heading: 'Shop', links: [
    { label: 'Home', href: '/' }, { label: 'Search products', href: '/search' },
    { label: 'My cart', href: '/cart' }, { label: 'Mis favoritos', href: '/favorites' },
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
  const favoritesCount = useSelector(selectFavoritesCount);
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const lastQuery = useSelector(selectLastQuery);

  const signOut = () => {
    logout();
    navigate('/', { replace: true });
  };
  const search = (q) => {
    dispatch(setLastQuery(q)); // Queda en sessionStorage mientras la pestaña siga abierta.
    navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search');
  };
  return (
    <div className="app-shell">
      <Navbar user={user} cartCount={count} favoritesCount={favoritesCount}
        theme={theme} onToggleTheme={() => dispatch(toggleTheme())} defaultQuery={lastQuery}
        onFavorites={() => navigate('/favorites')} onNavigate={navigate} onLogout={signOut}
        onSearch={search}
        onCart={() => navigate('/cart')} onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')} />
      <main className="app-main"><Outlet /></main>
      <Footer columns={FOOTER_COLUMNS}
        copyright="© 2026 UADE E-Commerce · Aplicaciones Interactivas" onNavigate={navigate} />
    </div>
  );
};

export default Layout;