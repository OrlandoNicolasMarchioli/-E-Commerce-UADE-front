import { useState } from 'react';
import '../../ui.css';

const AuthCard = ({ onLogin, onRegister }) => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'login') {
      if (!form.email || !form.password) { setError('All fields are required.'); return; }
      onLogin?.(form);
    } else {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) { setError('All fields are required.'); return; }
      if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
      onRegister?.(form);
    }
  };

  return (
    <div className="ui-auth-card">
      <div className="ui-auth-tabs">
        <button className={`ui-auth-tab${tab === 'login' ? ' ui-auth-tab--active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
        <button className={`ui-auth-tab${tab === 'register' ? ' ui-auth-tab--active' : ''}`} onClick={() => setTab('register')}>Create Account</button>
      </div>

      {error && <div className="ui-auth-error">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tab === 'register' && (
          <div className="ui-form-group">
            <label className="ui-label">Full name</label>
            <input className="ui-input" type="text" placeholder="John Doe" value={form.name} onChange={set('name')} />
          </div>
        )}
        <div className="ui-form-group">
          <label className="ui-label">Email</label>
          <input className="ui-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
        </div>
        <div className="ui-form-group">
          <label className="ui-label">Password</label>
          <input className="ui-input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
        </div>
        {tab === 'register' && (
          <div className="ui-form-group">
            <label className="ui-label">Confirm password</label>
            <input className="ui-input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} />
          </div>
        )}
        <button type="submit" className="ui-btn ui-btn--primary ui-btn--md ui-btn--full" style={{ marginTop: 4 }}>
          {tab === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default AuthCard;
