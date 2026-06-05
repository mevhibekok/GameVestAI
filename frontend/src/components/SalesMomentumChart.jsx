import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-surface-container border border-outline-variant rounded-lg p-3 shadow-md">
        <p className="font-body-sm text-body-sm text-on-surface font-medium">{d.title}</p>
        <p className="text-body-xs text-secondary mt-1">{d.sales}M global sales</p>
        <p className="text-body-xs text-on-surface-variant">Year: {d.year}</p>
      </div>
    );
  }
  return null;
};

export default function SalesMomentumChart({ similarGames = [] }) {
  if (!similarGames || similarGames.length === 0) {
    return (
      <section className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Comparable Titles: Sales by Year
        </h3>
        <p className="text-body-sm text-on-surface-variant text-center py-8">No comparable titles available</p>
      </section>
    );
  }

  const sorted = [...similarGames]
    .sort((a, b) => (a.year || 0) - (b.year || 0))
    .map((game) => ({
      year: game.year || 'N/A',
      sales: parseFloat((game.global_sales || 0).toFixed(2)),
      title: game.name || game.title || 'Unknown',
    }));

  const avgSales = (sorted.reduce((sum, d) => sum + d.sales, 0) / sorted.length).toFixed(2);

  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Comparable Titles: Sales by Year
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-1">Global sales trend of similar games</p>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">show_chart</span>
      </div>
      <div className="h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sorted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              stroke="#6b7280"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 11 }}
              label={{ value: 'Sales (M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#4d8eff"
              dot={{ fill: '#4d8eff', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={3}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-surface-container-highest">
        <div>
          <p className="text-body-xs font-body-xs text-on-surface-variant">Avg. Sales / Title</p>
          <p className="font-headline-sm text-headline-sm text-on-surface">{avgSales}M</p>
        </div>
        <div className="text-right">
          <p className="text-body-xs font-body-xs text-on-surface-variant">Titles Compared</p>
          <p className="font-headline-sm text-headline-sm text-on-surface">{sorted.length}</p>
        </div>
      </div>
    </section>
  );
}
