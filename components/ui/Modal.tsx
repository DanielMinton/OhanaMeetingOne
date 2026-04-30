'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = '500px' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 200,
              backdropFilter: 'blur(4px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `min(${maxWidth}, calc(100vw - 32px))`,
              background: 'var(--bg-panel)',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-ambient)',
              zIndex: 201,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '24px', borderBottom: '1px solid var(--line-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{title}</h3>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '4px 8px' }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '24px' }}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
