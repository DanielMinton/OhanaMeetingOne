'use client';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card, { Callout } from '../ui/Card';
import { Textarea } from '../ui/Input';

const CHECKLIST_ITEMS = [
  { key: 'time-slots', label: 'Additional time slots discussed' },
  { key: 'host-approval', label: 'New host approval / training process discussed' },
  { key: 'backup-coverage', label: 'Backup coverage plan discussed' },
];

const MEETING_RHYTHMS = [
  { type: 'Core Check-In', desc: 'Brief daily sync, ~30 min. Attendance, urgent updates, one action item.', freq: 'Weekly or as needed' },
  { type: 'Organizational Planning', desc: 'Current meeting format. Full agenda, 90 min. Strategic discussion.', freq: 'Monthly' },
  { type: 'Formal Board Meeting', desc: 'Full Roberts Rules, quorum required, official voting. Documentation heavy.', freq: 'Quarterly or as needed' },
];

export default function S06_MeetingSchedule() {
  const scheduleNotes = useMeetingStore((s) => s.scheduleNotes);
  const scheduleChecklist = useMeetingStore((s) => s.scheduleChecklist);
  const setScheduleNotes = useMeetingStore((s) => s.setScheduleNotes);
  const toggleScheduleCheck = useMeetingStore((s) => s.toggleScheduleCheck);

  return (
    <SectionWrapper sectionId="s06">
      <Callout accent="teal">
        <div style={{ color: 'var(--teal)', fontWeight: 700, marginBottom: '4px' }}>Current Meeting Schedule</div>
        <div style={{ color: 'var(--text-secondary)' }}>Seven days a week — 11:00 PM to 3:00 AM Pacific Time</div>
      </Callout>

      <Card>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', fontFamily: '"Outfit", sans-serif' }}>Discussion Points</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CHECKLIST_ITEMS.map((item) => (
            <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div
                onClick={() => toggleScheduleCheck(item.key)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  border: `2px solid ${scheduleChecklist[item.key] ? 'var(--teal)' : 'var(--line)'}`,
                  background: scheduleChecklist[item.key] ? 'var(--teal)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {scheduleChecklist[item.key] && <span style={{ color: '#07090b', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ color: scheduleChecklist[item.key] ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '0.9rem' }}>{item.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', fontFamily: '"Outfit", sans-serif' }}>Meeting Rhythm Options</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MEETING_RHYTHMS.map((r) => (
            <div key={r.type} style={{ padding: '14px 16px', background: 'var(--bg-input)', border: '1px solid var(--line)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.9rem' }}>{r.type}</span>
                <span style={{ color: 'var(--text-ghost)', fontSize: '0.72rem', fontFamily: '"JetBrains Mono", monospace' }}>{r.freq}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Textarea
        label="Discussion Notes"
        fullWidth
        value={scheduleNotes}
        onChange={(e) => setScheduleNotes(e.target.value)}
        placeholder="Notes from the schedule discussion..."
        rows={4}
      />
    </SectionWrapper>
  );
}
