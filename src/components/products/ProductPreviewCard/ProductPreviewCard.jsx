import '../../ui.css';

const ProductPreviewCard = ({ name, category, price, stock, description, imageUrl }) => (
  <div className="ui-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ width: 80, height: 80, background: 'var(--color-neutral-100)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
        {imageUrl ? <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📷'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-500)', marginBottom: 4 }}>{category}</div>
        <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-neutral-900)', marginBottom: 6 }}>{name || 'Product name'}</div>
        <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-brand-primary)' }}>
          ${price ? Number(price).toFixed(2) : '0.00'}
        </div>
      </div>
    </div>
    {description && (
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-600)', lineHeight: 1.5 }}>{description}</p>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)' }}>
      <span>Stock: {stock ?? '—'}</span>
      <span className={`ui-badge ui-badge--${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>{stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
    </div>
  </div>
);

export default ProductPreviewCard;
