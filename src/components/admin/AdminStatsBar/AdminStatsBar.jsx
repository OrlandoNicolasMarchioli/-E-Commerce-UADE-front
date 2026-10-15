import '../../ui.css';

/** Responsive grid of stat cards for the admin dashboard; number of columns matches the stats array length. */
const AdminStatsBar = ({ stats = [] }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 16 }}>
    {stats.map((s, i) => (
      <div key={i} className="ui-stat-card">
        <div className="ui-stat-icon">{s.icon}</div>
        <div className="ui-stat-value">{s.value}</div>
        <div className="ui-stat-label">{s.label}</div>
        {/* trend is a signed percentage; positive = up arrow, negative = down arrow */}
        {s.trend != null && (
          <div className={`ui-stat-trend${s.trend >= 0 ? ' ui-stat-trend--up' : ' ui-stat-trend--down'}`}>
            {s.trend >= 0 ? '↑' : '↓'} {Math.abs(s.trend)}%
          </div>
        )}
      </div>
    ))}
  </div>
);

export default AdminStatsBar;
