import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Aceptar únicamente rutas internas para evitar redirecciones externas.
  const requestedDestination = location.state?.from;
  const destination =
    typeof requestedDestination === 'string' &&
    requestedDestination.startsWith('/') &&
    !requestedDestination.startsWith('//')
      ? requestedDestination
      : '/';

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Email o contraseña incorrectos.');
        }

        throw new Error('No se pudo iniciar sesión. Intentá nuevamente.');
      }

      const authResponse = await response.json();

      if (!authResponse.token || !authResponse.user) {
        throw new Error('La respuesta del servidor no es válida.');
      }

      // Conservamos el formato de respuesta que espera tu contexto.
      login(authResponse);

      // Los administradores deben ir al panel, salvo que se haya
      // solicitado explícitamente volver a una ruta interna.
      if (authResponse.user.role === 'ADMIN') {
        navigate(
          destination !== '/' ? destination : '/admin',
          { replace: true }
        );
      } else {
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'No se pudo conectar con el servidor.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container">
      <div className="ui-auth-card">
        <h1>Iniciar sesión</h1>

        <form onSubmit={handleSubmit}>
          <div className="ui-form-group">
            <label className="ui-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="ui-input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="ui-form-group">
            <label className="ui-label" htmlFor="login-password">
              Contraseña
            </label>
            <input
              id="login-password"
              className="ui-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p role="alert" className="ui-auth-error">
              {error}
            </p>
          )}

          <button
            className="ui-btn ui-btn--primary ui-btn--md"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p>
          ¿No tenés cuenta?{' '}
          <Link to="/register" state={{ from: destination }}>
            Registrate
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
