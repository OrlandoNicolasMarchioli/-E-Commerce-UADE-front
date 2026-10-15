class ColorTokens {
  static brand = {
    primary:        'var(--color-brand-primary)',
    primaryHover:   'var(--color-brand-primary-hover)',
    primaryLight:   'var(--color-brand-primary-light)',
    secondary:      'var(--color-brand-secondary)',
    secondaryHover: 'var(--color-brand-secondary-hover)',
    accent:         'var(--color-brand-accent)',
  };

  static neutral = {
    0:   'var(--color-neutral-0)',
    50:  'var(--color-neutral-50)',
    100: 'var(--color-neutral-100)',
    200: 'var(--color-neutral-200)',
    300: 'var(--color-neutral-300)',
    400: 'var(--color-neutral-400)',
    500: 'var(--color-neutral-500)',
    600: 'var(--color-neutral-600)',
    700: 'var(--color-neutral-700)',
    800: 'var(--color-neutral-800)',
    900: 'var(--color-neutral-900)',
  };

  static success     = 'var(--color-success)';
  static successBg   = 'var(--color-success-bg)';
  static successDark = 'var(--color-success-dark)';
  static warning     = 'var(--color-warning)';
  static warningBg   = 'var(--color-warning-bg)';
  static error       = 'var(--color-error)';
  static errorBg     = 'var(--color-error-bg)';
  static errorDark   = 'var(--color-error-dark)';
  static info        = 'var(--color-info)';
  static infoBg      = 'var(--color-info-bg)';

  static surface = {
    page:    'var(--color-surface-page)',
    card:    'var(--color-surface-card)',
    overlay: 'var(--color-surface-overlay)',
    navbar:  'var(--color-surface-navbar)',
  };

  static text = {
    primary:   'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    disabled:  'var(--color-text-disabled)',
    inverse:   'var(--color-text-inverse)',
    link:      'var(--color-text-link)',
    linkHover: 'var(--color-text-link-hover)',
  };

  static border = {
    default: 'var(--color-border-default)',
    strong:  'var(--color-border-strong)',
    brand:   'var(--color-border-brand)',
    error:   'var(--color-border-error)',
  };
}

export default ColorTokens;
