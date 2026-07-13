import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { hoursPerDay } from '../../lib/analytics';

export default function HoursPerDayChart() {
  const { data } = useApp();
  const chartData = hoursPerDay(data?.studySessions ?? [], data?.focusSessions ?? [], 14);

  return (
    <Card>
      <h3 className="mb-3 font-semibold">Study Hours (Last 14 Days)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={1} />
            <YAxis tick={{ fontSize: 11 }} width={30} />
            <Tooltip formatter={(v) => [`${v}h`, 'Hours']} />
            <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
