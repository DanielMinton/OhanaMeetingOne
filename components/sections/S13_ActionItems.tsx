'use client';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card, { Callout } from '../ui/Card';
import Button from '../ui/Button';
import Input, { Select } from '../ui/Input';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
  { value: 'tabled', label: 'Tabled' },
];

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function S13_ActionItems() {
  const actionItems = useMeetingStore((s) => s.actionItems);
  const setActionField = useMeetingStore((s) => s.setActionField);
  const addActionItem = useMeetingStore((s) => s.addActionItem);
  const removeActionItem = useMeetingStore((s) => s.removeActionItem);
  const nextMeetingDateTime = useMeetingStore((s) => s.nextMeetingDateTime);
  const setNextMeetingDateTime = useMeetingStore((s) => s.setNextMeetingDateTime);

  return (
    <SectionWrapper sectionId="s13">
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-subtle)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>Action Items</span>
          <Button variant="secondary" size="sm" onClick={addActionItem}>+ Add Item</Button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(49,214,196,0.06)' }}>
                {['Action Item', 'Owner', 'Due Date', 'Status', 'Priority', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', color: 'var(--text-ghost)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 14px', fontWeight: 600, borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actionItems.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line-subtle)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '10px 14px', minWidth: '220px' }}>
                    <Input
                      value={item.text}
                      onChange={(e) => setActionField(item.id, 'text', e.target.value)}
                      placeholder="Action item..."
                      style={{ width: '100%', padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Input
                      value={item.owner}
                      onChange={(e) => setActionField(item.id, 'owner', e.target.value)}
                      placeholder="Owner"
                      style={{ width: '110px', padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Input
                      type="date"
                      value={item.dueDate}
                      onChange={(e) => setActionField(item.id, 'dueDate', e.target.value)}
                      style={{ width: '140px', padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px', colorScheme: 'dark' }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Select value={item.status} onChange={(v) => setActionField(item.id, 'status', v)} options={STATUS_OPTIONS} />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Select value={item.priority} onChange={(v) => setActionField(item.id, 'priority', v)} options={PRIORITY_OPTIONS} />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      onClick={() => removeActionItem(item.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem' }}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Callout accent="teal">
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--teal)' }}>Closing Script:</strong> &quot;We&apos;ve captured all action items for this meeting. Each item has an owner and a priority. Please review your assignments and come to the next meeting prepared to report on progress. The next meeting minutes will open with a review of these items.&quot;
        </p>
      </Callout>

      <div>
        <Input
          label="Next Meeting Date / Time"
          type="datetime-local"
          fullWidth
          value={nextMeetingDateTime}
          onChange={(e) => setNextMeetingDateTime(e.target.value)}
          style={{ colorScheme: 'dark' }}
        />
      </div>
    </SectionWrapper>
  );
}
