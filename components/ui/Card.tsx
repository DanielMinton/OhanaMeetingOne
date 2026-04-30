import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accent?: 'teal' | 'orange' | 'purple' | 'none';
  elevated?: boolean;
}

export default function Card({ children, style, accent = 'none', elevated }: CardProps) {
  const bg = elevated ? 'var(--bg-elevated)' : 'var(--bg-panel)';

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${bg} 0%, var(--bg-primary) 100%)`,
        border: `1px solid var(--line)`,
        borderRadius: '18px',
        boxShadow: 'var(--shadow-card)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {accent !== 'none' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '18px',
            background:
              accent === 'teal'
                ? 'linear-gradient(135deg, rgba(49,214,196,0.05) 0%, transparent 60%)'
                : accent === 'orange'
                  ? 'linear-gradient(135deg, rgba(255,159,67,0.05) 0%, transparent 60%)'
                  : 'linear-gradient(135deg, rgba(157,124,255,0.05) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

export function Callout({ children, accent = 'orange', style }: { children: ReactNode; accent?: 'orange' | 'teal' | 'purple'; style?: CSSProperties }) {
  const colors = {
    orange: { border: 'var(--orange)', bg: 'rgba(255,159,67,0.06)' },
    teal: { border: 'var(--teal)', bg: 'rgba(49,214,196,0.06)' },
    purple: { border: 'var(--purple)', bg: 'rgba(157,124,255,0.06)' },
  };
  return (
    <div
      style={{
        background: colors[accent].bg,
        borderLeft: `3px solid ${colors[accent].border}`,
        borderRadius: '0 12px 12px 0',
        padding: '16px 20px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
