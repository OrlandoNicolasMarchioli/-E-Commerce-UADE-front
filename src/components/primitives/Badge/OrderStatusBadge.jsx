import '../../ui.css';

const STATUS_MAP = {
  PENDING:   { variant: 'pending',   label: 'PENDING' },
  PAID:      { variant: 'paid',      label: 'PAID' },
  SHIPPED:   { variant: 'shipped',   label: 'SHIPPED' },
  DELIVERED: { variant: 'delivered', label: 'DELIVERED' },
  CANCELLED: { variant: 'cancelled', label: 'CANCELLED' },
};

const OrderStatusBadge = ({ status }) => {
  const { variant, label } = STATUS_MAP[status] ?? { variant: 'cat', label: status };
  return <span className={`ui-badge ui-badge--${variant}`}>{label}</span>;
};

export default OrderStatusBadge;
