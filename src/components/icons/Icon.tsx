import React from 'react';
import { iconRegistry, type IconName } from './registry';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | number;
export type IconTone = 'inherit' | 'default' | 'muted' | 'primary' | 'secondary' | 'danger';
export type IconState = 'default' | 'active' | 'disabled' | 'loading' | 'success' | 'error';

export interface IconProps {
  /** Semantic icon name from the BRIGHT registry. */
  name: IconName;
  /** sm = 16px, md = 24px (default), lg = 28px, xl = 32px (large navigation), or a number of px. */
  size?: IconSize;
  /** Stroke width; BRIGHT spec range is 1.8–2. */
  strokeWidth?: number;
  /** Base color. `inherit` uses the surrounding text color. */
  tone?: IconTone;
  /** Semantic state. `active` = primary pink, `success` = lime, `loading` spins. */
  state?: IconState;
  /**
   * Accessible name. When omitted the icon is decorative and hidden from
   * assistive tech. Pass a label for icon-only, functional icons.
   */
  label?: string;
  className?: string;
}

const SIZE_PX: Record<Exclude<IconSize, number>, number> = {
  sm: 16,
  md: 24,
  lg: 28,
  xl: 32,
};

const TONE_CLASS: Record<IconTone, string> = {
  inherit: '',
  default: 'text-[var(--bright-icon)]',
  muted: 'text-[var(--bright-icon-muted)]',
  primary: 'text-[var(--bright-primary)]',
  secondary: 'text-[var(--bright-secondary)]',
  danger: 'text-[var(--bright-danger)]',
};

const STATE_CLASS: Record<IconState, string> = {
  default: '',
  active: 'text-[var(--bright-primary)] drop-shadow-[0_0_4px_var(--bright-primary-glow)]',
  disabled: 'text-[var(--bright-icon-disabled)] opacity-60 pointer-events-none',
  loading: 'text-[var(--bright-icon-muted)] animate-spin',
  success: 'text-[var(--bright-secondary)]',
  error: 'text-[var(--bright-danger)]',
};

/**
 * Shared focus treatment for interactive elements that wrap an icon.
 * Apply to the button/link, not to the svg itself.
 */
export const brightFocusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bright-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bright-bg)]';

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  strokeWidth = 1.9,
  tone = 'inherit',
  state = 'default',
  label,
  className = '',
}) => {
  const LucideGlyph = iconRegistry[name];
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const, focusable: 'false' as const };

  const classes = [
    'shrink-0',
    TONE_CLASS[tone],
    state !== 'default' ? STATE_CLASS[state] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <LucideGlyph
      size={px}
      strokeWidth={strokeWidth}
      className={classes}
      {...a11y}
    />
  );
};

export default Icon;
