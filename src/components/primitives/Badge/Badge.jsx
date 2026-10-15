import '../../ui.css';

const Badge = ({ variant = 'cat', children }) => (
  <span className={`ui-badge ui-badge--${variant}`}>{children}</span>
);

export default Badge;
