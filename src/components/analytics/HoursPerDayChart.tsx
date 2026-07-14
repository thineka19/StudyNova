import { BarChart3 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { hoursPerDay } from '../../lib/analytics';

export default function HoursPerDayChart() {
  const { data } = useApp();
  const chartData = hoursPerDay(data?.studySessions ?? [], data?.focusSessions ?? [], 14);

  return (
    <Card className="animate-fade-in">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
        <BarChart3 className="size-4 text-accent" /> Study Hours (Last 14 Days)
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-text-secondary)" opacity={0.15} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} interval={1} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} width={30} />
            <Tooltip
              formatter={(v) => [`${v}h`, 'Hours']}
              contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-glass-border)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
              cursor={{ fill: 'rgba(91,141,239,0.08)' }}
            />
            <Bar dataKey="hours" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
