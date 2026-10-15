import { useState } from 'react';
import '../../ui.css';

const Navbar = ({ user = null, cartCount = 0, isAdmin = false, onSearch, onCart, onLogin, onRegister }) => {
  const [query, setQuery] = useState('');

  if (isAdmin) {
    return (
      <nav className="ui-navbar">
        <span className="ui-navbar-logo">
          UADE <span className="ui-admin-badge">ADMIN</span>
        </span>
        <div className="ui-navbar-actions">
          <a className="ui-navbar-link" href="#">Categories</a>
          <a className="ui-navbar-link" href="#">Products</a>
          <a className="ui-navbar-link" href="#">Orders</a>
          <a className="ui-navbar-link" href="#">Users</a>
          {user && (
            <span className="ui-navbar-link" style={{ color: '#fff', fontWeight: 700 }}>
              {user.firstName} ▾
            </span>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="ui-navbar">
      <a className="ui-navbar-logo" href="#">UADE</a>
      <div className="ui-navbar-search">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.(query)}
        />
        <button className="ui-navbar-search-btn" onClick={() => onSearch?.(query)} aria-label="Search">🔍</button>
      </div>
      <div className="ui-navbar-actions">
        {user ? (
          <>
            <a className="ui-navbar-link" href="#">My orders</a>
            <span className="ui-navbar-link" style={{ color: '#fff', fontWeight: 700 }}>
              {user.firstName} ▾
            </span>
          </>
        ) : (
          <>
            <button
              className="ui-btn ui-btn--ghost ui-btn--sm"
              style={{ color: 'rgba(255,255,255,.8)', borderColor: 'rgba(255,255,255,.3)' }}
              onClick={onLogin}
            >
              Sign in
            </button>
            <button className="ui-btn ui-btn--accent ui-btn--sm" onClick={onRegister}>
              Sign up
            </button>
          </>
        )}
        <button className="ui-navbar-cart" onClick={onCart} aria-label={`Cart (${cartCount} items)`}>
          🛒
          {cartCount > 0 && <span className="ui-cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
