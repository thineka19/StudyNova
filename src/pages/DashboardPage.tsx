import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarPlus, GraduationCap, RefreshCw, Timer } from 'lucide-react';
import StatsRow from '../components/dashboard/StatsRow';
import TodayTasks from '../components/dashboard/TodayTasks';
import PriorityList from '../components/dashboard/PriorityList';
import UpcomingList from '../components/dashboard/UpcomingList';
import RiskWarnings from '../components/dashboard/RiskWarnings';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressOrb from '../components/common/ProgressOrb';
import StreakFlame from '../components/common/StreakFlame';
import EnergyLevelIndicator from '../components/common/EnergyLevelIndicator';
import FloatingActionButton from '../components/common/FloatingActionButton';
import Reveal from '../components/common/Reveal';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { todayISO } from '../lib/dateUtils';

export default function DashboardPage() {
  const { data, derived, regenerateSchedule } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = todayISO();

  const todaySessions = useMemo(() => (data?.studySessions ?? []).filter((s) => s.date === today), [data, today]);
  const completionPct = todaySessions.length
    ? Math.round((todaySessions.filter((s) => s.completed).length / todaySessions.length) * 100)
    : 0;
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.durationMins, 0);
  const energyLevel = todayMinutes >= 150 ? 'high' : todayMinutes >= 60 ? 'med' : 'low';

  const topPriority = derived.priorities[0];
  const subjectName = topPriority
    ? data?.subjects.find((s) => s.name === topPriority.subjectName)?.name ?? topPriority.subjectName
    : null;

  return (
    <div className="space-y-4 animate-fade-in">
      <Card variant="glass" className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(50% 60% at 15% 0%, rgba(0,45,127,0.35), transparent 65%), radial-gradient(40% 50% at 100% 100%, rgba(0,40,118,0.3), transparent 60%)',
          }}
        />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <p className="text-sm text-text-secondary">
              Good {greeting()}, {user?.name.split(' ')[0] ?? 'there'}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-text-primary">Your focus today</h1>
            {topPriority ? (
              <>
                <p className="mt-2 text-lg font-semibold text-accent">&ldquo;{topPriority.title}&rdquo;</p>
                <p className="mt-1 text-sm text-text-secondary">
                  {subjectName} · {topPriority.daysLeft >= 0 ? `${topPriority.daysLeft} days remaining` : 'overdue'}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-text-secondary">No urgent priorities right now — great work staying ahead.</p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-5">
              <StreakFlame days={derived.currentStreakDays} />
              <EnergyLevelIndicator level={energyLevel} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button icon={<Timer className="size-4" />} onClick={() => navigate('/focus')}>
                Start Focus Session
              </Button>
              <Button
                variant="secondary"
                icon={<RefreshCw className="size-4" />}
                onClick={() => regenerateSchedule()}
              >
                Refresh Plan
              </Button>
            </div>
          </div>

          <div className="flex shrink-0 justify-center">
            <ProgressOrb value={completionPct} size={140} label="Today's plan" tone="success" />
          </div>
        </div>
      </Card>

      <Reveal><StatsRow /></Reveal>
      <Reveal><RiskWarnings /></Reveal>

      <Reveal>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TodayTasks />
          <PriorityList />
        </div>
      </Reveal>

      <Reveal><UpcomingList /></Reveal>

      <FloatingActionButton
        actions={[
          { label: 'New Subject', icon: <BookOpen className="size-4" />, onClick: () => navigate('/subjects?new=subject') },
          { label: 'New Assignment', icon: <CalendarPlus className="size-4" />, onClick: () => navigate('/subjects?new=assignment') },
          { label: 'New Exam', icon: <GraduationCap className="size-4" />, onClick: () => navigate('/subjects?new=exam') },
        ]}
      />
    </div>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
