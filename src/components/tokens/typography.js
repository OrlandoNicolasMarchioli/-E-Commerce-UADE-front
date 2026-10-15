// Token class — maps semantic typography names to CSS custom property strings.
// Import instead of hardcoding var(--font-...) values directly in component styles.
class TypographyTokens {
  static fontFamily = {
    base:    'var(--font-family-base)',
    heading: 'var(--font-family-heading)',
    mono:    'var(--font-family-mono)',
  };

  static fontSize = {
    xs:   'var(--font-size-xs)',
    sm:   'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    md:   'var(--font-size-md)',
    lg:   'var(--font-size-lg)',
    xl:   'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
  };

  static fontWeight = {
    regular:  'var(--font-weight-regular)',
    medium:   'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold:     'var(--font-weight-bold)',
  };

  static lineHeight = {
    tight:   'var(--line-height-tight)',
    snug:    'var(--line-height-snug)',
    base:    'var(--line-height-base)',
    relaxed: 'var(--line-height-relaxed)',
  };

  static letterSpacing = {
    tight:  'var(--letter-spacing-tight)',
    normal: 'var(--letter-spacing-normal)',
    wide:   'var(--letter-spacing-wide)',
    wider:  'var(--letter-spacing-wider)',
  };
}

export default TypographyTokens;
