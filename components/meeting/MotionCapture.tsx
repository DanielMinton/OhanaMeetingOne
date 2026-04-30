'use client';
import { useState } from 'react';
import { useMeetingStore } from '@/lib/store';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input, { Textarea, Select } from '../ui/Input';

interface MotionCaptureProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MotionCapture({ isOpen, onClose }: MotionCaptureProps) {
  const addMotion = useMeetingStore((s) => s.addMotion);
  const attendees = useMeetingStore((s) => s.attendees);
  const [text, setText] = useState('');
  const [movedBy, setMovedBy] = useState('');
  const [secondedBy, setSecondedBy] = useState('');
  const [result, setResult] = useState<'carried' | 'failed' | 'tabled' | 'withdrawn'>('carried');

  const presentNames = attendees.filter((a) => a.present).map((a) => a.name);

  const handleSubmit = () => {
    if (!text.trim()) return;
    addMotion({ text, movedBy, secondedBy, result });
    setText('');
    setMovedBy('');
    setSecondedBy('');
    setResult('carried');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Motion" maxWidth="520px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Textarea
          label="Motion Text"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I move that..."
          rows={3}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <Input
              label="Moved By"
              fullWidth
              value={movedBy}
              onChange={(e) => setMovedBy(e.target.value)}
              list="attendee-names"
              placeholder="Name"
            />
            <datalist id="attendee-names">
              {presentNames.map((n) => <option key={n} value={n} />)}
            </datalist>
          </div>
          <Input
            label="Seconded By"
            fullWidth
            value={secondedBy}
            onChange={(e) => setSecondedBy(e.target.value)}
            list="attendee-names"
            placeholder="Name"
          />
        </div>
        <Select
          label="Result"
          fullWidth
          value={result}
          onChange={(v) => setResult(v as typeof result)}
          options={[
            { value: 'carried', label: 'Carried' },
            { value: 'failed', label: 'Failed' },
            { value: 'tabled', label: 'Tabled' },
            { value: 'withdrawn', label: 'Withdrawn' },
          ]}
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!text.trim()}>Record Motion</Button>
        </div>
      </div>
    </Modal>
  );
}
