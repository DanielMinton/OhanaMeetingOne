'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import ParticleField from '../effects/ParticleField';
import { useMeetingStore } from '@/lib/store';
import { SECTIONS } from '@/lib/types';

interface MinutesViewProps {
  meetingId: string;
}

export default function MinutesView({ meetingId }: MinutesViewProps) {
  const router = useRouter();
  const state = useMeetingStore();
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const present = state.attendees.filter((a) => a.present);

  const canUnlock = !state.minutesPassword || password === state.minutesPassword;
  const isCurrentMeeting = state.meetingId === meetingId;

  const generatePdf = async () => {
    const { generateMinutesPDF } = await import('@/lib/pdf-generator');
    await generateMinutesPDF(useMeetingStore.getState(), state.minutesPassword || password);
  };

  if (!isCurrentMeeting) {
    return (
      <main style={{ minHeight: '100dvh', position: 'relative' }}>
        <ParticleField count={48} />
        <div style={{ position: 'relative', zIndex: 1, width: 'min(760px, 100%)', margin: '0 auto', padding: '48px 18px' }}>
          <Card accent="orange">
            <h1 style={{ margin: '0 0 10px', fontFamily: '"Outfit", sans-serif' }}>Minutes Not Found</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              This MVP stores minutes in the current browser session. Open the live meeting session that generated these minutes to view them here.
            </p>
            <Button variant="secondary" onClick={() => router.push('/')}>Return to Login</Button>
          </Card>
        </div>
      </main>
    );
  }

  if (!unlocked) {
    return (
      <main style={{ minHeight: '100dvh', position: 'relative' }}>
        <ParticleField count={64} />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: '24px' }}>
          <Card accent="teal" style={{ width: 'min(440px, 100%)' }}>
            <h1 style={{ margin: '0 0 8px', fontFamily: '"Outfit", sans-serif' }}>Official Minutes</h1>
            <p style={{ margin: '0 0 18px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Enter the minutes password to view the read-only record.
            </p>
            <Input
              label="Minutes Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <div style={{ marginTop: '16px' }}>
              <Button fullWidth onClick={() => setUnlocked(canUnlock)} disabled={!canUnlock}>
                Unlock Minutes
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100dvh', position: 'relative' }}>
      <ParticleField count={42} />
      <div style={{ position: 'relative', zIndex: 1, width: 'min(980px, 100%)', margin: '0 auto', padding: '40px 18px 72px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <Badge variant="teal">Read Only</Badge>
            <h1 style={{ margin: '12px 0 6px', fontFamily: '"Outfit", sans-serif', fontSize: '2.4rem' }}>
              Ohana Recovery Minutes
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{state.meetingDate} · {state.platform}</p>
          </div>
          <Button variant="secondary" onClick={generatePdf}>Download PDF</Button>
        </header>

        <div style={{ display: 'grid', gap: '18px' }}>
          <Card accent="teal">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
              {[
                ['Start', state.meetingStartTime ?? '—'],
                ['End', state.meetingEndTime ?? '—'],
                ['Secretary', state.secretaryName || '—'],
                ['Attendees', String(present.length)],
                ['Motions', String(state.motions.length)],
                ['Action Items', String(state.actionItems.length)],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ color: 'var(--text-ghost)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ color: 'var(--text-primary)', marginTop: '4px', fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 style={{ marginTop: 0, fontFamily: '"Outfit", sans-serif' }}>Attendance</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {present.map((attendee) => (
                <Badge key={attendee.id} variant="teal">
                  {attendee.name} · {attendee.email || `${attendee.name.split(/\s+/)[0]?.toLowerCase()}@ohanarecovery.org`}
                </Badge>
              ))}
              {!present.length && <span style={{ color: 'var(--text-muted)' }}>No present attendees recorded.</span>}
            </div>
          </Card>

          <Card>
            <h2 style={{ marginTop: 0, fontFamily: '"Outfit", sans-serif' }}>Section Notes</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {SECTIONS.map((section) => {
                const notes = state.sectionNotes[section.id];
                if (!notes && section.id !== 's07') return null;
                return (
                  <div key={section.id} style={{ borderTop: '1px solid var(--line-subtle)', paddingTop: '12px' }}>
                    <h3 style={{ margin: '0 0 6px', color: 'var(--teal)', fontSize: '1rem' }}>{section.title}</h3>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {section.id === 's07' && state.missionDraft ? state.missionDraft : notes}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h2 style={{ marginTop: 0, fontFamily: '"Outfit", sans-serif' }}>Motions</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {state.motions.map((motion) => (
                <div key={motion.id} style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--line)' }}>
                  <div style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>{motion.text}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {motion.timestamp} · Moved by {motion.movedBy || '—'} · Seconded by {motion.secondedBy || '—'} · {motion.result}
                  </div>
                </div>
              ))}
              {!state.motions.length && <span style={{ color: 'var(--text-muted)' }}>No motions recorded.</span>}
            </div>
          </Card>

          <Card>
            <h2 style={{ marginTop: 0, fontFamily: '"Outfit", sans-serif' }}>Action Items</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {state.actionItems.map((item) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', padding: '12px', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.text || 'Untitled action item'}</span>
                  <Badge variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'orange' : 'muted'}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
