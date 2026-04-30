'use client';
import { useState } from 'react';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input, { Textarea } from '../ui/Input';
import MotionCapture from '../meeting/MotionCapture';

export default function S03_AdoptAgenda() {
  const agendaItems = useMeetingStore((s) => s.agendaItems);
  const agendaNotes = useMeetingStore((s) => s.agendaNotes);
  const toggleAgendaItem = useMeetingStore((s) => s.toggleAgendaItem);
  const addAgendaItem = useMeetingStore((s) => s.addAgendaItem);
  const removeAgendaItem = useMeetingStore((s) => s.removeAgendaItem);
  const setAgendaNotes = useMeetingStore((s) => s.setAgendaNotes);
  const [newItem, setNewItem] = useState('');
  const [motionOpen, setMotionOpen] = useState(false);

  const handleAdd = () => {
    if (newItem.trim()) {
      addAgendaItem(newItem.trim());
      setNewItem('');
    }
  };

  return (
    <SectionWrapper sectionId="s03">
      <Card>
        <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Toggle items to include or exclude them from the adopted agenda.
        </div>
        <ol style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {agendaItems.map((item) => (
            <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: item.included ? 'var(--text-primary)' : 'var(--text-ghost)', textDecoration: item.included ? 'none' : 'line-through' }}>
              <span style={{ flex: 1, fontSize: '0.9rem' }}>{item.text}</span>
              <button
                onClick={() => toggleAgendaItem(item.id)}
                style={{
                  background: item.included ? 'rgba(49,214,196,0.12)' : 'var(--bg-elevated)',
                  border: `1px solid ${item.included ? 'var(--teal)' : 'var(--line)'}`,
                  borderRadius: '6px',
                  color: item.included ? 'var(--teal)' : 'var(--text-ghost)',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                }}
              >
                {item.included ? 'Include' : 'Skip'}
              </button>
              <button
                onClick={() => removeAgendaItem(item.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-ghost)', cursor: 'pointer', fontSize: '1rem' }}
              >
                ×
              </button>
            </li>
          ))}
        </ol>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add custom agenda item..."
            style={{ flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button variant="secondary" size="sm" onClick={handleAdd}>Add</Button>
        </div>
      </Card>

      <Textarea
        label="Agenda Modifications / Notes"
        fullWidth
        value={agendaNotes}
        onChange={(e) => setAgendaNotes(e.target.value)}
        placeholder="Note any modifications to the proposed agenda..."
        rows={3}
      />

      <div>
        <Button variant="secondary" onClick={() => setMotionOpen(true)}>
          📋 Motion to Adopt Agenda
        </Button>
      </div>

      <MotionCapture isOpen={motionOpen} onClose={() => setMotionOpen(false)} />
    </SectionWrapper>
  );
}
