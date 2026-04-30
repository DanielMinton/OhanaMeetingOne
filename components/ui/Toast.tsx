'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useMeetingStore } from '@/lib/store';

const typeColors = {
  teal: { border: 'var(--teal)', text: 'var(--teal)', bg: 'rgba(49,214,196,0.08)' },
  orange: { border: 'var(--orange)', text: 'var(--orange)', bg: 'rgba(255,159,67,0.08)' },
  muted: { border: 'var(--line)', text: 'var(--text-secondary)', bg: 'var(--bg-panel-soft)' },
  danger: { border: 'var(--danger)', text: 'var(--danger)', bg: 'rgba(255,107,107,0.08)' },
};

export default function ToastContainer() {
  const toasts = useMeetingStore((s) => s.toasts);
  const removeToast = useMeetingStore((s) => s.removeToast);

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 300, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
      <AnimatePresence>
        {toasts.map((t) => {
          const colors = typeColors[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => removeToast(t.id)}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '10px 20px',
                color: colors.text,
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {t.message}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
