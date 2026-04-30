'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import MotionCapture from './MotionCapture';

export default function FloatingMotionFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--teal)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 8px 32px rgba(49,214,196,0.35)',
          zIndex: 90,
          color: '#07090b',
        }}
        title="Record Motion"
      >
        🔨
      </motion.button>
      <MotionCapture isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
