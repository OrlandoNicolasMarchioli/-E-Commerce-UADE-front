// Content Security Policy del build de producción.
//
// Es la principal defensa contra XSS en el front: aunque alguien lograra meter HTML en la
// página, el navegador no ejecuta scripts inline ni de otros dominios, así que no podría
// leer el token guardado en localStorage ni mandarlo afuera (connect-src limita a dónde
// se puede hacer fetch).
//
// Se inyecta como <meta> solo en el build: en desarrollo Vite usa scripts inline para
// recargar en caliente y la política los bloquearía. En producción conviene mandarla
// también como header HTTP desde el servidor, que además permite frame-ancestors.

export function buildContentSecurityPolicy({ apiOrigin = 'http://localhost:8080' } = {}) {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    // data: para la vista previa de las imágenes que se suben; placehold.co para los datos de prueba.
    "img-src 'self' data: blob: https://placehold.co",
    "font-src 'self'",
    `connect-src 'self' ${apiOrigin}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

export function cspPlugin(options) {
  return {
    name: 'uade-content-security-policy',
    apply: 'build',
    transformIndexHtml() {
      return [{
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: buildContentSecurityPolicy(options) },
        injectTo: 'head-prepend',
      }];
    },
  };
}
