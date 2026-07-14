import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import type { FocusSessionType } from '../../types';

const MODES: { type: FocusSessionType; label: string; workMins: number; breakMins: number }[] = [
  { type: '25', label: '25 min Focus', workMins: 25, breakMins: 5 },
  { type: '50', label: '50 min Deep Focus', workMins: 50, breakMins: 10 },
];

const MOTIVATION = [
  'Small consistent sessions beat marathon cramming.',
  'One focused block at a time — that\'s the whole plan.',
  'Deep work compounds. Stay with it.',
  'Your future self is thanking you already.',
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
  const { addFocusSession, derived } = useApp();
  const [modeIdx, setModeIdx] = useState(0);
  const currentSubject = derived.priorities[0]?.subjectName;
  const motivation = useMemo(() => MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)], []);
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
    <div className="relative overflow-hidden rounded-[var(--radius-lg)]">
      {running && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 animate-focus-breathe"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 40%, rgba(0,45,127,0.5), transparent 70%)',
          }}
        />
      )}
      <Card variant={running ? 'glass' : 'solid'} className="flex flex-col items-center gap-5 py-10 transition-colors duration-300">
        {currentSubject && (
          <p className="text-sm text-text-secondary">
            Focusing on <span className="font-semibold text-accent">{currentSubject}</span>
          </p>
        )}

        <div className="flex gap-2">
          {MODES.map((m, idx) => (
            <button
              key={m.type}
              type="button"
              onClick={() => setModeIdx(idx)}
              disabled={running}
              className={`rounded-[var(--radius-full)] px-4 py-1.5 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed ${
                idx === modeIdx
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative flex h-72 w-72 items-center justify-center rounded-full border-8 border-border">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${phase === 'work' ? '#002D7F' : '#22C55E'} ${progressPct}%, transparent ${progressPct}%)`,
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
            }}
          />
          <div className="text-center">
            <p className="text-5xl font-bold tabular-nums text-text-primary">{formatTime(secondsLeft)}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-text-secondary">
              {phase === 'work' ? 'Focus' : 'Break'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setRunning((r) => !r)}
            icon={running ? <Pause className="size-4" /> : <Play className="size-4" />}
          >
            {running ? 'Pause' : 'Start'}
          </Button>
          <Button variant="secondary" onClick={reset} icon={<RotateCcw className="size-4" />}>
            Reset
          </Button>
        </div>

        <p className="max-w-xs text-center text-xs text-text-secondary">{motivation}</p>
      </Card>
    </div>
  );
}
