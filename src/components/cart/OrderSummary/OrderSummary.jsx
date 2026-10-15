import '../../ui.css';

const formatPrice = (p) =>
  p.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

const OrderSummary = ({ items = [], onCheckout, onContinue }) => {
  const total = items.reduce(
    (acc, item) => acc + (item.subtotal ?? item.unitPrice * item.quantity),
    0,
  );

  return (
    <div className="ui-order-summary">
      <div className="ui-os-title">Order summary</div>
      {items.map((item, i) => (
        <div key={i} className="ui-os-row">
          <span>{item.productName} (×{item.quantity})</span>
          <span>{formatPrice(item.subtotal ?? item.unitPrice * item.quantity)}</span>
        </div>
      ))}
      <div className="ui-os-total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <button className="ui-btn ui-btn--primary ui-btn--lg ui-btn--full" onClick={onCheckout}>
        Confirm purchase
      </button>
      <button className="ui-btn ui-btn--outline ui-btn--md ui-btn--full ui-mt-2" onClick={onContinue}>
        Continue shopping
      </button>
      <div className="ui-os-secure">🔒 Secure payment</div>
    </div>
  );
};

export default OrderSummary;
