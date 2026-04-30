'use client';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import { Callout } from '../ui/Card';
import Button from '../ui/Button';
import Input, { Select } from '../ui/Input';

export default function S01_CallToOrder() {
  const meetingType = useMeetingStore((s) => s.meetingType);
  const platform = useMeetingStore((s) => s.platform);
  const meetingStartTime = useMeetingStore((s) => s.meetingStartTime);
  const setMeetingType = useMeetingStore((s) => s.setMeetingType);
  const setPlatform = useMeetingStore((s) => s.setPlatform);
  const callToOrder = useMeetingStore((s) => s.callToOrder);
  const setTimerRunning = useMeetingStore((s) => s.setTimerRunning);

  const handleCallToOrder = () => {
    callToOrder();
    setTimerRunning('s01', true);
  };

  return (
    <SectionWrapper sectionId="s01">
      <Callout accent="orange">
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--orange)' }}>Chair Script:</strong> &quot;I&apos;d like to call this meeting of Ohana Recovery to order. Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. This is our {meetingType === 'core-checkin' ? 'Core Check-In' : meetingType === 'organizational-planning' ? 'Core Organizational Planning Meeting' : 'Formal Board Meeting'}. We&apos;re meeting via {platform}. Let&apos;s get started.&quot;
        </p>
      </Callout>

      {!meetingStartTime && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
          <Button size="lg" onClick={handleCallToOrder} style={{ minWidth: '260px' }}>
            📢 Call Meeting to Order
          </Button>
        </div>
      )}

      {meetingStartTime && (
        <div style={{ textAlign: 'center', color: 'var(--teal)', fontFamily: '"JetBrains Mono", monospace', fontSize: '1rem' }}>
          ✓ Meeting called to order at {meetingStartTime}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Select
          label="Meeting Type"
          fullWidth
          value={meetingType}
          onChange={(v) => setMeetingType(v as typeof meetingType)}
          options={[
            { value: 'core-checkin', label: 'Core Check-In' },
            { value: 'organizational-planning', label: 'Organizational Planning' },
            { value: 'formal-board', label: 'Formal Board Meeting' },
          ]}
        />
        <Input
          label="Platform"
          fullWidth
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          placeholder="Zoom, In-Person, etc."
        />
      </div>
    </SectionWrapper>
  );
}
