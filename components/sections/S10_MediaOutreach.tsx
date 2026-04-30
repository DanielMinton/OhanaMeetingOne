'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Textarea } from '../ui/Input';
import MotionCapture from '../meeting/MotionCapture';

const MEDIA_ITEMS = [
  { key: 'podcast', label: 'Podcast-style or interview media track' },
  { key: 'recovery-stories', label: 'Member recovery story sharing (voluntary)' },
  { key: 'outside-guests', label: 'Outside guests and community figures' },
  { key: 'consent-privacy', label: 'Consent, editing, publishing, and privacy expectations' },
];

export default function S10_MediaOutreach() {
  const mediaChecklist = useMeetingStore((s) => s.mediaChecklist);
  const sectionNotes = useMeetingStore((s) => s.sectionNotes['s10'] ?? '');
  const toggleMediaCheck = useMeetingStore((s) => s.toggleMediaCheck);
  const setSectionNotes = useMeetingStore((s) => s.setSectionNotes);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [motionOpen, setMotionOpen] = useState(false);

  return (
    <SectionWrapper sectionId="s10">
      <Card>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', fontFamily: '"Outfit", sans-serif' }}>Discussion Items</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {MEDIA_ITEMS.map((item) => (
            <div key={item.key}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: expanded === item.key ? 'var(--bg-elevated)' : 'transparent',
                }}
              >
                <div
                  onClick={() => toggleMediaCheck(item.key)}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: `2px solid ${mediaChecklist[item.key] ? 'var(--teal)' : 'var(--line)'}`,
                    background: mediaChecklist[item.key] ? 'var(--teal)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {mediaChecklist[item.key] && <span style={{ color: '#07090b', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
                </div>
                <span
                  onClick={() => setExpanded(expanded === item.key ? null : item.key)}
                  style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                >
                  {item.label}
                </span>
                <motion.span
                  animate={{ rotate: expanded === item.key ? 180 : 0 }}
                  onClick={() => setExpanded(expanded === item.key ? null : item.key)}
                  style={{ color: 'var(--text-ghost)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  ▼
                </motion.span>
              </div>

              <AnimatePresence>
                {expanded === item.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', paddingLeft: '44px', paddingBottom: '12px' }}
                  >
                    <Textarea
                      fullWidth
                      placeholder={`Notes on ${item.label.toLowerCase()}...`}
                      value={sectionNotes}
                      onChange={(e) => setSectionNotes('s10', e.target.value)}
                      rows={3}
                      style={{ marginTop: '8px' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Card>

      <Button variant="secondary" onClick={() => setMotionOpen(true)}>📋 Capture Media Policy Decision</Button>

      <MotionCapture isOpen={motionOpen} onClose={() => setMotionOpen(false)} />
    </SectionWrapper>
  );
}
