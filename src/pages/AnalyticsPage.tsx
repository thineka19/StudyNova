import HoursPerDayChart from '../components/analytics/HoursPerDayChart';
import SubjectHoursChart from '../components/analytics/SubjectHoursChart';
import WeeklyTrendChart from '../components/analytics/WeeklyTrendChart';
import WeeklyReportCard from '../components/analytics/WeeklyReportCard';
import Reveal from '../components/common/Reveal';

export default function AnalyticsPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <WeeklyReportCard />
      <Reveal>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <HoursPerDayChart />
          <SubjectHoursChart />
        </div>
      </Reveal>
      <Reveal><WeeklyTrendChart /></Reveal>
    </div>
  );
}
