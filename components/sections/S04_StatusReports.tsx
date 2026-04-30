'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card from '../ui/Card';
import Input, { Textarea } from '../ui/Input';

const AREAS = [
  'Meeting Operations',
  'Web / Technology',
  'Finance / Budget',
  'Outreach / Growth',
  'Other Updates',
];

export default function S04_StatusReports() {
  const statusReports = useMeetingStore((s) => s.statusReports);
  const setStatusReport = useMeetingStore((s) => s.setStatusReport);
  const [expanded, setExpanded] = useState<string | null>(AREAS[0]);

  return (
    <SectionWrapper sectionId="s04">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {AREAS.map((area) => {
          const isOpen = expanded === area;
          const report = statusReports[area] ?? { reporter: '', notes: '' };
          const hasContent = report.reporter || report.notes;

          return (
            <Card key={area} style={{ padding: '0', overflow: 'hidden' }}>
              <button
                onClick={() => setExpanded(isOpen ? null : area)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <span style={{ fontWeight: 600, color: isOpen ? 'var(--teal)' : 'var(--text-primary)', fontSize: '0.95rem', fontFamily: '"Outfit", sans-serif' }}>
                  {area}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {hasContent && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} />}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    style={{ color: 'var(--text-ghost)', fontSize: '0.8rem', display: 'block' }}
                  >
                    ▼
                  </motion.span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--line-subtle)' }}>
                      <div style={{ paddingTop: '16px' }}>
                        <Input
                          label="Reporter"
                          fullWidth
                          value={report.reporter}
                          onChange={(e) => setStatusReport(area, 'reporter', e.target.value)}
                          placeholder="Who gave this update?"
                        />
                      </div>
                      <Textarea
                        label="Notes"
                        fullWidth
                        value={report.notes}
                        onChange={(e) => setStatusReport(area, 'notes', e.target.value)}
                        placeholder="Status update notes..."
                        rows={4}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
