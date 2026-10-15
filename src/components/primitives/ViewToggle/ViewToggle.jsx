import '../../ui.css';

// Available view modes; extend here to add new layout options.
const VIEWS = [
  { key: 'grid', icon: '⊞', label: 'Grid view' },
  { key: 'list', icon: '≡', label: 'List view' },
];

/** Toggle between grid and list product view modes. */
const ViewToggle = ({ value = 'grid', onChange }) => (
  <div className="ui-view-toggle" role="group" aria-label="View mode">
    {VIEWS.map(({ key, icon, label }) => (
      <button
        key={key}
        className={`ui-view-btn${value === key ? ' ui-view-btn--active' : ''}`}
        onClick={() => onChange?.(key)}
        aria-label={label}
        aria-pressed={value === key}
      >
        {icon}
      </button>
    ))}
  </div>
);

export default ViewToggle;
