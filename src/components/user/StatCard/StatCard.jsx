import '../../ui.css';

const StatCard = ({ value, label, color = 'brand' }) => (
  <div className={`ui-stat-card${color !== 'brand' ? ` ui-stat-card--${color}` : ''}`}>
    <div className="ui-sc-val">{value}</div>
    <div className="ui-sc-label">{label}</div>
  </div>
);

export default StatCard;
