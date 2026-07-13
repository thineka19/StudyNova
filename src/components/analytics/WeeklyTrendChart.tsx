import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { weeklyTrend } from '../../lib/analytics';

export default function WeeklyTrendChart() {
  const { data } = useApp();
  const chartData = weeklyTrend(data?.studySessions ?? [], data?.focusSessions ?? [], 8);

  return (
    <Card>
      <h3 className="mb-3 font-semibold">Weekly Productivity Trend</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="weekLabel" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={30} />
            <Tooltip />
            <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Hours" />
            <Line type="monotone" dataKey="tasksCompleted" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Tasks" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
