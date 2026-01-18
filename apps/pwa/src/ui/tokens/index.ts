// Design tokens as TypeScript constants for use in components

export const colors = {
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  danger: 'var(--color-danger)',
  success: 'var(--color-success)',
} as const;

export const spacing = {
  1: 'var(--spacing-1)',
  2: 'var(--spacing-2)',
  3: 'var(--spacing-3)',
  4: 'var(--spacing-4)',
  6: 'var(--spacing-6)',
  8: 'var(--spacing-8)',
  12: 'var(--spacing-12)',
} as const;

export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: 'var(--radius-full)',
} as const;

export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  glass: 'var(--shadow-glass)',
} as const;

export const transitions = {
  fast: 'var(--transition-fast)',
  base: 'var(--transition-base)',
  slow: 'var(--transition-slow)',
} as const;

export const glass = {
  blur: 'var(--glass-blur)',
  bg: 'var(--glass-bg)',
  bgHover: 'var(--glass-bg-hover)',
  border: 'var(--glass-border)',
} as const;
