import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    navigate('/analyze');
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-xl pb-24">
      {/* Hero Section */}
      <div className="text-center max-w-3xl w-full mb-stack-xl">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-md tracking-tight">
          Game Investment Analysis Platform
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">
          AI-powered analysis for evaluating game investment potential. Get comprehensive insights on market trends, 
          competitive landscapes, and financial projections.
        </p>
      </div>

      {/* Featured Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter w-full max-w-4xl mb-stack-xl">
        {/* Card 1 */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
          <span className="material-symbols-outlined text-primary text-[32px]">trending_up</span>
          <h3 className="font-headline-md text-headline-md text-on-surface">Market Analysis</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Deep dive into market trends, genre performance, and competitive landscapes.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
          <span className="material-symbols-outlined text-secondary text-[32px]">analytics</span>
          <h3 className="font-headline-md text-headline-md text-on-surface">AI Predictions</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Machine learning models provide data-driven investment recommendations.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md hover:border-outline transition-colors">
          <span className="material-symbols-outlined text-tertiary text-[32px]">assessment</span>
          <h3 className="font-headline-md text-headline-md text-on-surface">Detailed Reports</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Comprehensive reports with risk assessment and opportunity scoring.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleStartAnalysis}
        className="bg-primary hover:bg-primary-fixed text-on-primary font-headline-md text-headline-md rounded-xl py-4 px-12 flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:shadow-[0_0_35px_rgba(173,198,255,0.5)] active:scale-95"
      >
        <span className="material-symbols-outlined">explore</span>
        Start Analysis
      </button>

      {/* Secondary Info */}
      <div className="mt-stack-xl pt-stack-xl border-t border-outline-variant max-w-3xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
          <div className="flex flex-col gap-stack-sm">
            <h4 className="font-headline-md text-headline-md text-on-surface">Why GameVestAI?</h4>
            <ul className="font-body-sm text-body-sm text-on-surface-variant space-y-2">
              <li>✓ Real-time market data integration</li>
              <li>✓ Multi-factor analysis model</li>
              <li>✓ Historical accuracy tracking</li>
              <li>✓ Expert-validated insights</li>
            </ul>
          </div>
          <div className="flex flex-col gap-stack-sm">
            <h4 className="font-headline-md text-headline-md text-on-surface">Get Started</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Enter basic game information and let our AI analyze investment potential in seconds.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              No account required. Free analysis with optional premium reports.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
