import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SalesMomentumChart from '../components/SalesMomentumChart';
import ComparableBenchmarkChart from '../components/ComparableBenchmarkChart';
import SimilarityBreakdownChart from '../components/SimilarityBreakdownChart';
import RegionalSalesChart from '../components/RegionalSalesChart';

export default function AnalysisResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisData = location.state?.analysis || {};
  const inputData = location.state?.inputData || {};

  // Map model predictions to user-friendly recommendations (Türkçe)
  const getRecommendationInfo = (prediction) => {
    const colorMap = {
      'good_investment': { rgb: '77, 142, 255', hex: '#4d8eff' },  // secondary blue
      'needs_review': { rgb: '255, 184, 77', hex: '#ffb84d' },    // tertiary orange
      'risky_investment': { rgb: '255, 107, 107', hex: '#ff6b6b' }  // error red
    };

    const recommendations = {
      'good_investment': {
        text: 'Invest',
        color: 'bg-secondary/20 text-secondary border border-secondary/30',
        bgColor: 'secondary',
        colorHex: colorMap['good_investment'].hex,
        colorRgb: colorMap['good_investment'].rgb,
        description: ''
      },
      'needs_review': {
        text: 'Review',
        color: 'bg-tertiary/20 text-tertiary border border-tertiary/30',
        bgColor: 'tertiary',
        colorHex: colorMap['needs_review'].hex,
        colorRgb: colorMap['needs_review'].rgb,
        description: ''
      },
      'risky_investment': {
        text: 'Avoid',
        color: 'bg-error/20 text-error border border-error/30',
        bgColor: 'error',
        colorHex: colorMap['risky_investment'].hex,
        colorRgb: colorMap['risky_investment'].rgb,
        description: ''
      }
    };
    return recommendations[prediction] || recommendations['needs_review'];
  };

  // Calculate metrics from model data
  const confidence = Math.round((analysisData.good_investment_probability || 0.5) * 100);
  const recommendationInfo = getRecommendationInfo(analysisData.prediction || 'needs_review');

  // Regional data is only real when it comes from the search flow (has actual sales columns)
  const hasRealRegionalData = analysisData.americas_pct !== undefined && analysisData.americas_pct !== null;

  const metrics = {
    recommendation: recommendationInfo.text,
    recommendationStyle: recommendationInfo.color,
    colorHex: recommendationInfo.colorHex,
    colorRgb: recommendationInfo.colorRgb,
    description: recommendationInfo.description,
    confidence,
    regional: hasRealRegionalData ? {
      americas: { pct: analysisData.americas_pct, value: analysisData.americas_value || '-' },
      europe:   { pct: analysisData.europe_pct,   value: analysisData.europe_value   || '-' },
      asia:     { pct: analysisData.asia_pct,      value: analysisData.asia_value     || '-' },
      other:    { pct: analysisData.other_pct ?? Math.max(0, 100 - analysisData.americas_pct - analysisData.europe_pct - analysisData.asia_pct), value: analysisData.other_value || '-' },
    } : null,
  };

  // Use API response for similar games or empty array
  const similarGames = analysisData.similar_games || analysisData.recommendations || [];

  return (
    <main className="flex-grow flex flex-col gap-stack-lg p-margin-mobile md:px-gutter max-w-container-max mx-auto w-full pb-24">
      {/* Page Header */}
      <section className="flex flex-col gap-stack-sm mt-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display-lg md:text-headline-lg text-on-surface">
            {inputData.gameTitle || analysisData.game_title || 'Analysis Results'}
          </h2>
          <span className={`${metrics.recommendationStyle} font-label-caps text-label-caps px-2 py-0.5 rounded-sm flex items-center gap-1`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            {metrics.recommendation}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant flex flex-wrap items-center gap-2">
          {analysisData.developer && <span>Developed by {analysisData.developer}</span>}
          <span className="text-outline text-xs">•</span>
          <span>{inputData.primaryGenre || analysisData.primary_genre || 'Game'}</span>
          {inputData.platforms && (
            <>
              <span className="text-outline text-xs">•</span>
              <span>{inputData.platforms}</span>
            </>
          )}
          {inputData.releaseYear && (
            <>
              <span className="text-outline text-xs">•</span>
              <span>Target: {inputData.releaseYear}</span>
            </>
          )}
        </p>
      </section>

      {/* Key Metric Card: AI Recommendation */}
      <section className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md relative overflow-hidden group hover:border-outline transition-colors">
        <div 
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl transition-all duration-500 pointer-events-none"
          style={{
            backgroundColor: `rgba(${metrics.colorRgb}, 0.1)`,
          }}
        ></div>
        <div className="relative z-10">
          <div className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-4 tracking-wider">
            AI Recommendation
          </div>
          <div className="text-[64px] font-display-lg leading-tight mb-2" style={{color: metrics.colorHex}}>
            {metrics.recommendation}
          </div>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {metrics.description}
          </p>
        </div>
        <div className="relative z-10 mt-6 pt-6 border-t border-surface-container-highest">
          <div className="flex justify-between items-end mb-2">
            <span className="text-body-sm font-body-sm text-on-surface-variant">Investment Confidence</span>
            <span className="text-headline-md font-headline-md text-on-surface">{metrics.confidence}%</span>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-1000"
              style={{ width: `${metrics.confidence}%`, backgroundColor: metrics.colorHex }}
            />
          </div>

        </div>
      </section>

      {/* Charts Grid: Benchmark + Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
        <ComparableBenchmarkChart similarGames={similarGames} />
        <SalesMomentumChart similarGames={similarGames} />
      </div>

      {/* Similarity / Reason Breakdown */}
      <SimilarityBreakdownChart similarGames={similarGames} />

      {/* Regional Distribution — only when real sales data is available (search flow) */}
      {metrics.regional && <RegionalSalesChart regional={metrics.regional} />}

      {/* Similar Games */}
      <section className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-stack-md tracking-wider">
          Similar Titles
        </h3>
        <div className="flex flex-col gap-4">
          {similarGames && similarGames.length > 0 ? (
            similarGames.map((game, idx) => (
              <div key={`game-${idx}`} className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
                <div className="flex justify-between items-start mb-stack-md">
                  <h4 className="font-body-md text-body-md text-on-surface font-medium">{game.name || game.title || 'Unknown'}</h4>
                  <span className="bg-surface-variant px-2 py-1 rounded text-[10px] font-label-caps text-on-surface-variant tracking-wider">
                    {Math.round((game.Similarity || game.match || 0) * 100)}% Match
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 pt-4 border-t border-outline-variant/50">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">Platform</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{game.platform || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">Genre</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{game.genre || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">Publisher</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{game.publisher_grouped || game.publisher || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">Global Sales</span>
                    <span className="font-body-sm text-body-sm text-on-surface">${(game.global_sales || game.sales || 0).toFixed(1)}M</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">Year</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{game.year || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">Why Recommended</span>
                    <span className="font-body-xs text-body-xs text-secondary">{game.Why_Recommended || 'Similar profile'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-body-md text-on-surface-variant p-6 text-center">No similar games found yet</p>
          )}
        </div>
      </section>
    </main>
  );
}
