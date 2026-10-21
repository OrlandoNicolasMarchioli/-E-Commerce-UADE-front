import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { vi } from 'vitest';
import { clearMockCache } from '../services/api/mockClient';

/**
 * Reemplaza fetch por una versión que sirve los archivos reales de /public/data/
 * y vacía la cache del servicio. Devuelve el mock para poder hacer asserts.
 */
export function stubDataFetch() {
  clearMockCache();
  const fetchMock = vi.fn(async (url) => {
    const file = resolve(process.cwd(), 'public', String(url).replace(/^\//, ''));
    if (!existsSync(file)) return { ok: false, status: 404, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => JSON.parse(readFileSync(file, 'utf-8')) };
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
