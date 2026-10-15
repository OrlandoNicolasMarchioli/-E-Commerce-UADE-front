import '../../ui.css';

const TRANSITIONS = {
  PENDING: { next: 'PAID',      label: 'Mark as paid',      from: 'PENDING',   to: 'PAID' },
  PAID:    { next: 'SHIPPED',   label: 'Mark as shipped',   from: 'PAID',      to: 'SHIPPED' },
  SHIPPED: { next: 'DELIVERED', label: 'Mark as delivered', from: 'SHIPPED',   to: 'DELIVERED' },
};

const OrderStatusAction = ({ orderId, currentStatus, onAdvance }) => {
  const transition = TRANSITIONS[currentStatus];

  if (!transition) {
    return (
      <div className="ui-order-action">
        <button className="ui-btn ui-btn--ghost ui-btn--sm ui-btn--disabled" disabled>
          Final state
        </button>
      </div>
    );
  }

  return (
    <div className="ui-order-action">
      <div className="ui-oa-info">
        <span className="ui-oa-from">{transition.from}</span>
        <span className="ui-oa-to">→ {transition.to}</span>
      </div>
      <button
        className="ui-btn ui-btn--primary ui-btn--sm"
        onClick={() => onAdvance?.(orderId, transition.next)}
      >
        {transition.label}
      </button>
    </div>
  );
};

export default OrderStatusAction;
