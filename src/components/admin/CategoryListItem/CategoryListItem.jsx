import '../../ui.css';

/** Admin list row for a single category showing its icon, name, product count, and edit/delete actions. */
const CategoryListItem = ({ category, onEdit, onDelete }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--color-neutral-0)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
    <div style={{ width: 40, height: 40, background: 'var(--color-brand-primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
      {category.icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-neutral-900)' }}>{category.name}</div>
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)' }}>{category.productCount} products</div>
    </div>
    <div className="ui-tr-actions">
      <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={() => onEdit?.(category)}>Edit</button>
      <button className="ui-btn ui-btn--danger ui-btn--sm" onClick={() => onDelete?.(category)}>Delete</button>
    </div>
  </div>
);

export default CategoryListItem;
