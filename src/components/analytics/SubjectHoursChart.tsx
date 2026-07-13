import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { hoursBySubject } from '../../lib/analytics';

export default function SubjectHoursChart() {
  const { data } = useApp();
  const chartData = hoursBySubject(data?.studySessions ?? [], data?.subjects ?? []);

  return (
    <Card>
      <h3 className="mb-3 font-semibold">Hours by Subject</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-slate-400">Complete some study sessions to see this chart.</p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="hours" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {chartData.map((entry) => (
                  <Cell key={entry.subjectId} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}h`, 'Hours']} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
