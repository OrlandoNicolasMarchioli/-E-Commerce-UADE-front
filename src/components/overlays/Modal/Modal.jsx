import '../../ui.css';

/** Base modal dialog with a title, slot for content, and confirm/cancel actions; variant="danger" styles the confirm button red. */
const Modal = ({
  title,
  children,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  variant = 'default',
}) => (
  <div className="ui-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div className="ui-modal">
      <h3 id="modal-title">{title}</h3>
      {children}
      <div className="ui-modal-actions">
        <button className="ui-btn ui-btn--ghost ui-btn--md" style={{ flex: 1 }} onClick={onCancel}>
          Cancel
        </button>
        <button
          className={`ui-btn ui-btn--${variant === 'danger' ? 'danger' : 'primary'} ui-btn--md`}
          style={{ flex: 1 }}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
