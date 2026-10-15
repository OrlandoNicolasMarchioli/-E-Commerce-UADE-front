import '../../ui.css';

/** Animated success confirmation screen shown after a completed order; optionally displays the new order ID. */
const SuccessCircle = ({ orderId }) => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <div className="ui-success-circle" style={{ margin: '0 auto 16px' }}>✓</div>
    <div style={{
      fontSize: 'var(--font-size-2xl)',
      fontWeight: 'var(--font-weight-bold)',
      color: 'var(--color-success)',
      marginBottom: 6,
    }}>
      Order confirmed!
    </div>
    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-600)' }}>
      Your purchase has been registered successfully.
    </div>
    {orderId && (
      <div style={{ marginTop: 12 }}>
        <span style={{
          background: 'var(--color-brand-primary)',
          color: '#fff',
          padding: '8px 24px',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-bold)',
        }}>
          Order #{orderId}
        </span>
      </div>
    )}
  </div>
);

export default SuccessCircle;
