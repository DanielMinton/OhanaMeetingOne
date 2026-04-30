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
          {/* Centering wrapper — flexbox handles position, Framer Motion handles animation */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 201,
              pointerEvents: 'none',
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              style={{
                width: '100%',
                maxWidth,
                maxHeight: 'calc(100dvh - 32px)',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-panel)',
                border: '1px solid var(--line)',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-ambient)',
                overflow: 'hidden',
                pointerEvents: 'auto',
              }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--line-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <h3 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{title}</h3>
                <button
                  onClick={onClose}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '4px 8px' }}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
