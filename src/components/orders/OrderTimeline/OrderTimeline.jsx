import '../../ui.css';

const STEPS = [
  { key: 'PENDING',   label: 'Ordered',   icon: '📋' },
  { key: 'PAID',      label: 'Paid',      icon: '💳' },
  { key: 'SHIPPED',   label: 'Shipped',   icon: '📦' },
  { key: 'DELIVERED', label: 'Delivered', icon: '🏠' },
];

const STATUS_INDEX = { PENDING: 0, PAID: 1, SHIPPED: 2, DELIVERED: 3 };

const OrderTimeline = ({ status }) => {
  if (status === 'CANCELLED') {
    return (
      <div className="ui-timeline">
        <span style={{ color: 'var(--color-error)', fontWeight: 700 }}>❌ Order cancelled</span>
      </div>
    );
  }

  const current     = STATUS_INDEX[status] ?? 0;
  const progressPct = (current / (STEPS.length - 1)) * 100;

  return (
    <div className="ui-timeline">
      <div className="ui-tl-progress" style={{ width: `${progressPct}%` }} />
      {STEPS.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'pending';
        return (
          <div key={step.key} className="ui-tl-step">
            <div className={`ui-tl-dot ui-tl-dot--${state}`}>
              {state === 'done' ? '✓' : step.icon}
            </div>
            <div className={`ui-tl-label ui-tl-label--${state}`}>{step.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
