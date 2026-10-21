import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Solo aceptamos rutas internas: no redirigir a URLs externas controladas por terceros.
  const destination = location.state?.from?.startsWith('/') &&
    !location.state.from.startsWith('//') ? location.state.from : '/';

  if (isAuthenticated) return <Navigate to={destination} replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate(destination, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p2-auth">
      <div className="ui-auth-card">
        <p className="p2-demo-note">Modo demostración: datos de /public/data/, sin autenticación real.</p>
        <h1>Iniciar sesión</h1>
        <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
          <label htmlFor="login-email">Email</label>
          <input className="ui-input" id="login-email" type="email" autoComplete="email"
            required value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="login-password">Contraseña</label>
          <input className="ui-input" id="login-password" type="password"
            autoComplete="current-password" required value={password}
            onChange={(e) => setPassword(e.target.value)} />
          {error && <p role="alert" className="ui-auth-error">{error}</p>}
          <button className="ui-btn ui-btn--primary ui-btn--md" disabled={loading} type="submit">
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <p>¿No tenés cuenta? <Link to="/register" state={{ from: destination }}>Registrate</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;