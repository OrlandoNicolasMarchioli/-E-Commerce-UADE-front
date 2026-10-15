import '../../ui.css';

// Maps each order status string to its display variant and label.
// Falls back to a generic badge with the raw status string for unknown values.
const STATUS_MAP = {
  PENDING:   { variant: 'pending',   label: 'PENDING' },
  PAID:      { variant: 'paid',      label: 'PAID' },
  SHIPPED:   { variant: 'shipped',   label: 'SHIPPED' },
  DELIVERED: { variant: 'delivered', label: 'DELIVERED' },
  CANCELLED: { variant: 'cancelled', label: 'CANCELLED' },
};

/** Displays the current order status as a colored badge. */
const OrderStatusBadge = ({ status }) => {
  const { variant, label } = STATUS_MAP[status] ?? { variant: 'cat', label: status };
  return <span className={`ui-badge ui-badge--${variant}`}>{label}</span>;
};

export default OrderStatusBadge;
