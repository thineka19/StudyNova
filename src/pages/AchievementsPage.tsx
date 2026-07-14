import { Award, Lock, Trophy } from 'lucide-react';
import Card from '../components/common/Card';
import ProgressOrb from '../components/common/ProgressOrb';
import { useApp } from '../context/AppContext';
import { xpToNextLevel } from '../lib/xp';

export default function AchievementsPage() {
  const { data } = useApp();
  const xp = data?.xp ?? { totalXP: 0, level: 1, badges: [] };
  const progress = xpToNextLevel(xp.totalXP);

  return (
    <div className="space-y-4 animate-fade-in">
      <Card variant="glass" className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/15 text-accent">
            <Trophy className="size-6" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Level {progress.level}</p>
            <p className="text-xl font-semibold text-text-primary">{xp.totalXP} Total XP</p>
          </div>
        </div>
        <ProgressOrb value={(progress.current / progress.needed) * 100} size={110} tone="warning" label={`Lvl ${progress.level + 1}`} sublabel={`${progress.current}/${progress.needed} XP`} />
      </Card>

      <Card>
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
          <Award className="size-4 text-accent" /> Badges
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {xp.badges.map((b) => (
            <div
              key={b.id}
              className={`relative flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border p-4 text-center transition-all duration-200 ${
                b.unlockedAt
                  ? 'border-warning/30 bg-warning/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-warning/10'
                  : 'border-border bg-surface opacity-50'
              }`}
            >
              {!b.unlockedAt && <Lock className="absolute right-2 top-2 size-3.5 text-text-secondary" />}
              <span className="text-3xl">{b.icon}</span>
              <p className="text-sm font-medium text-text-primary">{b.name}</p>
              <p className="text-[11px] text-text-secondary">{b.description}</p>
              {!b.unlockedAt && <p className="text-[10px] text-text-secondary">Locked</p>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
