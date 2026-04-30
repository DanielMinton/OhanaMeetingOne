'use client';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card from '../ui/Card';
import Input, { Textarea } from '../ui/Input';

const DONATION_CHECKS = [
  { key: 'accept-now', label: 'Donations accepted now or planned for later?' },
  { key: 'who-receives', label: 'Who receives, tracks, and reports funds?' },
  { key: 'donation-type', label: 'Are donations personal, project, or organizational?' },
  { key: 'tax-verified', label: 'Tax deductibility claim verified?' },
];

export default function S08_BudgetDonations() {
  const budgetItems = useMeetingStore((s) => s.budgetItems);
  const donationNotes = useMeetingStore((s) => s.donationNotes);
  const donationChecklist = useMeetingStore((s) => s.donationChecklist);
  const setBudgetCost = useMeetingStore((s) => s.setBudgetCost);
  const setBudgetOwner = useMeetingStore((s) => s.setBudgetOwner);
  const setDonationNotes = useMeetingStore((s) => s.setDonationNotes);
  const toggleDonationCheck = useMeetingStore((s) => s.toggleDonationCheck);

  const totalMonthly = budgetItems.reduce((sum, b) => sum + b.monthlyCost, 0);
  const totalAnnual = totalMonthly * 12;

  return (
    <SectionWrapper sectionId="s08">
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(49,214,196,0.06)' }}>
                {['Category', 'Tool / Expense', 'Monthly ($)', 'Annual ($)', 'Owner'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', color: 'var(--text-ghost)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 16px', fontWeight: 600, borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {budgetItems.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line-subtle)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '10px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.category}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.tool}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <Input
                      type="number"
                      value={item.monthlyCost || ''}
                      onChange={(e) => setBudgetCost(item.id, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      style={{ width: '90px', padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
                    />
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--teal)', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
                    ${(item.monthlyCost * 12).toFixed(2)}
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <Input
                      value={item.owner}
                      onChange={(e) => setBudgetOwner(item.id, e.target.value)}
                      placeholder="Owner"
                      style={{ width: '120px', padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
                    />
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--line)', background: 'rgba(49,214,196,0.05)' }}>
                <td colSpan={2} style={{ padding: '12px 16px', color: 'var(--teal)', fontWeight: 700, fontSize: '0.85rem' }}>TOTAL</td>
                <td style={{ padding: '12px 16px', color: 'var(--teal)', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 }}>${totalMonthly.toFixed(2)}</td>
                <td style={{ padding: '12px 16px', color: 'var(--teal)', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 }}>${totalAnnual.toFixed(2)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', fontFamily: '"Outfit", sans-serif' }}>Donation Readiness</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {DONATION_CHECKS.map((item) => (
            <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div
                onClick={() => toggleDonationCheck(item.key)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  border: `2px solid ${donationChecklist[item.key] ? 'var(--teal)' : 'var(--line)'}`,
                  background: donationChecklist[item.key] ? 'var(--teal)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {donationChecklist[item.key] && <span style={{ color: '#07090b', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <Textarea
        label="Donation Discussion Notes"
        fullWidth
        value={donationNotes}
        onChange={(e) => setDonationNotes(e.target.value)}
        placeholder="Notes from the donation discussion..."
        rows={3}
      />
    </SectionWrapper>
  );
}
