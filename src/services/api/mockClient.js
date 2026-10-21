import { ApiError } from './client';

// Los JSON viven en /public/data/ y Vite los sirve desde la raíz del sitio.

const DATA_URL = `${import.meta.env.BASE_URL}data`;

// Cache de promesas: cada archivo se descarga una sola vez por sesión,
// aunque varios componentes lo pidan a la vez.
const cache = new Map();

/**
 * @param {string} name // Nombre del archivo sin extensión (ej. 'products').
 * @returns {Promise<any>}
 * @throws {ApiError} // Si el archivo no existe o no se puede leer.
 */
export function getJson(name) {
  if (!cache.has(name)) {
    const request = fetch(`${DATA_URL}/${name}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new ApiError(response.status, `No se pudo cargar ${name}.json`);
        }
        return response.json();
      })
      .catch((error) => {
        // Si falló, se limpia la cache para poder reintentar.
        cache.delete(name);
        throw error;
      });
    cache.set(name, request);
  }
  return cache.get(name);
}

/** Vacía la cache (útil en tests o para forzar una recarga). */
export function clearMockCache() {
  cache.clear();
}
