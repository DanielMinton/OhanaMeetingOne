'use client';
import { motion } from 'framer-motion';
import { useMeetingStore } from '@/lib/store';
import { SECTIONS } from '@/lib/types';

export default function Sidebar() {
  const currentSectionIndex = useMeetingStore((s) => s.currentSectionIndex);
  const completedSections = useMeetingStore((s) => s.completedSections);
  const goToSection = useMeetingStore((s) => s.goToSection);
  const meetingDate = useMeetingStore((s) => s.meetingDate);
  const meetingStartTime = useMeetingStore((s) => s.meetingStartTime);
  const secretaryName = useMeetingStore((s) => s.secretaryName);

  const getStatus = (idx: number, id: string) => {
    if (completedSections.includes(id)) return 'completed';
    if (idx === currentSectionIndex) return 'current';
    return 'upcoming';
  };

  const canNavigate = (idx: number, id: string) => {
    return completedSections.includes(id) || idx === currentSectionIndex || idx < currentSectionIndex;
  };

  return (
    <aside
      style={{
        width: '260px',
        flexShrink: 0,
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {SECTIONS.map((section, idx) => {
          const status = getStatus(idx, section.id);
          const navigable = canNavigate(idx, section.id);

          return (
            <motion.button
              key={section.id}
              onClick={() => navigable && goToSection(idx)}
              whileHover={navigable ? { x: 3 } : {}}
              transition={{ duration: 0.15 }}
              style={{
                width: '100%',
                background: status === 'current' ? 'rgba(49,214,196,0.08)' : 'transparent',
                border: 'none',
                borderLeft: status === 'current' ? '2px solid var(--teal)' : '2px solid transparent',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: navigable ? 'pointer' : 'default',
                opacity: status === 'upcoming' && idx > currentSectionIndex ? 0.4 : 1,
                textAlign: 'left',
              }}
            >
              <StatusDot status={status} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-ghost)', fontFamily: '"JetBrains Mono", monospace', marginBottom: '2px' }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: status === 'current' ? 'var(--teal)' : status === 'completed' ? 'var(--text-secondary)' : 'var(--text-muted)',
                    fontWeight: status === 'current' ? 600 : 400,
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {section.title}
                </div>
              </div>
            </motion.button>
          );
        })}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--line-subtle)', background: 'var(--bg-panel-soft)' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-ghost)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Meeting Info</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <div>{meetingDate}</div>
          {meetingStartTime && <div>Started {meetingStartTime}</div>}
          <div style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '4px' }}>{secretaryName || 'Secretary'}</div>
        </div>
      </div>
    </aside>
  );
}

function StatusDot({ status }: { status: 'completed' | 'current' | 'upcoming' }) {
  if (status === 'completed') {
    return (
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
    );
  }
  if (status === 'current') {
    return (
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'transparent', border: '2px solid var(--teal)', flexShrink: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: '1px', borderRadius: '50%', background: 'var(--teal)', clipPath: 'inset(0 50% 0 0)' }} />
      </div>
    );
  }
  return (
    <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--line)', flexShrink: 0 }} />
  );
}
