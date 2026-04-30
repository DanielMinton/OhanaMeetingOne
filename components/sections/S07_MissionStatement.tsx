'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import { Callout } from '../ui/Card';
import Button from '../ui/Button';
import { Textarea } from '../ui/Input';
import MotionCapture from '../meeting/MotionCapture';

export default function S07_MissionStatement() {
  const missionDraft = useMeetingStore((s) => s.missionDraft);
  const missionPreviousDrafts = useMeetingStore((s) => s.missionPreviousDrafts);
  const setMissionDraft = useMeetingStore((s) => s.setMissionDraft);
  const saveMissionDraft = useMeetingStore((s) => s.saveMissionDraft);
  const [motionOpen, setMotionOpen] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);

  const wordCount = missionDraft.trim() ? missionDraft.trim().split(/\s+/).length : 0;
  const charCount = missionDraft.length;

  return (
    <SectionWrapper sectionId="s07">
      <Callout accent="purple">
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>
          A strong mission statement is <strong style={{ color: 'var(--purple)' }}>one to three sentences</strong>. It names who you are, who you serve, and what you do for them. It should be plain-spoken — something you could say out loud in a meeting without reading from a card. It should not sound like it was written by a nonprofit grant committee.
        </p>
      </Callout>

      <div>
        <Textarea
          label="Mission Statement Draft"
          fullWidth
          value={missionDraft}
          onChange={(e) => setMissionDraft(e.target.value)}
          placeholder="Ohana Recovery exists to..."
          rows={6}
          style={{ fontSize: '1.1rem', lineHeight: 1.7 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--text-ghost)', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", monospace' }}>
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button variant="ghost" size="sm" onClick={() => { saveMissionDraft(); }}>Save Draft Version</Button>
        <Button variant="secondary" size="sm" onClick={() => setMotionOpen(true)}>📋 Motion to Adopt Draft</Button>
        {missionPreviousDrafts.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setShowPrevious(!showPrevious)}>
            {showPrevious ? 'Hide' : 'View'} Previous Drafts ({missionPreviousDrafts.length})
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showPrevious && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
              {missionPreviousDrafts.map((draft, i) => (
                <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-panel-soft)', border: '1px solid var(--line)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-ghost)', marginBottom: '6px' }}>Draft {i + 1}</div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{draft}</p>
                  <Button variant="ghost" size="sm" style={{ marginTop: '8px' }} onClick={() => setMissionDraft(draft)}>
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MotionCapture isOpen={motionOpen} onClose={() => setMotionOpen(false)} />
    </SectionWrapper>
  );
}
