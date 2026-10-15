import '../../ui.css';

/** Renders a styled button supporting multiple variants, sizes, loading state, and icon-only mode. */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconOnly = false,
  round = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button',
}) => {
  // iconOnly skips the size modifier and uses a square/round icon class instead
  const classes = [
    'ui-btn',
    `ui-btn--${variant}`,
    iconOnly ? (round ? 'ui-btn--icon-round' : 'ui-btn--icon') : `ui-btn--${size}`,
    (disabled || loading) ? 'ui-btn--disabled' : '',
    fullWidth ? 'ui-btn--full' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? '⟳' : icon}
      {!iconOnly && children}
    </button>
  );
};

export default Button;
