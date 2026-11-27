# 05 – Persistencia de la sesión y de preferencias (TPG)

Se eligió la **opción intermedia: redux-persist**. La sesión (token y usuario) vive en el `authSlice` y se guarda en localStorage, así que un F5 no la cierra. El riesgo que deja esta opción es XSS, y se mitiga con una Content Security Policy, reglas de lint, un token de vida corta y guardando solo lo mínimo.

## 1. Qué se guarda y dónde

| Dato | Slice | Storage | Clave | ¿Sensible? | Motivo |
|---|---|---|---|---|---|
| Token y usuario | `auth` | localStorage | `persist:auth` | Sí, el token | Que un F5 no cierre la sesión |
| Tema claro u oscuro | `preferences` | localStorage | `persist:preferences` | No | Es una preferencia: tiene que durar entre visitas |
| Última búsqueda | `search` | sessionStorage | `persist:search` | No | Solo sirve durante la visita: se borra al cerrar la pestaña |
| Favoritos | `favorites` | localStorage | `uade_mock_favorites` | No | Ya existía (lista de deseos); se guarda a mano |

Nunca se guardan la contraseña ni el `status` y el `error` del login. El `whitelist` de redux-persist deja pasar solo `token` y `user`.

## 2. Opciones analizadas

| | Fácil: localStorage a mano | Intermedio: redux-persist | Avanzado: cookie HttpOnly |
|---|---|---|---|
| Cómo funciona | `setItem` en el login y `getItem` al iniciar | `persistReducer` por slice, `persistStore` y `PersistGate` guardan y recuperan el estado solos | El back manda el token en una cookie `HttpOnly`; JavaScript no la puede leer |
| ¿Sobrevive al F5? | Sí | Sí | Sí, pero el front necesita `/api/auth/me` para volver a cargar el usuario |
| Ataque principal | XSS: un script inyectado lee el token | XSS: redux-persist usa localStorage por debajo y no cifra | CSRF: el navegador manda la cookie solo, aunque la petición venga de otro sitio |
| Cambios en el back | No | No | Sí: cookie en el login, filtro JWT que lea la cookie, CORS con credenciales, CSRF, logout y `/me` |
| Control de qué se guarda | Manual, clave por clave | `whitelist` y `blacklist` por slice, y storage distinto por slice | Lo decide el back |

## 3. Fundamentación de la elección

- **El TPO ya usa Redux Toolkit.** redux-persist se integra con `persistReducer` por slice. Permite elegir qué campos se guardan y en qué storage: la sesión y el tema en localStorage, la búsqueda en sessionStorage.
- **La rehidratación es ordenada.** `PersistGate` espera a recuperar la sesión antes de pintar. Sin eso, después de un F5 una ruta protegida mandaría al login por un instante.
- **La opción avanzada no entra en esta entrega.** El front todavía funciona con los datos de prueba de `public/data` y no consume el back. Pasar a cookies exige cambios coordinados en el back y en la integración (CSRF, CORS con credenciales, `/me`).
- **La migración queda preparada.** Las páginas usan `useAuth()` y no saben dónde vive el token. Pasar a cookies cambia el `authSlice` y el cliente HTTP, no las pantallas.

## 4. Ataques y cómo se mitigan

### XSS (opciones fácil e intermedia)

Si alguien logra ejecutar JavaScript en la página, por ejemplo con una reseña que lleve un `<script>` o un `onerror`, ese código puede leer `localStorage.getItem('persist:auth')` y mandar el token a otro servidor.

Lo implementado en esta entrega:

1. **Content Security Policy en el build** (`vite.csp.js`). Hay tres reglas clave:
   - `script-src 'self'`: sin scripts inline ni `eval`.
   - `connect-src`: solo el propio sitio y la API.
   - `object-src 'none'`.

   Aunque se inyecte HTML, el script no corre y tampoco podría mandar datos afuera. Se probó en el navegador: un `<script>` agregado a la página no se ejecuta. En desarrollo no se aplica, porque Vite usa scripts inline para recargar en caliente.
