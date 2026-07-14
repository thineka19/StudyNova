import { Plus, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import type { TimeBlock } from '../../types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function blockHours(block: TimeBlock): number {
  const [sh, sm] = block.start.split(':').map(Number);
  const [eh, em] = block.end.split(':').map(Number);
  return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60);
}

export default function AvailabilityEditor() {
  const { data, setAvailability } = useApp();
  const availability = data?.availability ?? [];

  const dayBlocks = (day: number) => availability.find((a) => a.dayOfWeek === day)?.freeTimeBlocks ?? [];

  const updateDay = (day: number, blocks: TimeBlock[]) => {
    const next = DAY_NAMES.map((_, d) => ({
      dayOfWeek: d,
      freeTimeBlocks: d === day ? blocks : dayBlocks(d),
    }));
    setAvailability(next);
  };

  const addBlock = (day: number) => {
    updateDay(day, [...dayBlocks(day), { start: '19:00', end: '21:00' }]);
  };

  const removeBlock = (day: number, idx: number) => {
    updateDay(day, dayBlocks(day).filter((_, i) => i !== idx));
  };

  const editBlock = (day: number, idx: number, patch: Partial<TimeBlock>) => {
    updateDay(
      day,
      dayBlocks(day).map((b, i) => (i === idx ? { ...b, ...patch } : b)),
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {DAY_NAMES.map((name, day) => {
        const blocks = dayBlocks(day);
        const totalHours = blocks.reduce((sum, b) => sum + blockHours(b), 0);
        return (
          <Card key={day} hover>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-text-primary">{name}</h3>
              <span className="text-xs text-text-secondary">{totalHours.toFixed(1)}h free</span>
            </div>
            <div className="space-y-2">
              {blocks.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={b.start}
                    onChange={(e) => editBlock(day, idx, { start: e.target.value })}
                  />
                  <span className="text-xs text-text-secondary">to</span>
                  <Input
                    type="time"
                    value={b.end}
                    onChange={(e) => editBlock(day, idx, { end: e.target.value })}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeBlock(day, idx)}
                    aria-label="Remove time block"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addBlock(day)}
                icon={<Plus className="size-3.5" />}
                className="w-full"
              >
                Add time block
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
