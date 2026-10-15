import '../../ui.css';

/** Renders a generic pill badge; variant controls the color scheme via CSS modifier. */
const Badge = ({ variant = 'cat', children }) => (
  <span className={`ui-badge ui-badge--${variant}`}>{children}</span>
);

export default Badge;
