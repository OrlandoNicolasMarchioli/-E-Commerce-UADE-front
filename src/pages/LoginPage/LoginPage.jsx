import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('../../../public/data/users.json');

      if (!response.ok) {
        throw new Error('No se pudieron cargar los usuarios.');
      }

      const users = await response.json();

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.isEnabled
      );

      if (!user || !password.trim()) {
        throw new Error('Email o contraseña incorrectos.');
      }

      // Datos temporales para adaptar el resultado al contexto de auth.
      const authResponse = {
        token: `demo-${user.id}`,
        user: {
          ...user,
          role: 'USER',
        },
      };

      login(authResponse);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'No se pudieron cargar los usuarios.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container">
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        <div className="ui-form-group">
          <label className="ui-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="ui-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="ui-form-group">
          <label className="ui-label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            className="ui-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button
          className="ui-btn ui-btn--primary ui-btn--md"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
