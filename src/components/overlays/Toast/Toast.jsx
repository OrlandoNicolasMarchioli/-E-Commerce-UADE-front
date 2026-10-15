import { useEffect } from 'react';
import '../../ui.css';

const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

const Toast = ({
  id,
  variant = 'success',
  title,
  description,
  actions = [],
  duration = 4000,
  onDismiss,
}) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onDismiss?.(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div className={`ui-toast ui-toast--${variant}`} role="alert" aria-live="polite">
      <div className="ui-toast-icon">{ICONS[variant]}</div>
      <div style={{ flex: 1 }}>
        <div className="ui-toast-title">{title}</div>
        {description && <div className="ui-toast-sub">{description}</div>}
        {actions.length > 0 && (
          <div className="ui-toast-actions">
            {actions.map((a, i) => (
              <button key={i} className="ui-toast-act" onClick={a.onClick}>{a.label}</button>
            ))}
          </div>
        )}
      </div>
      <button className="ui-toast-close" onClick={() => onDismiss?.(id)} aria-label="Dismiss">✕</button>
    </div>
  );
};

export default Toast;
