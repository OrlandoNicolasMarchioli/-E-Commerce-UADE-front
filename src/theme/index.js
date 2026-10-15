// UADE E-Commerce — Design Tokens (JS)
// Importar tokens.css en el punto de entrada de la app para las CSS custom properties.
// Este archivo exporta los mismos valores para uso en lógica JS (ej. estilos inline, tests).

export const color = {
  brand: {
    primary:        '#002D62',
    primaryHover:   '#00234e',
    primaryLight:   '#004B9D',
    secondary:      '#0070C0',
    secondaryHover: '#005A9E',
    accent:         '#FFB800',
  },
  neutral: {
    0:   '#FFFFFF',
    50:  '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
  success: { bg: '#D1FAE5', base: '#059669', dark: '#047857' },
  warning: { bg: '#FEF3C7', base: '#D97706', dark: '#B45309' },
  error:   { bg: '#FEE2E2', base: '#DC2626', dark: '#B91C1C' },
  info:    { bg: '#DBEAFE', base: '#2563EB', dark: '#1D4ED8' },
  surface: {
    page:    '#F8F9FA',
    card:    '#FFFFFF',
    overlay: 'rgba(0,0,0,0.5)',
    navbar:  '#002D62',
    footer:  '#001F44',
  },
  text: {
    primary:   '#212529',
    secondary: '#6C757D',
    disabled:  '#ADB5BD',
    inverse:   '#FFFFFF',
    link:      '#0070C0',
    linkHover: '#005A9E',
  },
  border: {
    default: '#DEE2E6',
    strong:  '#ADB5BD',
    brand:   '#002D62',
    error:   '#DC2626',
  },
};

export const font = {
  family: {
    base:    "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    heading: "'Inter', 'Segoe UI', system-ui, sans-serif",
    mono:    "'Fira Code', 'Cascadia Code', monospace",
  },
  size: {
    xs:   '0.75rem',
    sm:   '0.875rem',
    base: '1rem',
    md:   '1.125rem',
    lg:   '1.25rem',
    xl:   '1.5rem',
    '2xl': '1.875rem',
    '3xl': '2.25rem',
    '4xl': '3rem',
  },
  weight: {
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },
  lineHeight: {
    tight:   1.2,
    snug:    1.375,
    base:    1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight:  '-0.025em',
    normal: '0',
    wide:   '0.025em',
    wider:  '0.05em',
  },
};

export const space = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};

export const radius = {
  none: '0',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl': '24px',
  full: '9999px',
};

export const shadow = {
  xs:    '0 1px 2px rgba(0,0,0,0.05)',
  sm:    '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
  md:    '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
  lg:    '0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)',
  xl:    '0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)',
  brand: '0 4px 14px rgba(0,45,98,0.30)',
};

export const duration = {
  fast:   '100ms',
  base:   '150ms',
  slow:   '250ms',
  slower: '400ms',
};

export const breakpoint = {
  xs:   480,
  sm:   640,
  md:   768,
  lg:   1024,
  xl:   1280,
  '2xl': 1536,
};

export const zIndex = {
  base:     0,
  raised:   10,
  dropdown: 100,
  sticky:   200,
  overlay:  300,
  modal:    400,
  toast:    500,
};

const tokens = { color, font, space, radius, shadow, duration, breakpoint, zIndex };
export default tokens;
