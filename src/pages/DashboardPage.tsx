import StatsRow from '../components/dashboard/StatsRow';
import TodayTasks from '../components/dashboard/TodayTasks';
import PriorityList from '../components/dashboard/PriorityList';
import UpcomingList from '../components/dashboard/UpcomingList';
import RiskWarnings from '../components/dashboard/RiskWarnings';
import { useApp } from '../context/AppContext';
import { secondaryButtonClass } from '../components/common/formStyles';

export default function DashboardPage() {
  const { regenerateSchedule } = useApp();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Schedules and priorities recompute automatically as you make changes.</p>
        <button type="button" onClick={() => regenerateSchedule()} className={secondaryButtonClass}>
          ↻ Refresh
        </button>
      </div>

      <StatsRow />
      <RiskWarnings />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TodayTasks />
        <PriorityList />
      </div>

      <UpcomingList />
    </div>
  );
}
