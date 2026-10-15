import '../../ui.css';

// Ordered list of non-cancelled statuses; index drives the progress bar width
const STEPS = [
  { key: 'PENDING',   label: 'Ordered',   icon: '📋' },
  { key: 'PAID',      label: 'Paid',      icon: '💳' },
  { key: 'SHIPPED',   label: 'Shipped',   icon: '📦' },
  { key: 'DELIVERED', label: 'Delivered', icon: '🏠' },
];

const STATUS_INDEX = { PENDING: 0, PAID: 1, SHIPPED: 2, DELIVERED: 3 };

/** Horizontal step-by-step timeline tracking order progress; renders a cancellation notice for CANCELLED orders. */
const OrderTimeline = ({ status }) => {
  // CANCELLED is not part of the normal flow, so it is handled separately
  if (status === 'CANCELLED') {
    return (
      <div className="ui-timeline">
        <span style={{ color: 'var(--color-error)', fontWeight: 700 }}>❌ Order cancelled</span>
      </div>
    );
  }

  const current     = STATUS_INDEX[status] ?? 0;
  // Express progress as a percentage of the total step span for the CSS bar width
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
