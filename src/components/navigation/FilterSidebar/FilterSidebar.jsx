import { useState } from 'react';
import '../../ui.css';

/** Product filter sidebar supporting controlled (externalFilters prop) and uncontrolled modes. */
const FilterSidebar = ({ filters: externalFilters, onChange }) => {
  // Local state is only used when no externalFilters are provided (uncontrolled mode)
  const [local, setLocal] = useState({
    types: ['PHYSICAL'],
    stock: 'all',
    priceMin: '',
    priceMax: '',
    ...externalFilters,
  });

  // In controlled mode, always read from externalFilters; skip local state updates
  const filters = externalFilters ?? local;

  const update = (patch) => {
    const next = { ...filters, ...patch };
    if (!externalFilters) setLocal(next);
    onChange?.(next);
  };

  const toggleType = (type) => {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    update({ types });
  };

  return (
    <aside className="ui-filter-sidebar">
      <div className="ui-fs-title">Filters</div>

      <div className="ui-fs-section">
        <div className="ui-fs-label">Type</div>
        <div className="ui-check-group">
          {[
            { value: 'PHYSICAL', label: 'Physical' },
            { value: 'SERVICE',  label: 'Service'  },
          ].map(({ value, label }) => (
            <label key={value} className="ui-check-item">
              <input
                type="checkbox"
                checked={filters.types.includes(value)}
                onChange={() => toggleType(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="ui-fs-section">
        <div className="ui-fs-label">Stock</div>
        <div className="ui-check-group">
          {[
            { value: 'all',     label: 'All' },
            { value: 'inStock', label: 'In stock' },
          ].map((opt) => (
            <label key={opt.value} className="ui-check-item">
              <input
                type="radio"
                name="fs-stock"
                checked={filters.stock === opt.value}
                onChange={() => update({ stock: opt.value })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="ui-fs-section">
        <div className="ui-fs-label">Price</div>
        <div className="ui-fs-price">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => update({ priceMin: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => update({ priceMax: e.target.value })}
          />
        </div>
        <button className="ui-fs-apply" onClick={() => onChange?.(filters)}>Apply</button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
