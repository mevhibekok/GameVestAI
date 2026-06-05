import React from 'react';

const REASON_META = {
  'Same genre':              { label: 'Same Genre',         icon: 'category' },
  'Same platform':           { label: 'Same Platform',      icon: 'sports_esports' },
  'Same publisher':          { label: 'Same Publisher',     icon: 'business' },
  'Close release year':      { label: 'Close Release Year', icon: 'calendar_today' },
  'High global sales':       { label: 'High Global Sales',  icon: 'trending_up' },
  'Strong regional diversity':{ label: 'Regional Diversity', icon: 'public' },
  'Similar game profile':    { label: 'Similar Profile',    icon: 'content_copy' },
};

const COLORS = ['#4d8eff', '#45B7D1', '#96CEB4', '#FFB84D', '#FF8C69', '#B8A9FF', '#FF6B6B'];

export default function SimilarityBreakdownChart({ similarGames = [] }) {
  if (!similarGames || similarGames.length === 0) return null;

  // Count each reason across all similar games
  const counts = {};
  similarGames.forEach((game) => {
    const reasons = (game.Why_Recommended || 'Similar game profile').split(', ');
    reasons.forEach((r) => {
      const key = r.trim();
      counts[key] = (counts[key] || 0) + 1;
    });
  });

  const total = similarGames.length;
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({
      key,
      label: REASON_META[key]?.label || key,
      icon: REASON_META[key]?.icon || 'check_circle',
      count,
      pct: Math.round((count / total) * 100),
    }));

  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Similarity / Match Breakdown
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Why comparable titles were selected — across {total} similar games
          </p>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">hub</span>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {sorted.map((item, idx) => (
          <div key={item.key} className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-[18px] flex-shrink-0"
              style={{ color: COLORS[idx % COLORS.length] }}
            >
              {item.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-body-sm font-body-sm text-on-surface truncate">{item.label}</span>
                <span className="text-body-xs font-body-xs text-on-surface-variant ml-2 flex-shrink-0">
                  {item.count}/{total} titles
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${item.pct}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                />
              </div>
            </div>
            <span className="text-body-xs font-body-xs text-on-surface-variant w-9 text-right flex-shrink-0">
              {item.pct}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
