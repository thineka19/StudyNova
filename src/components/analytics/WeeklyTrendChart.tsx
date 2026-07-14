import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { weeklyTrend } from '../../lib/analytics';

export default function WeeklyTrendChart() {
  const { data } = useApp();
  const chartData = weeklyTrend(data?.studySessions ?? [], data?.focusSessions ?? [], 8);

  return (
    <Card className="animate-fade-in">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
        <TrendingUp className="size-4 text-accent" /> Weekly Productivity Trend
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-text-secondary)" opacity={0.15} />
            <XAxis dataKey="weekLabel" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} width={30} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-glass-border)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
            />
            <Line type="monotone" dataKey="hours" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} name="Hours" />
            <Line type="monotone" dataKey="tasksCompleted" stroke="var(--color-success)" strokeWidth={2} dot={{ r: 3 }} name="Tasks" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
