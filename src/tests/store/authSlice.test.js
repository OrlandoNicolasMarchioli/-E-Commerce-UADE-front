import { beforeEach, describe, expect, it } from 'vitest';
import { makeStore } from '../../store';
import {
  login,
  logout,
  register,
  selectAuthToken,
  selectAuthUser,
  selectIsAuthenticated,
} from '../../store/authSlice';
import { createMockToken } from '../../services/mockToken';
import { clearMockCache } from '../../services/api/mockClient';
import { stubDataFetch } from '../../test/mockDataFetch';

beforeEach(() => {
  localStorage.clear();
  clearMockCache();
  stubDataFetch();
});

describe('authSlice', () => {
  it('arranca sin sesión', () => {
    const store = makeStore();
    expect(store.getState().auth).toMatchObject({ token: null, user: null, status: 'idle', error: null });
    expect(selectIsAuthenticated(store.getState())).toBe(false);
  });

  it('login exitoso guarda el token y el usuario, nunca la contraseña', async () => {
    const store = makeStore();
    await store.dispatch(login({ email: 'nicolasmarchioli@uade.edu.ar', password: 'demo' })).unwrap();
    const state = store.getState();
    expect(selectAuthUser(state).email).toBe('nicolasmarchioli@uade.edu.ar');
    expect(selectAuthToken(state)).toMatch(/^[\w-]+\.[\w-]+\.$/);
    expect(selectIsAuthenticated(state)).toBe(true);
    expect(state.auth.status).toBe('succeeded');
    expect(JSON.stringify(state.auth)).not.toContain('demo');
  });

  it('login fallido deja el error y no inicia sesión', async () => {
    const store = makeStore();
    await expect(store.dispatch(login({ email: 'nadie@uade.edu.ar', password: 'x' })).unwrap())
      .rejects.toMatchObject({ message: 'No hay un usuario de prueba con ese email' });
    expect(store.getState().auth.status).toBe('failed');
    expect(store.getState().auth.error).toBe('No hay un usuario de prueba con ese email');
    expect(selectIsAuthenticated(store.getState())).toBe(false);
  });

  it('el registro también deja la sesión iniciada', async () => {
    const store = makeStore();
    await store.dispatch(register({
      firstName: 'Ana', lastName: 'López', email: 'ana@uade.edu.ar', password: 'secreta', regNumber: '1234567',
    })).unwrap();
    expect(selectAuthUser(store.getState()).email).toBe('ana@uade.edu.ar');
    expect(selectIsAuthenticated(store.getState())).toBe(true);
  });

  it('logout vuelve al estado inicial', async () => {
    const store = makeStore();
    await store.dispatch(login({ email: 'nicolasmarchioli@uade.edu.ar', password: 'demo' })).unwrap();
    store.dispatch(logout());
    expect(store.getState().auth).toMatchObject({ token: null, user: null, status: 'idle', error: null });
  });

  it('con el token vencido la sesión no cuenta', () => {
    const user = { id: 1, email: 'nicolasmarchioli@uade.edu.ar' };
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    const store = makeStore({
      auth: { token: createMockToken(user, twoHoursAgo), user, status: 'succeeded', error: null },
    });
    expect(selectIsAuthenticated(store.getState())).toBe(false);
  });
});
