import '../../ui.css';

/** Tab bar for filtering a list by status; each tab optionally shows a count badge. */
const StatusTabBar = ({ statuses = [], active, onChange }) => (
  <div className="ui-status-tabs" role="tablist">
    {statuses.map((s) => (
      <div
        key={s.value}
        className={`ui-st-tab${active === s.value ? ' ui-st-tab--active' : ''}`}
        onClick={() => onChange(s.value)}
        role="tab"
        aria-selected={active === s.value}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onChange(s.value)}
      >
        {s.label}{s.count !== undefined ? ` (${s.count})` : ''}
      </div>
    ))}
  </div>
);

export default StatusTabBar;
