import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#4d8eff', '#45B7D1', '#96CEB4', '#FFB84D'];

export default function RegionalSalesChart({ regional }) {
  if (!regional) return null;

  const regions = [
    { name: 'Americas',     key: 'americas' },
    { name: 'Europe',       key: 'europe' },
    { name: 'Asia Pacific', key: 'asia' },
    { name: 'Other',        key: 'other' },
  ];

  const data = regions
    .map(({ name, key }) => ({
      name,
      value: regional[key]?.pct || 0,
      displayValue: regional[key]?.value || '-',
    }))
    .filter((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-surface-container border border-outline-variant rounded-lg p-3 shadow-md">
          <p className="font-body-sm text-body-sm text-on-surface font-medium">{d.name}</p>
          <p className="text-body-xs text-secondary mt-1">{d.value}% of global sales</p>
          {d.displayValue !== '-' && (
            <p className="text-body-xs text-on-surface-variant">{d.displayValue}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Regional Sales Distribution
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-1">Based on actual game sales data</p>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">public</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-surface-container-highest">
        {data.map((item, idx) => (
          <div key={item.name} className="text-center bg-surface-container-low rounded-lg p-3">
            <p className="text-body-xs font-body-xs text-on-surface-variant">{item.name}</p>
            <p className="font-headline-sm text-headline-sm text-on-surface" style={{ color: COLORS[idx % COLORS.length] }}>
              {item.value}%
            </p>
            {item.displayValue !== '-' && (
              <p className="text-body-xs font-body-xs text-on-surface-variant">{item.displayValue}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
