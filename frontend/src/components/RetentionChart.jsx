import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function RetentionChart({ metrics }) {
  const data = [
    { day: 'Day 1', retention: metrics.retention.day1 },
    { day: 'Day 7', retention: metrics.retention.day7 },
    { day: 'Day 30', retention: metrics.retention.day30 }
  ];

  const COLORS = ['#4d8eff', '#FFB84D', '#FF6B6B'];

  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Player Retention Metrics
        </h3>
        <span className="material-symbols-outlined text-outline text-[18px]">group</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" />
            <YAxis label={{ value: 'Retention (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="retention" fill="#4d8eff" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-surface-container-highest">
        {data.map((item, idx) => (
          <div key={item.day} className="bg-surface-container-low p-3 rounded-lg text-center">
            <p className="text-body-xs font-body-xs text-on-surface-variant mb-1">{item.day}</p>
            <p className="text-headline-md font-headline-md" style={{ color: COLORS[idx] }}>
              {item.retention}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
