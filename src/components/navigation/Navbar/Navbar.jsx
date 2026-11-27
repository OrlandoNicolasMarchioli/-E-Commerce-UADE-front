import { useState } from 'react';
import '../../ui.css';

// onLogout, onFavorites y onToggleTheme son opcionales para no romper la demo ni las pruebas de componentes.
const Navbar = ({ user = null, cartCount = 0, favoritesCount = 0, isAdmin = false,
  theme = 'light', defaultQuery = '',
  onSearch, onCart, onFavorites, onLogin, onRegister, onLogout, onNavigate, onToggleTheme }) => {
  // Arranca con la última búsqueda guardada (si la hay), así no se pierde con un F5.
  const [query, setQuery] = useState(defaultQuery);
  const themeButton = onToggleTheme && (
    <button className="ui-navbar-cart" onClick={onToggleTheme} aria-pressed={theme === 'dark'}
      aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}>
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
  const link = (path) => ({
    href: onNavigate ? path : '#',
    onClick: (e) => {
      if (onNavigate) { e.preventDefault(); onNavigate(path); }
    },
  });

  if (isAdmin) {
    return (
      <nav className="ui-navbar">
        <span className="ui-navbar-logo">UADE <span className="ui-admin-badge">ADMIN</span></span>
        <div className="ui-navbar-actions">
          <a className="ui-navbar-link" {...link('/admin/categories')}>Categories</a>
          <a className="ui-navbar-link" {...link('/admin/products')}>Products</a>
          <a className="ui-navbar-link" {...link('/admin/orders')}>Orders</a>
          <a className="ui-navbar-link" {...link('/admin/users')}>Users</a>
          {themeButton}
          {user && <span className="ui-navbar-link" style={{ color: '#fff', fontWeight: 700 }}>
            {user.firstName} ▾
          </span>}
        </div>
      </nav>
    );
  }

  return (
    <nav className="ui-navbar">
      <a className="ui-navbar-logo" {...link('/')}>UADE</a>
      <div className="ui-navbar-search">
        <input type="text" placeholder="Search products..." value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.(query)} />
        <button className="ui-navbar-search-btn" onClick={() => onSearch?.(query)} aria-label="Search">🔍</button>
      </div>
      <div className="ui-navbar-actions">
        {user ? (
          <>
            <a className="ui-navbar-link" {...link('/my-orders')}>My orders</a>
            <span className="ui-navbar-link" style={{ color: '#fff', fontWeight: 700 }}>
              {user.firstName}
            </span>
            {onLogout && <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={onLogout}>Salir</button>}
          </>
        ) : (
          <>
            <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={onLogin}>Sign in</button>
            <button className="ui-btn ui-btn--accent ui-btn--sm" onClick={onRegister}>Sign up</button>
          </>
        )}
        {themeButton}
        {onFavorites && (
          <button className="ui-navbar-cart" onClick={onFavorites} aria-label={`Favoritos (${favoritesCount})`}>
            ♥{favoritesCount > 0 && <span className="ui-cart-badge">{favoritesCount}</span>}
          </button>
        )}
        <button className="ui-navbar-cart" onClick={onCart} aria-label={`Cart (${cartCount} items)`}>
          🛒{cartCount > 0 && <span className="ui-cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;