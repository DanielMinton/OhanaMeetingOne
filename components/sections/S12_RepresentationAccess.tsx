'use client';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card from '../ui/Card';
import Input, { Select } from '../ui/Input';

const REPRESENTATION_ITEMS = [
  { key: 'who-speaks', label: 'Who may speak publicly for Ohana' },
  { key: 'who-approves', label: 'Who approves public statements, posts, flyers, interviews, and partnerships' },
  { key: 'consent-forms', label: 'Whether media content needs consent forms' },
  { key: 'messaging-alignment', label: 'Messaging alignment with mission' },
];

const ACCESS_LEVEL_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'none', label: 'None' },
];

export default function S12_RepresentationAccess() {
  const accessItems = useMeetingStore((s) => s.accessItems);
  const representationChecklist = useMeetingStore((s) => s.representationChecklist);
  const setAccessField = useMeetingStore((s) => s.setAccessField);
  const toggleRepresentationCheck = useMeetingStore((s) => s.toggleRepresentationCheck);

  return (
    <SectionWrapper sectionId="s12">
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-subtle)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
          Access Inventory
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(49,214,196,0.06)' }}>
                {['System', 'Owner', 'Backup', 'Access Level', 'Notes'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', color: 'var(--text-ghost)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 14px', fontWeight: 600, borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accessItems.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line-subtle)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>{item.system}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Input value={item.owner} onChange={(e) => setAccessField(item.id, 'owner', e.target.value)} placeholder="Name" style={{ width: '110px', padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px' }} />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Input value={item.backup} onChange={(e) => setAccessField(item.id, 'backup', e.target.value)} placeholder="Backup" style={{ width: '110px', padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px' }} />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Select value={item.accessLevel} onChange={(v) => setAccessField(item.id, 'accessLevel', v)} options={ACCESS_LEVEL_OPTIONS} />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Input value={item.notes} onChange={(e) => setAccessField(item.id, 'notes', e.target.value)} placeholder="Notes" style={{ width: '130px', padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', fontFamily: '"Outfit", sans-serif' }}>Public Representation Decisions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {REPRESENTATION_ITEMS.map((item) => (
            <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div
                onClick={() => toggleRepresentationCheck(item.key)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  border: `2px solid ${representationChecklist[item.key] ? 'var(--teal)' : 'var(--line)'}`,
                  background: representationChecklist[item.key] ? 'var(--teal)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {representationChecklist[item.key] && <span style={{ color: '#07090b', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.label}</span>
            </label>
          ))}
        </div>
      </Card>
    </SectionWrapper>
  );
}
