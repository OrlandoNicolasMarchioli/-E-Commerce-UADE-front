import { beforeEach, describe, expect, it } from 'vitest';
import { persistStore } from 'redux-persist';
import { makeStore } from '../../store';
import { login, logout, selectAuthUser, selectIsAuthenticated } from '../../store/authSlice';
import { createMockToken } from '../../services/mockToken';
import { clearMockCache } from '../../services/api/mockClient';
import { stubDataFetch } from '../../test/mockDataFetch';

// Un F5 descarta todo lo que hay en memoria. Lo simulamos creando un store nuevo que
// solo tiene lo que quedó guardado en el navegador, como pasa al recargar la página.
const startApp = () => new Promise((resolve) => {
  const store = makeStore();
  const persistor = persistStore(store, null, () => resolve({ store, persistor }));
});

const savedAuth = () => {
  const raw = localStorage.getItem('persist:auth');
  if (!raw) return null;
  // redux-persist guarda cada clave del slice serializada por separado.
  return Object.fromEntries(Object.entries(JSON.parse(raw)).map(([key, value]) => [key, JSON.parse(value)]));
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  clearMockCache();
  stubDataFetch();
});

describe('persistencia de la sesión (authSlice)', () => {
  it('la sesión sobrevive a un F5', async () => {
    const first = await startApp();
    await first.store.dispatch(login({ email: 'nicolasmarchioli@uade.edu.ar', password: 'demo' })).unwrap();
    await first.persistor.flush();
    const token = first.store.getState().auth.token;

    const afterF5 = await startApp();
    expect(selectIsAuthenticated(afterF5.store.getState())).toBe(true);
    expect(selectAuthUser(afterF5.store.getState()).email).toBe('nicolasmarchioli@uade.edu.ar');
    expect(afterF5.store.getState().auth.token).toBe(token);
  });

  it('solo se guardan el token y el usuario: ni status, ni error, ni la contraseña', async () => {
    const app = await startApp();
    await app.store.dispatch(login({ email: 'nicolasmarchioli@uade.edu.ar', password: 'demo' })).unwrap();
    await app.persistor.flush();

    const saved = savedAuth();
    expect(Object.keys(saved).sort()).toEqual(['_persist', 'token', 'user']);
    expect(localStorage.getItem('persist:auth')).not.toContain('demo');
  });

  it('logout borra el token del navegador', async () => {
    const app = await startApp();
    await app.store.dispatch(login({ email: 'nicolasmarchioli@uade.edu.ar', password: 'demo' })).unwrap();
    await app.persistor.flush();
    app.store.dispatch(logout());
    await app.persistor.flush();

    expect(savedAuth()).toMatchObject({ token: null, user: null });
    const afterF5 = await startApp();
    expect(selectIsAuthenticated(afterF5.store.getState())).toBe(false);
  });

  it('si al recargar el token ya venció, se cierra la sesión y se limpia el storage', async () => {
    const user = { id: 1, email: 'nicolasmarchioli@uade.edu.ar' };
    const expired = createMockToken(user, Date.now() - 2 * 60 * 60 * 1000);
    localStorage.setItem('persist:auth', JSON.stringify({
      token: JSON.stringify(expired),
      user: JSON.stringify(user),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    }));

    const app = await startApp();
    await app.persistor.flush();

    expect(app.store.getState().auth).toMatchObject({ token: null, user: null });
    expect(savedAuth()).toMatchObject({ token: null, user: null });
  });
});
