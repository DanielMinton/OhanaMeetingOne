'use client';
import { useState } from 'react';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card, { Callout } from '../ui/Card';
import Button from '../ui/Button';
import Input, { Select } from '../ui/Input';
import Modal from '../ui/Modal';

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'draft-complete', label: 'Draft Complete' },
  { value: 'adopted', label: 'Adopted' },
];

export default function S11_DocumentsSOPs() {
  const documents = useMeetingStore((s) => s.documents);
  const setDocumentField = useMeetingStore((s) => s.setDocumentField);
  const addDocument = useMeetingStore((s) => s.addDocument);
  const [newDocName, setNewDocName] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  return (
    <SectionWrapper sectionId="s11">
      <Callout accent="orange">
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--orange)' }}>Recommended First Wave:</strong> Mission Statement, Role Descriptions, Host Script, and Meeting SOP. These four documents give you a foundation for everything else.
        </p>
      </Callout>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(49,214,196,0.06)' }}>
                {['Document', 'Priority', 'Owner', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', color: 'var(--text-ghost)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 16px', fontWeight: 600, borderBottom: '1px solid var(--line)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--line-subtle)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{doc.name}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <Select
                      value={doc.priority}
                      onChange={(v) => setDocumentField(doc.id, 'priority', v)}
                      options={PRIORITY_OPTIONS}
                    />
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <Input
                      value={doc.owner}
                      onChange={(e) => setDocumentField(doc.id, 'owner', e.target.value)}
                      placeholder="Owner"
                      style={{ width: '130px', padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
                    />
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <Select
                      value={doc.status}
                      onChange={(v) => setDocumentField(doc.id, 'status', v)}
                      options={STATUS_OPTIONS}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Button variant="secondary" size="sm" onClick={() => setAddOpen(true)}>+ Add Document</Button>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Document">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Document Name" fullWidth value={newDocName} onChange={(e) => setNewDocName(e.target.value)} placeholder="e.g., Code of Conduct" />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { if (newDocName.trim()) { addDocument(newDocName.trim()); setNewDocName(''); setAddOpen(false); } }}>Add</Button>
          </div>
        </div>
      </Modal>
    </SectionWrapper>
  );
}
