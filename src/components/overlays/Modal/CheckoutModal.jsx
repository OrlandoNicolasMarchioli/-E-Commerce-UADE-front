import Modal from './Modal';
import '../../ui.css';

// Formats a numeric price using Argentine peso locale and currency symbol
const formatPrice = (p) =>
  p.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

/** Purchase confirmation modal listing cart items and the computed total before committing the order. */
const CheckoutModal = ({ items = [], onConfirm, onCancel }) => {
  // Use server-provided subtotal when available; otherwise compute it client-side
  const total = items.reduce(
    (s, i) => s + (i.subtotal ?? i.unitPrice * i.quantity),
    0,
  );

  return (
    <Modal
      title="Confirm purchase"
      confirmLabel="Confirm"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p>Confirming will create your order and reduce the available stock.</p>
      <div className="ui-modal-preview">
        {items.map((item, i) => (
          <div key={i} className="ui-mp-row">
            <span>{item.productName} (×{item.quantity})</span>
            <span>{formatPrice(item.subtotal ?? item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="ui-mp-row ui-mp-row--total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
