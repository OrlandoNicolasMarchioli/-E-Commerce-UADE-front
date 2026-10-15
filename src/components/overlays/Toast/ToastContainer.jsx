import { useState, useCallback } from 'react';
import Toast from './Toast';
import '../../ui.css';

// Module-level counter so each toast gets a unique id across renders
let toastId = 0;

/** Custom hook that manages the toast list and exposes show/dismiss helpers to any component. */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const show = useCallback(({ variant = 'success', title, description, actions, duration }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, variant, title, description, actions, duration }]);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, show, dismiss };
};

/** Fixed-position container that stacks active Toast components; pair with useToast for state management. */
const ToastContainer = ({ toasts = [], onDismiss }) => (
  <div className="ui-toast-container" aria-live="polite" aria-atomic="false">
    {toasts.map((t) => (
      <Toast key={t.id} {...t} onDismiss={onDismiss} />
    ))}
  </div>
);

export default ToastContainer;
