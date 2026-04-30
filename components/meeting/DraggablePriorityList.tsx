'use client';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WebPriority } from '@/lib/types';

interface DraggablePriorityListProps {
  items: WebPriority[];
  onChange: (items: WebPriority[]) => void;
}

function SortableItem({ item, index }: { item: WebPriority; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-panel-soft)',
        border: '1px solid var(--line)',
        borderRadius: '10px',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.85 : 1,
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      <div
        {...attributes}
        {...listeners}
        style={{ color: 'var(--text-ghost)', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: '2px', padding: '2px' }}
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '3px' }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor' }} />
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor' }} />
          </div>
        ))}
      </div>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(49,214,196,0.12)', border: '1px solid rgba(49,214,196,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>
        {index + 1}
      </div>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.name}</span>
    </div>
  );
}

export default function DraggablePriorityList({ items, onChange }: DraggablePriorityListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = items.findIndex((i) => i.id === active.id);
      const newIdx = items.findIndex((i) => i.id === over.id);
      onChange(arrayMove(items, oldIdx, newIdx));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, idx) => (
            <SortableItem key={item.id} item={item} index={idx} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
