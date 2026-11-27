import { describe, expect, it } from 'vitest';
import {
  MOCK_TOKEN_TTL_MINUTES,
  createMockToken,
  isTokenExpired,
  readTokenPayload,
} from '../../services/mockToken';

const user = { id: 1, email: 'nicolasmarchioli@uade.edu.ar', role: 'ADMIN' };
const NOW = new Date(2026, 10, 27, 10, 0, 0).getTime();

describe('mockToken', () => {
  it('tiene forma de JWT sin firmar: header.payload. con alg none', () => {
    const token = createMockToken(user, NOW);
    const [header, payload, signature] = token.split('.');
    expect(header).toMatch(/^[\w-]+$/);
    expect(payload).toMatch(/^[\w-]+$/);
    expect(signature).toBe('');
    expect(JSON.parse(atob(header.replace(/-/g, '+').replace(/_/g, '/')))).toEqual({ alg: 'none', typ: 'JWT' });
  });

  it('el payload lleva el email en sub, el rol y el vencimiento', () => {
    const payload = readTokenPayload(createMockToken(user, NOW));
    expect(payload.sub).toBe(user.email);
    expect(payload.role).toBe('ADMIN');
    expect(payload.exp - payload.iat).toBe(MOCK_TOKEN_TTL_MINUTES * 60);
  });

  it('sin rol en el usuario, el token dice USER', () => {
    expect(readTokenPayload(createMockToken({ email: 'a@uade.edu.ar' }, NOW)).role).toBe('USER');
  });

  it('vence pasado el tiempo de vida y no antes', () => {
    const token = createMockToken(user, NOW);
    const ttl = MOCK_TOKEN_TTL_MINUTES * 60 * 1000;
    expect(isTokenExpired(token, NOW + ttl - 1000)).toBe(false);
    expect(isTokenExpired(token, NOW + ttl)).toBe(true);
  });

  it('un texto que no es JWT se trata como vencido', () => {
    expect(readTokenPayload('MOCK_ONLY_NO_JWT')).toBeNull();
    expect(isTokenExpired('MOCK_ONLY_NO_JWT')).toBe(true);
    expect(isTokenExpired('a.%%%.b')).toBe(true);
    expect(isTokenExpired(null)).toBe(true);
  });
});
