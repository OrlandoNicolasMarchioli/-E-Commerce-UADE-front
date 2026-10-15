import { useState } from 'react';
import ImageUploadArea from '../ImageUploadArea/ImageUploadArea';
import '../../ui.css';

const INITIAL = { name: '', category: '', price: '', stock: '', description: '' };

const ProductFormCard = ({ initialValues, categories = [], onSubmit, onCancel }) => {
  const [form, setForm] = useState({ ...INITIAL, ...initialValues });
  const [images, setImages] = useState([]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ ...form, images });
  };

  return (
    <form className="ui-card" onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="ui-form-group">
        <label className="ui-label">Product name</label>
        <input className="ui-input" type="text" placeholder="e.g. Wireless Headphones" value={form.name} onChange={set('name')} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="ui-form-group">
          <label className="ui-label">Category</label>
          <select className="ui-select" value={form.category} onChange={set('category')} required>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="ui-form-group">
          <label className="ui-label">Price ($)</label>
          <input className="ui-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={set('price')} required />
        </div>
      </div>

      <div className="ui-form-group">
        <label className="ui-label">Stock</label>
        <input className="ui-input" type="number" min="0" placeholder="0" value={form.stock} onChange={set('stock')} required />
      </div>

      <div className="ui-form-group">
        <label className="ui-label">Description</label>
        <textarea className="ui-textarea" rows={3} placeholder="Describe the product…" value={form.description} onChange={set('description')} />
      </div>

      <div className="ui-form-group">
        <label className="ui-label">Images</label>
        <ImageUploadArea
          images={images}
          onAdd={(img) => setImages((prev) => [...prev, img])}
          onRemove={(i) => setImages((prev) => prev.filter((_, idx) => idx !== i))}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        {onCancel && <button type="button" className="ui-btn ui-btn--outline ui-btn--md" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="ui-btn ui-btn--primary ui-btn--md">Save product</button>
      </div>
    </form>
  );
};

export default ProductFormCard;
