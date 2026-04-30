'use client';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: checked ? 'var(--teal)' : 'var(--bg-elevated)',
          border: `1px solid ${checked ? 'var(--teal)' : 'var(--line)'}`,
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s ease, border-color 0.2s ease',
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'absolute',
            top: '2px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: checked ? '#07090b' : 'var(--text-ghost)',
          }}
        />
      </div>
      {label && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</span>}
    </label>
  );
}
