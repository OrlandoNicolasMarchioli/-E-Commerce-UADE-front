import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const initial = { firstName: '', lastName: '', email: '', regNumber: '', password: '', confirm: '' };

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;
  const update = (field) => (e) => setForm((old) => ({ ...old, [field]: e.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Usamos las mismas claves que RegisterRequestDTO (sin confirm).
      const { firstName, lastName, email, regNumber, password } = form;
      await register({ firstName: firstName.trim(), lastName: lastName.trim(),
        email: email.trim(), regNumber: regNumber.trim(), password });
      navigate('/', { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    ['firstName', 'Nombre', 'text', 'given-name'],
    ['lastName', 'Apellido', 'text', 'family-name'],
    ['email', 'Email', 'email', 'email'],
    ['regNumber', 'Legajo', 'text', 'off'],
    ['password', 'Contraseña', 'password', 'new-password'],
    ['confirm', 'Confirmar contraseña', 'password', 'new-password'],
  ];

  return (
    <div className="p2-auth">
      <div className="ui-auth-card">
        <p className="p2-demo-note">Modo demostración: datos de /public/data/, sin autenticación real.</p>
        <h1>Registro</h1>
        <form onSubmit={submit} className="p2-form">
          {fields.map(([key, label, type, autoComplete]) => (
            <div key={key} className="p2-field">
              <label htmlFor={`register-${key}`}>{label}</label>
              <input id={`register-${key}`} className="ui-input" type={type}
                autoComplete={autoComplete} required value={form[key]} onChange={update(key)} />
            </div>
          ))}
          {error && <p role="alert" className="ui-auth-error">{error}</p>}
          <button className="ui-btn ui-btn--primary ui-btn--md" disabled={loading} type="submit">
            {loading ? 'Registrando…' : 'Crear cuenta'}
          </button>
        </form>
        <p>¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;