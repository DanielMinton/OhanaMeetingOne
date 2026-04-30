'use client';
import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: {
    background: 'var(--teal)',
    color: '#07090b',
    border: '1px solid var(--teal)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--teal)',
    border: '1px solid var(--teal)',
  },
  danger: {
    background: 'transparent',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--line)',
  },
  muted: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--line)',
  },
};

const sizes = {
  sm: { padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' },
  md: { padding: '10px 20px', fontSize: '0.9rem', borderRadius: '10px' },
  lg: { padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      style={{
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'var(--font-ibm), "IBM Plex Sans", sans-serif',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'box-shadow 0.2s ease-out',
        outline: 'none',
        ...style,
      }}
      disabled={disabled}
      {...(props as object)}
    >
      {children}
    </motion.button>
  );
}
