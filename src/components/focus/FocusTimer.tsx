import { useEffect, useRef, useState } from 'react';
import Card from '../common/Card';
import { primaryButtonClass, secondaryButtonClass } from '../common/formStyles';
import { useApp } from '../../context/AppContext';
import type { FocusSessionType } from '../../types';

const MODES: { type: FocusSessionType; label: string; workMins: number; breakMins: number }[] = [
  { type: '25', label: '25 min Focus', workMins: 25, breakMins: 5 },
  { type: '50', label: '50 min Deep Focus', workMins: 50, breakMins: 10 },
];

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function FocusTimer() {
  const { addFocusSession } = useApp();
  const [modeIdx, setModeIdx] = useState(0);
  const mode = MODES[modeIdx];
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [secondsLeft, setSecondsLeft] = useState(mode.workMins * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setPhase('work');
    setSecondsLeft(mode.workMins * 60);
    setRunning(false);
  }, [mode.workMins]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (secondsLeft > 0) return;
    setRunning(false);
    if (phase === 'work') {
      addFocusSession(mode.type, mode.workMins);
      setPhase('break');
      setSecondsLeft(mode.breakMins * 60);
    } else {
      setPhase('work');
      setSecondsLeft(mode.workMins * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const totalSeconds = (phase === 'work' ? mode.workMins : mode.breakMins) * 60;
  const progressPct = 100 - (secondsLeft / totalSeconds) * 100;

  const reset = () => {
    setRunning(false);
    setPhase('work');
    setSecondsLeft(mode.workMins * 60);
  };

  return (
    <Card className="flex flex-col items-center gap-5 py-8">
      <div className="flex gap-2">
        {MODES.map((m, idx) => (
          <button
            key={m.type}
            type="button"
            onClick={() => setModeIdx(idx)}
            disabled={running}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              idx === modeIdx
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-8 border-slate-100 dark:border-slate-800">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${phase === 'work' ? '#6366f1' : '#10b981'} ${progressPct}%, transparent ${progressPct}%)`,
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
          }}
        />
        <div className="text-center">
          <p className="text-4xl font-bold tabular-nums">{formatTime(secondsLeft)}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
            {phase === 'work' ? 'Focus' : 'Break'}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => setRunning((r) => !r)} className={primaryButtonClass}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button type="button" onClick={reset} className={secondaryButtonClass}>
          Reset
        </button>
      </div>
    </Card>
  );
}
