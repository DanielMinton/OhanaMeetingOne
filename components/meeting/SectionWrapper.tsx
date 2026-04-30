'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMeetingStore } from '@/lib/store';
import { SECTIONS } from '@/lib/types';
import SectionTimer from './SectionTimer';
import Button from '../ui/Button';
import CompletionBurst, { useBurst } from '../effects/CompletionBurst';
import { playCompletionTone } from '@/lib/audio';

interface SectionWrapperProps {
  sectionId: string;
  children: ReactNode;
}

export default function SectionWrapper({ sectionId, children }: SectionWrapperProps) {
  const sectionDef = SECTIONS.find((s) => s.id === sectionId);
  const timer = useMeetingStore((s) => s.sectionTimers[sectionId]);
  const completedSections = useMeetingStore((s) => s.completedSections);
  const completeSection = useMeetingStore((s) => s.completeSection);
  const advanceSection = useMeetingStore((s) => s.advanceSection);
  const currentSectionIndex = useMeetingStore((s) => s.currentSectionIndex);
  const setTimerRunning = useMeetingStore((s) => s.setTimerRunning);
  const burstRef = useBurst();

  const isCompleted = completedSections.includes(sectionId);
  const sectionIdx = SECTIONS.findIndex((s) => s.id === sectionId);
  const isActive = sectionIdx === currentSectionIndex;

  const handleComplete = (e: React.MouseEvent) => {
    if (burstRef.current) {
      burstRef.current(e.clientX, e.clientY);
    }
    playCompletionTone();
    completeSection(sectionId);
    setTimerRunning(sectionId, false);

    const next = SECTIONS[sectionIdx + 1];
    if (next) {
      setTimeout(() => {
        advanceSection();
        setTimerRunning(next.id, true);
      }, 400);
    }
  };

  return (
    <>
      <CompletionBurst triggerRef={burstRef} />
      <motion.div
        key={sectionId}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        style={{ padding: '32px', maxWidth: '900px', width: '100%', margin: '0 auto' }}
      >
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-ghost)', fontFamily: '"JetBrains Mono", monospace', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Section {String(sectionIdx + 1).padStart(2, '0')} of {SECTIONS.length}
            </div>
            <h2 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontSize: '1.75rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.2 }}>
              {sectionDef?.title}
            </h2>
            <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Default: {sectionDef?.defaultMinutes} min
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {isActive && <SectionTimer sectionId={sectionId} size="lg" />}
            {isCompleted && (
              <div style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.82rem' }}>✓ Complete</div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {children}
        </div>

        {/* Complete button */}
        {isActive && !isCompleted && (
          <motion.div
            animate={timer?.isExpired ? { boxShadow: ['0 0 0 0 rgba(49,214,196,0)', '0 0 0 8px rgba(49,214,196,0.2)', '0 0 0 0 rgba(49,214,196,0)'] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', borderRadius: '12px' }}
          >
            <Button size="lg" onClick={handleComplete} style={{ minWidth: '220px' }}>
              Complete Section →
            </Button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
