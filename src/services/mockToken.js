// Token de la sesión demostrativa con la misma forma que un JWT (header.payload.firma).
// No está firmado ("alg": "none"), así que ningún backend lo aceptaría: sirve para que el
// front maneje el token igual que va a manejar el JWT real del back, incluido el vencimiento.

// Vida corta a propósito: si alguien llegara a robar el token, le sirve por poco tiempo.
export const MOCK_TOKEN_TTL_MINUTES = 60;

const toBase64Url = (value) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const fromBase64Url = (segment) => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
};

export function createMockToken(user, now = Date.now()) {
  const issuedAt = Math.floor(now / 1000);
  const header = { alg: 'none', typ: 'JWT' };
  // Mismos datos que pone el back en el JWT (sub = email), más lo mínimo para la demo.
  const payload = {
    sub: user.email,
    role: user.role ?? 'USER',
    iat: issuedAt,
    exp: issuedAt + MOCK_TOKEN_TTL_MINUTES * 60,
  };
  return `${toBase64Url(header)}.${toBase64Url(payload)}.`;
}

// Lee el payload sin validar la firma: eso lo hace siempre el back.
// Devuelve null si el texto no tiene forma de JWT.
export function readTokenPayload(token) {
  if (typeof token !== 'string') return null;
  const [, payload] = token.split('.');
  if (!payload) return null;
  try {
    return fromBase64Url(payload);
  } catch {
    return null;
  }
}

// Un token ilegible o sin fecha de vencimiento se trata como vencido.
export function isTokenExpired(token, now = Date.now()) {
  const payload = readTokenPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  return payload.exp * 1000 <= now;
}
