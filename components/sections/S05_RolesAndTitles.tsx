'use client';
import { useState } from 'react';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input, { Select } from '../ui/Input';
import MotionCapture from '../meeting/MotionCapture';

export default function S05_RolesAndTitles() {
  const roles = useMeetingStore((s) => s.roles);
  const setRoleCandidate = useMeetingStore((s) => s.setRoleCandidate);
  const setRoleStatus = useMeetingStore((s) => s.setRoleStatus);
  const setRoleNotes = useMeetingStore((s) => s.setRoleNotes);
  const addRole = useMeetingStore((s) => s.addRole);
  const [motionOpen, setMotionOpen] = useState(false);

  return (
    <SectionWrapper sectionId="s05">
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(49,214,196,0.06)' }}>
                {['Role', 'Candidate', 'Status', 'Notes'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', color: 'var(--text-ghost)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 16px', fontWeight: 600, borderBottom: '1px solid var(--line)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role, idx) => (
                <tr key={role.id} style={{ borderBottom: '1px solid var(--line-subtle)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', minWidth: '180px' }}>
                    {role.role || (
                      <Input
                        value={role.role}
                        onChange={(e) => {
                          const s = useMeetingStore.getState();
                          if (s.roles.some((r) => r.id === role.id)) {
                            useMeetingStore.setState({
                              roles: s.roles.map((r) => (r.id === role.id ? { ...r, role: e.target.value } : r)),
                            });
                          }
                        }}
                        placeholder="Role title"
                        style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                      />
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Input
                      value={role.candidate}
                      onChange={(e) => setRoleCandidate(role.id, e.target.value)}
                      placeholder="Name"
                      style={{ fontSize: '0.85rem', padding: '6px 10px', borderRadius: '8px', minWidth: '120px' }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Select
                      value={role.status}
                      onChange={(v) => setRoleStatus(role.id, v as typeof role.status)}
                      options={[
                        { value: 'confirmed', label: 'Confirmed' },
                        { value: 'provisional', label: 'Provisional' },
                        { value: 'tabled', label: 'Tabled' },
                        { value: 'vacant', label: 'Vacant' },
                      ]}
                    />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Input
                      value={role.notes}
                      onChange={(e) => setRoleNotes(role.id, e.target.value)}
                      placeholder="Notes..."
                      style={{ fontSize: '0.85rem', padding: '6px 10px', borderRadius: '8px', minWidth: '150px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button variant="ghost" size="sm" onClick={addRole}>+ Add Role</Button>
        <Button variant="secondary" size="sm" onClick={() => setMotionOpen(true)}>📋 Capture Motion</Button>
      </div>

      <MotionCapture isOpen={motionOpen} onClose={() => setMotionOpen(false)} />
    </SectionWrapper>
  );
}
