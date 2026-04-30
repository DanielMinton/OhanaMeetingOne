'use client';
import { useState } from 'react';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SignaturePad from '../meeting/SignaturePad';

export default function S14_Adjournment() {
  const [deliveryStatus, setDeliveryStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const {
    meetingStartTime,
    meetingEndTime,
    attendees,
    motions,
    actionItems,
    completedSections,
    secretarySignature,
    chairSignature,
    minutesPassword,
    secretaryName,
    isAdjourned,
    adjourn,
    setSecretarySignature,
    setChairSignature,
    setMinutesPassword,
  } = useMeetingStore();

  const presentCount = attendees.filter((a) => a.present).length;
  const openItems = actionItems.filter((a) => a.status === 'open' || a.status === 'in-progress').length;

  const handleGeneratePDF = async () => {
    setDeliveryStatus(null);

    if (!secretarySignature || !chairSignature) {
      setDeliveryStatus({ type: 'error', message: 'Capture both chair and secretary signatures before generating minutes.' });
      return;
    }
    if (minutesPassword.trim().length < 8) {
      setDeliveryStatus({ type: 'error', message: 'Set a minutes PDF password with at least 8 characters.' });
      return;
    }

    const state = useMeetingStore.getState();
    const recipients = state.attendees
      .filter((attendee) => attendee.present)
      .map((attendee) => ({
        name: attendee.name,
        email: attendee.email || `${attendee.name.split(/\s+/)[0]?.toLowerCase()}@ohanarecovery.org`,
      }))
      .filter((attendee) => attendee.email);

    if (!recipients.length) {
      setDeliveryStatus({ type: 'error', message: 'Mark at least one attendee present before sending minutes.' });
      return;
    }

    setIsSending(true);
    setDeliveryStatus({ type: 'info', message: 'Generating the final PDF and sending it to present members...' });

    try {
      const { generateMinutesPDF, generateMinutesPDFBlob, getMinutesFileName } = await import('@/lib/pdf-generator');
      const { blobToBase64 } = await import('@/lib/file');
      const pdfBlob = await generateMinutesPDFBlob(state, minutesPassword);
      const pdfBase64 = await blobToBase64(pdfBlob);
      await generateMinutesPDF(state, minutesPassword);

      const response = await fetch('/api/minutes/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          fileName: getMinutesFileName(state),
          pdfBase64,
          meetingDate: state.meetingDate,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setDeliveryStatus({ type: 'error', message: result.error ?? 'The PDF was generated, but email delivery failed.' });
        return;
      }

      setDeliveryStatus({
        type: 'success',
        message: `Minutes PDF sent to ${result.sent.length} member${result.sent.length === 1 ? '' : 's'}: ${result.sent.join(', ')}`,
      });
    } catch (error) {
      setDeliveryStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'The minutes closeout failed unexpectedly.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SectionWrapper sectionId="s14">
      {/* Meeting Summary */}
      <Card accent="teal">
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', fontFamily: '"Outfit", sans-serif', fontSize: '1.1rem' }}>
          Meeting Summary
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Start Time', value: meetingStartTime ?? '—' },
            { label: 'End Time', value: meetingEndTime ?? 'Active' },
            { label: 'Sections Done', value: `${completedSections.length} / 14` },
            { label: 'Motions', value: String(motions.length) },
            { label: 'Open Items', value: String(openItems) },
            { label: 'Attendees', value: `${presentCount} present` },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: '14px 16px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-ghost)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '1.1rem', color: 'var(--teal)', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Adjourn */}
      {!isAdjourned && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button size="lg" variant="secondary" onClick={adjourn} style={{ minWidth: '240px' }}>
            🔔 Record Adjournment Time
          </Button>
        </div>
      )}

      {isAdjourned && (
        <div style={{ textAlign: 'center', color: 'var(--teal)', fontFamily: '"JetBrains Mono", monospace' }}>
          ✓ Adjourned at {meetingEndTime}
        </div>
      )}

      {/* Signatures */}
      <Card>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', fontFamily: '"Outfit", sans-serif' }}>Digital Signatures</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <SignaturePad
            label="Chair Signature"
            onSave={setChairSignature}
            saved={!!chairSignature}
          />
          <SignaturePad
            label={`Secretary Signature (${secretaryName || 'Secretary'})`}
            onSave={setSecretarySignature}
            saved={!!secretarySignature}
          />
        </div>
      </Card>

      {/* Minutes Password + Generate */}
      <Card>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', fontFamily: '"Outfit", sans-serif' }}>Generate Meeting Minutes</div>
        <div style={{ marginBottom: '16px' }}>
          <Input
            label="Minutes PDF Password"
            type="password"
            fullWidth
            value={minutesPassword}
            onChange={(e) => setMinutesPassword(e.target.value)}
            placeholder="Set a password for the PDF"
          />
          <p style={{ margin: '8px 0 0', color: 'var(--text-ghost)', fontSize: '0.78rem' }}>
            This password protects the generated PDF. Share it with attendees verbally or via secure message.
          </p>
        </div>
        <Button
          size="lg"
          fullWidth
          onClick={handleGeneratePDF}
          disabled={!minutesPassword || !isAdjourned || isSending}
        >
          {isSending ? 'Sending Meeting Minutes...' : '📄 Generate, Download & Email Meeting Minutes'}
        </Button>
        {deliveryStatus && (
          <div
            role={deliveryStatus.type === 'error' ? 'alert' : 'status'}
            style={{
              marginTop: '12px',
              border: `1px solid ${
                deliveryStatus.type === 'success'
                  ? 'var(--teal)'
                  : deliveryStatus.type === 'error'
                    ? 'var(--danger)'
                    : 'var(--line)'
              }`,
              borderRadius: '12px',
              padding: '10px 12px',
              color:
                deliveryStatus.type === 'success'
                  ? 'var(--teal)'
                  : deliveryStatus.type === 'error'
                    ? 'var(--danger)'
                    : 'var(--text-secondary)',
              background:
                deliveryStatus.type === 'success'
                  ? 'rgba(49,214,196,0.08)'
                  : deliveryStatus.type === 'error'
                    ? 'rgba(255,107,107,0.08)'
                    : 'var(--bg-input)',
              fontSize: '0.84rem',
              lineHeight: 1.5,
            }}
          >
            {deliveryStatus.message}
          </div>
        )}
        {!isAdjourned && (
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center' }}>
            Record adjournment time before generating minutes.
          </p>
        )}
      </Card>
    </SectionWrapper>
  );
}