2. **React escapa todo lo que se muestra con `{}`.** El lint (`.oxlintrc.json`) marca como error `dangerouslySetInnerHTML`, las URLs `javascript:`, `eval`, `new Function` y los `target="_blank"` sin `rel`.
3. **Token de vida corta con vencimiento.** El token de prueba tiene forma de JWT y vence a los 60 minutos (`exp`). Al recargar, si venció, la sesión se cierra y se limpia el storage. Además, `selectIsAuthenticated` no toma como válido un token vencido.
4. **Solo lo mínimo.** Se guardan el token y el usuario; nunca la contraseña.
5. **Logout limpia el storage.** El estado vuelve al inicial y redux-persist guarda `token: null`.

Recomendado para producción (no implementado acá):

- Mandar la CSP como header HTTP desde el servidor. Eso permite además `frame-ancestors` y reportes, y conviene servir todo por HTTPS.
- Bajar el vencimiento del JWT del back: hoy es de 24 horas.
- Sanitizar en el back los textos que cargan los usuarios y revisar dependencias con `npm audit`.

### CSRF (opción avanzada)

Con la sesión en una cookie, otro sitio puede hacer que el navegador de la víctima mande una petición al back, y el navegador adjunta la cookie solo.

La opción elegida no tiene este problema: el token viaja en el header `Authorization: Bearer`, que el navegador no agrega por su cuenta, y otro sitio no lo puede leer por la política de mismo origen.

Si se pasa a cookies, se mitigaría así:

- Cookie con `HttpOnly`, `Secure`, `SameSite=Strict` (o `Lax`) y `Path=/api`.
- Token anti-CSRF del tipo *double submit*: `CookieCsrfTokenRepository` de Spring Security y el header `X-XSRF-TOKEN` en cada POST, PUT y DELETE.
- CORS con el origen exacto del front y `allowCredentials`. Nunca `*`.
- Ninguna operación que cambie datos por GET, y verificar `Origin` o `Referer`.

## 5. Cómo probarlo

1. `npm install` y `npm run dev`. Iniciar sesión con `nicolasmarchioli@uade.edu.ar` y cualquier contraseña.
2. Entrar a **Mis compras** y apretar F5: la sesión sigue.
3. En DevTools, pestaña Application:
   - Local Storage tiene `persist:auth` (solo `token` y `user`) y `persist:preferences`.
   - Session Storage tiene `persist:search`.
4. Cambiar el tema con el botón ☾/☀ de la navbar y recargar: se mantiene, incluso cerrando el navegador.
5. Buscar "notebook" y recargar: el buscador lo conserva. En una pestaña nueva aparece vacío.
6. **Salir**: `persist:auth` queda con `token: null`.
7. Para la CSP: `npm run build` y `npm run preview`. En la consola correr `document.body.append(Object.assign(document.createElement('script'), { textContent: 'alert(1)' }))`: el navegador lo bloquea.
8. `npm run test`: 332 tests. Los de esta parte son:
   - `src/tests/store/authSlice.test.js`
   - `src/tests/store/persistence.test.js`, que simula el F5 con un store nuevo que solo tiene lo guardado
   - `src/tests/store/preferencesSlice.test.js`
   - `src/tests/services/mockToken.test.js`
   - `src/tests/security/csp.test.js`

## 6. Archivos

- `src/store/authSlice.js`, `preferencesSlice.js`, `searchSlice.js` y `index.js` (configuración de redux-persist y cierre de la sesión si el token venció).
- `src/services/mockToken.js`: token de prueba con forma de JWT, sin firmar.
- `src/context/AuthContext.jsx`: `useAuth()` sobre Redux.
- `src/main.jsx`: `persistStore` y `PersistGate`.
- `src/theme/tokens.css`: tema oscuro.
- `vite.csp.js`, `vite.config.js` y `.oxlintrc.json`.
