import '../../ui.css';

/** Displays a single metric (value + label) as a stat card; color prop applies a CSS modifier for themed variants. */
const StatCard = ({ value, label, color = 'brand' }) => (
  <div className={`ui-stat-card${color !== 'brand' ? ` ui-stat-card--${color}` : ''}`}>
    <div className="ui-sc-val">{value}</div>
    <div className="ui-sc-label">{label}</div>
  </div>
);

export default StatCard;
