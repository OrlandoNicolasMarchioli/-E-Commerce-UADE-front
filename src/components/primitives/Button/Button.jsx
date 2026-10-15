import '../../ui.css';

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
