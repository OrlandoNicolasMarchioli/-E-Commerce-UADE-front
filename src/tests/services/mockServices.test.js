import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubDataFetch } from '../../test/mockDataFetch';
import { loginRequest, registerRequest } from '../../services/authService';
import { addCartItem } from '../../services/cartService';
import { createOrder } from '../../services/orderService';
import { getJson } from '../../services/api/mockClient';

// 21/10/2026 20:30 en hora local: el back guarda LocalDateTime.now(), sin zona.
const NOW = new Date(2026, 9, 21, 20, 30, 0);

beforeEach(() => {
  stubDataFetch();
  localStorage.clear();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('authService (respuestas con forma de AuthResponseDTO)', () => {
  it('el login devuelve el usuario con su rol: el usuario 1 es ADMIN', async () => {
    const auth = await loginRequest('nicolasmarchioli@uade.edu.ar', 'demo');
    expect(Object.keys(auth).sort()).toEqual(['token', 'user']);
    expect(auth.user.role).toBe('ADMIN');
  });

  it('el registro arma un UserResponseDTO completo, con rol USER y fecha en hora local', async () => {
    const { user } = await registerRequest({
      firstName: 'Ada', lastName: 'Lovelace', email: 'ada@test.com', password: 'demo', regNumber: 'L1',
    });
    expect(Object.keys(user).sort()).toEqual(['email', 'firstName', 'id', 'isEnabled', 'lastName', 'regNumber', 'registrationDate', 'role']);
    expect(user.role).toBe('USER');
    expect(user.registrationDate).toBe('2026-10-21T20:30:00');
  });
});

describe('orderService (respuestas con forma de OrderResponseDTO)', () => {
  it('el pedido nuevo usa la hora local y un id que no repite los de orders.json', async () => {
    await addCartItem(3, 5, 1);
    const order = await createOrder(3);
    const seedIds = (await getJson('orders')).map((o) => o.id);
    expect(order.status).toBe('PENDING');
    expect(order.orderDate).toBe('2026-10-21T20:30:00');
    expect(seedIds).not.toContain(order.id);
  });
});
