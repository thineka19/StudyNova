import { useState } from 'react';

/**
 * Narrow drag-to-reschedule hook for the Study Journey Timeline.
 * Dragging an item onto a day-column drop zone calls `onDropOnDay(itemId, dateISO)` —
 * callers wire this to `updateAssignment(id, { deadline })` / `updateExam(id, { date })`.
 */
export function useDragReorder(onDropOnDay: (itemId: string, dateISO: string) => void) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overDate, setOverDate] = useState<string | null>(null);

  const dragProps = (itemId: string) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', itemId);
      setDraggingId(itemId);
    },
    onDragEnd: () => {
      setDraggingId(null);
      setOverDate(null);
    },
  });

  const dropZoneProps = (dateISO: string) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (overDate !== dateISO) setOverDate(dateISO);
    },
    onDragLeave: () => {
      setOverDate((d) => (d === dateISO ? null : d));
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const itemId = e.dataTransfer.getData('text/plain') || draggingId;
      if (itemId) onDropOnDay(itemId, dateISO);
      setDraggingId(null);
      setOverDate(null);
    },
  });

  return { draggingId, overDate, dragProps, dropZoneProps };
}
