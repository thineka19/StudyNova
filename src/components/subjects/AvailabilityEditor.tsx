import Card from '../common/Card';
import { inputClass, primaryButtonClass, dangerButtonClass } from '../common/formStyles';
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
          <Card key={day}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">{name}</h3>
              <span className="text-xs text-slate-400">{totalHours.toFixed(1)}h free</span>
            </div>
            <div className="space-y-2">
              {blocks.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="time"
                    className={inputClass}
                    value={b.start}
                    onChange={(e) => editBlock(day, idx, { start: e.target.value })}
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <input
                    type="time"
                    className={inputClass}
                    value={b.end}
                    onChange={(e) => editBlock(day, idx, { end: e.target.value })}
                  />
                  <button type="button" onClick={() => removeBlock(day, idx)} className={dangerButtonClass}>
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addBlock(day)} className={`${primaryButtonClass} w-full text-xs`}>
                + Add time block
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
