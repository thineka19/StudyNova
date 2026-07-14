import { PieChart as PieChartIcon } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { hoursBySubject } from '../../lib/analytics';

export default function SubjectHoursChart() {
  const { data } = useApp();
  const chartData = hoursBySubject(data?.studySessions ?? [], data?.subjects ?? []);

  return (
    <Card className="animate-fade-in">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
        <PieChartIcon className="size-4 text-accent" /> Hours by Subject
      </h3>
      {chartData.length === 0 ? (
        <EmptyState
          icon={<PieChartIcon className="size-5" />}
          title="No study hours yet"
          subtitle="Complete some study sessions to see this chart."
        />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="hours" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {chartData.map((entry) => (
                  <Cell key={entry.subjectId} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${v}h`, 'Hours']}
                contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-glass-border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--color-text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
