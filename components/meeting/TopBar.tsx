'use client';
import { useState } from 'react';
import { useMeetingStore } from '@/lib/store';
import { SECTIONS } from '@/lib/types';
import SectionTimer from './SectionTimer';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function TopBar() {
  const meetingType = useMeetingStore((s) => s.meetingType);
  const currentSectionIndex = useMeetingStore((s) => s.currentSectionIndex);
  const adjourn = useMeetingStore((s) => s.adjourn);
  const isAdjourned = useMeetingStore((s) => s.isAdjourned);
  const currentSection = SECTIONS[currentSectionIndex];
  const timer = useMeetingStore((s) => currentSection ? s.sectionTimers[currentSection.id] : null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const typeLabels = {
    'core-checkin': 'Core Check-In',
    'organizational-planning': 'Org Planning',
    'formal-board': 'Formal Board',
  };

  return (
    <>
      <header
        style={{
          height: '56px',
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: 'var(--teal)', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>Ohana Recovery</span>
          <Badge variant="teal">{typeLabels[meetingType]}</Badge>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {currentSection && timer?.isRunning && (
            <SectionTimer sectionId={currentSection.id} size="sm" />
          )}
        </div>

        <div>
          {!isAdjourned ? (
            <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
              Adjourn Meeting
            </Button>
          ) : (
            <Badge variant="muted">Adjourned</Badge>
          )}
        </div>
      </header>

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Adjourn Meeting">
        <p style={{ color: 'var(--text-secondary)', marginTop: 0 }}>
          Are you sure you want to adjourn the meeting? This will record the end time. You can still complete the minutes afterward.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => { adjourn(); setConfirmOpen(false); }}>Yes, Adjourn</Button>
        </div>
      </Modal>
    </>
  );
}
