'use client';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';

export default function S02_Attendance() {
  const attendees = useMeetingStore((s) => s.attendees);
  const setAttendeePresent = useMeetingStore((s) => s.setAttendeePresent);
  const setAttendeeRole = useMeetingStore((s) => s.setAttendeeRole);
  const setAttendeeName = useMeetingStore((s) => s.setAttendeeName);
  const setAttendeeEmail = useMeetingStore((s) => s.setAttendeeEmail);
  const addAttendee = useMeetingStore((s) => s.addAttendee);
  const removeAttendee = useMeetingStore((s) => s.removeAttendee);

  const presentCount = attendees.filter((a) => a.present).length;

  return (
    <SectionWrapper sectionId="s02">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', color: 'var(--teal)', fontSize: '0.9rem' }}>
          {presentCount} of {attendees.length} members present
        </div>
        <Button variant="secondary" size="sm" onClick={addAttendee}>+ Add Attendee</Button>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
            <thead>
              <tr>
                {['Name', 'Email', 'Present', 'Role / Notes', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', color: 'var(--text-ghost)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 10px', fontWeight: 600, background: 'rgba(49,214,196,0.05)', borderBottom: '1px solid var(--line)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendees.map((a) => (
                <tr key={a.id} style={{ background: a.present ? 'rgba(49,214,196,0.04)' : 'transparent' }}>
                  <td style={{ padding: '10px 12px' }}>
                    {a.isCore ? (
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.name}</span>
                    ) : (
                      <Input
                        value={a.name}
                        onChange={(e) => setAttendeeName(a.id, e.target.value)}
                        placeholder="Name"
                        style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
                      />
                    )}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Input
                      value={a.email || `${a.name.split(/\s+/)[0]?.toLowerCase() || ''}@ohanarecovery.org`}
                      onChange={(e) => setAttendeeEmail(a.id, e.target.value)}
                      placeholder="email@ohanarecovery.org"
                      style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px', minWidth: '190px' }}
                    />
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Toggle checked={a.present} onChange={(v) => setAttendeePresent(a.id, v)} />
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Input
                      value={a.role}
                      onChange={(e) => setAttendeeRole(a.id, e.target.value)}
                      placeholder="Role or notes"
                      style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px', width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {!a.isCore && (
                      <button
                        onClick={() => removeAttendee(a.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem', padding: '2px 6px' }}
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </SectionWrapper>
  );
}
