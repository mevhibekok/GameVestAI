import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-surface-container border border-outline-variant rounded-lg p-3 shadow-md">
        <p className="font-body-sm text-body-sm text-on-surface font-medium">{d.fullName}</p>
        <p className="text-body-xs text-secondary mt-1">{d.sales}M global sales</p>
        <p className="text-body-xs text-on-surface-variant">{d.similarity}% match · {d.year}</p>
      </div>
    );
  }
  return null;
};

export default function ComparableBenchmarkChart({ similarGames = [] }) {
  if (!similarGames || similarGames.length === 0) {
    return (
      <section className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Comparable Titles Sales Benchmark
        </h3>
        <p className="text-body-sm text-on-surface-variant text-center py-8">No comparable titles available</p>
      </section>
    );
  }

  const data = similarGames.map((game) => {
    const rawName = game.name || game.title || 'Unknown';
    return {
      name: rawName.length > 14 ? rawName.slice(0, 14) + '…' : rawName,
      fullName: rawName,
      sales: parseFloat((game.global_sales || 0).toFixed(2)),
      similarity: Math.round((game.Similarity || 0) * 100),
      year: game.year || '-',
    };
  });

  const maxSales = Math.max(...data.map((d) => d.sales));
  const avgSales = (data.reduce((sum, d) => sum + d.sales, 0) / data.length).toFixed(2);

  const getBarColor = (sales) => {
    const ratio = maxSales > 0 ? sales / maxSales : 0;
    if (ratio >= 0.7) return '#4d8eff';
    if (ratio >= 0.4) return '#45B7D1';
    return '#96CEB4';
  };

  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Comparable Titles Sales Benchmark
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-1">Global sales of similar games (M units)</p>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">bar_chart</span>
      </div>

      <div className="h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 44 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              tick={{ fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 11 }}
              label={{ value: 'Sales (M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={parseFloat(avgSales)}
              stroke="#FFB84D"
              strokeDasharray="4 3"
              label={{ value: 'Avg', position: 'right', fontSize: 10, fill: '#FFB84D' }}
            />
            <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.sales)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-surface-container-highest">
        <div>
          <p className="text-body-xs font-body-xs text-on-surface-variant">Peer Average</p>
          <p className="font-headline-sm text-headline-sm text-on-surface">{avgSales}M</p>
        </div>
        <div className="text-right">
          <p className="text-body-xs font-body-xs text-on-surface-variant">Best Comparable</p>
          <p className="font-headline-sm text-headline-sm text-secondary">{maxSales.toFixed(2)}M</p>
        </div>
      </div>
    </section>
  );
}
