import { useLocation, useParams } from 'react-router-dom';

/**
 * Página provisoria: muestra la ruta y quién la desarrolla.
 * Cada responsable reemplaza el contenido de su página por la pantalla real.
 */
const PagePlaceholder = ({ title, owner }) => {
  const { pathname, search } = useLocation();
  const params = useParams();
  const paramText = Object.entries(params).filter(([key]) => key !== '*').map(([k, v]) => `${k}=${v}`).join(', ');

  return (
    <div className="app-container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
      <h1 style={{ color: 'var(--color-brand-primary)', marginBottom: 'var(--space-2)' }}>{title}</h1>
      <p style={{ color: 'var(--color-neutral-600)' }}>
        Ruta: <code>{pathname + search}</code>
        {paramText && <> · Parámetros: <code>{paramText}</code></>}
      </p>
      {owner && <p style={{ color: 'var(--color-neutral-600)' }}>Pantalla pendiente · {owner}</p>}
    </div>
  );
};

export default PagePlaceholder;
