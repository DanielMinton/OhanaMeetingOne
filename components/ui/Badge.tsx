import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'teal' | 'orange' | 'purple' | 'success' | 'danger' | 'muted';
}

const colors = {
  teal: { bg: 'rgba(49,214,196,0.12)', color: 'var(--teal)', border: 'rgba(49,214,196,0.25)' },
  orange: { bg: 'rgba(255,159,67,0.12)', color: 'var(--orange)', border: 'rgba(255,159,67,0.25)' },
  purple: { bg: 'rgba(157,124,255,0.12)', color: 'var(--purple)', border: 'rgba(157,124,255,0.25)' },
  success: { bg: 'rgba(46,204,113,0.12)', color: 'var(--success)', border: 'rgba(46,204,113,0.25)' },
  danger: { bg: 'rgba(255,107,107,0.12)', color: 'var(--danger)', border: 'rgba(255,107,107,0.25)' },
  muted: { bg: 'var(--bg-elevated)', color: 'var(--text-muted)', border: 'var(--line)' },
};

export default function Badge({ children, variant = 'teal' }: BadgeProps) {
  const c = colors[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '99px',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
      }}
    >
      {children}
    </span>
  );
}
