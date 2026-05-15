export const colors = {
  skyTop: '#e8f8ff',
  skyBottom: '#c8e8ff',
  horizonGlow: '#fff5cd',
  icePrimary: '#f6ffff',
  iceSecondary: '#a5ddf4',
  snowShadow: '#c4e8f7',
  arcticBlue: '#78c7f0',
  arcticBlueDeep: '#2a8ec4',
  arcticMist: '#effcff',

  glass: 'rgba(255, 255, 255, 0.52)',
  glassBorder: 'rgba(255, 255, 255, 0.64)',
  glassHeavy: 'rgba(255, 255, 255, 0.72)',
  glassDark: 'rgba(12, 58, 92, 0.06)',

  textPrimary: '#0a2e4a',
  textSecondary: '#3d6e92',
  textLight: 'rgba(255, 255, 255, 0.92)',

  accent: '#ffb84d',
  accentGlow: '#ffd98a',
  accentDark: '#e89520',
  accentSoft: '#fff0d4',

  alert: '#ff6b5a',
  success: '#4cd9a0',
  ticker: '#eaf7ff',
  tickerBorder: '#8bc8e8',
};

export const typography = {
  display: {
    ios: 'AvenirNextCondensed-Heavy',
    android: 'sans-serif-condensed',
    default: 'System',
  },
  body: {
    ios: 'AvenirNext-Medium',
    android: 'sans-serif-medium',
    default: 'System',
  },
  mono: {
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  },
};

export const gradients = {
  app: ['#eafaff', '#d6f0ff', '#b8ddf5'] as const,
  hudGlass: ['rgba(255, 255, 255, 0.62)', 'rgba(230, 245, 255, 0.52)'] as const,
  cta: ['#ffd977', '#ffb049'] as const,
  ctaHover: ['#ffe4a0', '#ffc460'] as const,
  frosted: ['rgba(240, 250, 255, 0.88)', 'rgba(210, 238, 255, 0.82)'] as const,
  warmGlow: ['rgba(255, 248, 220, 0.6)', 'rgba(255, 240, 200, 0)'] as const,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const radii = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  pill: 999,
};
