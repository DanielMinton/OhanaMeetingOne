'use client';
import { useMeetingStore } from '@/lib/store';
import SectionWrapper from '../meeting/SectionWrapper';
import Card, { Callout } from '../ui/Card';
import Input, { Textarea } from '../ui/Input';
import DraggablePriorityList from '../meeting/DraggablePriorityList';

export default function S09_WebsiteDigital() {
  const webPriorities = useMeetingStore((s) => s.webPriorities);
  const webOwner = useMeetingStore((s) => s.webOwner);
  const webReviewer = useMeetingStore((s) => s.webReviewer);
  const webNotes = useMeetingStore((s) => s.webNotes);
  const setWebPriorities = useMeetingStore((s) => s.setWebPriorities);
  const setWebOwner = useMeetingStore((s) => s.setWebOwner);
  const setWebReviewer = useMeetingStore((s) => s.setWebReviewer);
  const setWebNotes = useMeetingStore((s) => s.setWebNotes);

  return (
    <SectionWrapper sectionId="s09">
      <Callout accent="teal">
        <div style={{ color: 'var(--teal)', fontWeight: 700, marginBottom: '2px' }}>Current Site</div>
        <div style={{ color: 'var(--text-secondary)', fontFamily: '"JetBrains Mono", monospace' }}>ohanarecovery.org</div>
      </Callout>

      <Card>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', fontFamily: '"Outfit", sans-serif' }}>
          Update Priorities — drag to reorder
        </div>
        <DraggablePriorityList items={webPriorities} onChange={setWebPriorities} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Web Publishing Owner"
          fullWidth
          value={webOwner}
          onChange={(e) => setWebOwner(e.target.value)}
          placeholder="Who manages the site?"
        />
        <Input
          label="Web Publishing Reviewer"
          fullWidth
          value={webReviewer}
          onChange={(e) => setWebReviewer(e.target.value)}
          placeholder="Who reviews before publishing?"
        />
      </div>

      <Textarea
        label="Notes"
        fullWidth
        value={webNotes}
        onChange={(e) => setWebNotes(e.target.value)}
        placeholder="Website and digital infrastructure discussion notes..."
        rows={4}
      />
    </SectionWrapper>
  );
}
