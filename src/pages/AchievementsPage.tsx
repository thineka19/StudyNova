import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { useApp } from '../context/AppContext';
import { xpToNextLevel } from '../lib/xp';

export default function AchievementsPage() {
  const { data } = useApp();
  const xp = data?.xp ?? { totalXP: 0, level: 1, badges: [] };
  const progress = xpToNextLevel(xp.totalXP);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Level</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{progress.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Total XP</p>
            <p className="text-xl font-semibold">{xp.totalXP}</p>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={(progress.current / progress.needed) * 100} colorClass="bg-amber-500" />
          <p className="mt-1 text-xs text-slate-400">
            {progress.current} / {progress.needed} XP to level {progress.level + 1}
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-semibold">Badges</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {xp.badges.map((b) => (
            <div
              key={b.id}
              className={`flex flex-col items-center gap-1 rounded-xl border p-4 text-center ${
                b.unlockedAt
                  ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
                  : 'border-slate-200 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <span className="text-3xl">{b.icon}</span>
              <p className="text-sm font-medium">{b.name}</p>
              <p className="text-[11px] text-slate-500">{b.description}</p>
              {!b.unlockedAt && <p className="text-[10px] text-slate-400">Locked</p>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
