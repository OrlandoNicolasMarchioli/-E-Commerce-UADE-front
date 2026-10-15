import { useState } from 'react';
import '../../ui.css';

// Default blank values; merged with initialValues so the form works for both create and edit flows
const INITIAL = { name: '', icon: '', description: '' };

/** Form panel for creating or editing a category; pre-fills fields from initialValues when editing. */
const CategoryFormPanel = ({ initialValues, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ ...INITIAL, ...initialValues });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <div className="ui-card" style={{ padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12 }}>
          <div className="ui-form-group">
            <label className="ui-label">Category name</label>
            <input className="ui-input" type="text" placeholder="e.g. Electronics" value={form.name} onChange={set('name')} required />
          </div>
          <div className="ui-form-group">
            <label className="ui-label">Icon</label>
            <input className="ui-input" type="text" placeholder="📦" value={form.icon} onChange={set('icon')} maxLength={4} style={{ textAlign: 'center', fontSize: '1.4rem' }} />
          </div>
        </div>
        <div className="ui-form-group">
          <label className="ui-label">Description</label>
          <textarea className="ui-textarea" rows={2} placeholder="Short description…" value={form.description} onChange={set('description')} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {onCancel && <button type="button" className="ui-btn ui-btn--outline ui-btn--md" onClick={onCancel}>Cancel</button>}
          <button type="submit" className="ui-btn ui-btn--primary ui-btn--md">Save category</button>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormPanel;
