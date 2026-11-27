import { describe, expect, it } from 'vitest';
import { buildContentSecurityPolicy, cspPlugin } from '../../../vite.csp.js';

const directives = (policy) => Object.fromEntries(
  policy.split(';').map((part) => part.trim().split(/\s+/)).map(([name, ...values]) => [name, values]),
);

describe('Content Security Policy del build', () => {
  const csp = directives(buildContentSecurityPolicy());

  it('solo permite scripts del propio sitio: nada inline, nada de eval', () => {
    expect(csp['script-src']).toEqual(["'self'"]);
    expect(buildContentSecurityPolicy()).not.toContain('unsafe-inline');
    expect(buildContentSecurityPolicy()).not.toContain('unsafe-eval');
  });

  it('limita a dónde se puede mandar información (connect-src)', () => {
    expect(csp['connect-src']).toEqual(["'self'", 'http://localhost:8080']);
    const custom = directives(buildContentSecurityPolicy({ apiOrigin: 'https://api.uade-shop.com' }));
    expect(custom['connect-src']).toEqual(["'self'", 'https://api.uade-shop.com']);
  });

  it('bloquea plugins y cambios de base o destino de formularios', () => {
    expect(csp['object-src']).toEqual(["'none'"]);
    expect(csp['base-uri']).toEqual(["'self'"]);
    expect(csp['form-action']).toEqual(["'self'"]);
  });

  it('el plugin se aplica solo al build y agrega el <meta> al principio del <head>', () => {
    const plugin = cspPlugin();
    expect(plugin.apply).toBe('build');
    const [tag] = plugin.transformIndexHtml();
    expect(tag).toMatchObject({ tag: 'meta', injectTo: 'head-prepend' });
    expect(tag.attrs['http-equiv']).toBe('Content-Security-Policy');
    expect(tag.attrs.content).toBe(buildContentSecurityPolicy());
  });
});
