const BASE_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'auth_token';

// Structured error thrown on any non-2xx response.
// Callers can check error.status to distinguish 401/403/404/500 etc.
export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data; // parsed JSON body from the server, if any
  }
}

// Token helpers — token is stored in localStorage so it survives page reloads
export const getToken  = ()      => localStorage.getItem(TOKEN_KEY);
export const setToken  = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = ()     => localStorage.removeItem(TOKEN_KEY);

/**
 * Core fetch wrapper.
 *
 * @param {string} method   HTTP verb
 * @param {string} path     API path (e.g. '/products')
 * @param {object} options
 * @param {object} [options.body]   Request payload — serialised to JSON
 * @param {object} [options.params] Query-string parameters — appended to URL
 * @param {boolean} [options.auth=true] Whether to attach the Bearer token
 * @returns {Promise<any>} Parsed JSON response, or null for 204 No Content
 * @throws {ApiError}
 */
async function request(method, path, { body, params, auth = true } = {}) {
  const url = new URL(`${BASE_URL}${path}`);

  // Append query params, skipping null/undefined values
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, value);
    });
  }

  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    // Only include a body for methods that allow one
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // Try to extract the server's error message from the JSON body
    let errorData = null;
    try { errorData = await response.json(); } catch { /* body is not JSON */ }
    throw new ApiError(
      response.status,
      errorData?.message ?? `HTTP error ${response.status}`,
      errorData,
    );
  }

  // 204 No Content — nothing to parse
  if (response.status === 204) return null;

  return response.json();
}

/** Thin wrappers around request() for each HTTP verb. */
export const http = {
  get:    (path, options)        => request('GET',    path, options),
  post:   (path, body, options)  => request('POST',   path, { ...options, body }),
  put:    (path, body, options)  => request('PUT',    path, { ...options, body }),
  patch:  (path, body, options)  => request('PATCH',  path, { ...options, body }),
  delete: (path, options)        => request('DELETE', path, options),
};
