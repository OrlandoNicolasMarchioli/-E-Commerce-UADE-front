import '../../ui.css';

const OPTIONS = [
  { value: 'PHYSICAL', icon: '📦', label: 'Physical product', sub: 'Has stock · Can be shipped' },
  { value: 'SERVICE',  icon: '🎓', label: 'Service',          sub: 'Class, tutoring, consulting' },
];

const ProductTypeToggle = ({ value, onChange }) => (
  <div className="ui-type-toggle">
    {OPTIONS.map((opt) => (
      <div
        key={opt.value}
        className={`ui-type-opt${value === opt.value ? ' ui-type-opt--active' : ''}`}
        onClick={() => onChange(opt.value)}
        role="radio"
        aria-checked={value === opt.value}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onChange(opt.value)}
      >
        <div className="ui-type-opt-icon">{opt.icon}</div>
        <div className="ui-type-opt-label">{opt.label}</div>
        <div className="ui-type-opt-sub">{opt.sub}</div>
      </div>
    ))}
  </div>
);

export default ProductTypeToggle;
