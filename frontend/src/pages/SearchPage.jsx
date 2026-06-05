import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const trendingSearches = [
    { icon: 'trending_up', label: 'GTA VI' },
    { icon: 'data_usage', label: 'Cyberpunk 2077' },
    { icon: 'monitoring', label: 'Elden Ring' },
    { icon: 'category', label: 'Action RPG' },
    { icon: 'sports_esports', label: 'Nintendo Switch' }
  ];

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setError('Please enter a game name');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError(`No games found matching "${query}". Try a different search.`);
          setLoading(false);
          return;
        }
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.found) {
        // Navigate to results page with game data and analysis
        navigate('/results', {
          state: {
            analysis: {
              ...data.prediction,
              similar_games: data.recommendations || [],
              game_title: data.game.name,
              // Add regional data if available
              americas_pct: Math.round((data.game.na_sales / data.game.global_sales) * 100),
              americas_value: `$${data.game.na_sales.toFixed(1)}M`,
              europe_pct: Math.round((data.game.eu_sales / data.game.global_sales) * 100),
              europe_value: `$${data.game.eu_sales.toFixed(1)}M`,
              asia_pct: Math.round((data.game.jp_sales / data.game.global_sales) * 100),
              asia_value: `$${data.game.jp_sales.toFixed(1)}M`,
              other_pct: Math.round((data.game.other_sales / data.game.global_sales) * 100),
              other_value: `$${data.game.other_sales.toFixed(1)}M`
            },
            inputData: {
              gameTitle: data.game.name,
              primaryGenre: data.game.genre,
              platforms: data.game.platform,
              releaseYear: data.game.year
            }
          }
        });
      } else {
        setError(data.message || 'Game not found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(
        err.message === 'Failed to fetch'
          ? 'Could not connect to search service. Make sure backend is running.'
          : `Error: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col px-margin-mobile md:px-margin-desktop pt-stack-xl pb-24 items-center justify-center min-h-[calc(100vh-140px)]">
      {/* Hero Section */}
      <div className="text-center max-w-md w-full mb-stack-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-md">
          Analyze Game Investment Potential
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Search game titles, publishers, genres, or platforms to start an AI-powered investment analysis.
        </p>
      </div>

      {/* Search Area */}
      <div className="w-full max-w-md mb-stack-xl">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setError(null);
            }}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSearch(searchQuery)}
            placeholder="Search game titles..."
            disabled={loading}
            className="w-full bg-surface-container border border-outline-variant rounded-xl py-4 pl-12 pr-4 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm placeholder:text-outline disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {loading && (
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin">
              autorenew
            </span>
          )}
        </div>
        {error && (
          <div className="mt-stack-sm bg-error/10 border border-error rounded-lg p-stack-sm text-error text-body-sm">
            {error}
          </div>
        )}
      </div>

      {/* Trending Searches */}
      <div className="w-full max-w-md">
        <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm ml-1">TRENDING</h2>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((search) => (
            <button
              key={search.label}
              onClick={() => handleSearch(search.label)}
              disabled={loading}
              className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-full font-body-sm text-body-sm text-on-surface hover:bg-surface-container-high hover:border-outline transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {search.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
