import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchableSelect from '../components/SearchableSelect';

export default function AnalysisFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gameTitle: '',
    platform: '',
    genre: '',
    publisher: '',
    releaseYear: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({
    genres: [],
    platforms: [],
    publishers: [],
    years: []
  });

  // Metadata yükle
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/metadata');
        if (response.ok) {
          const data = await response.json();
          setOptions({
            genres: data.genres || [],
            platforms: data.platforms || [],
            publishers: data.publishers || [],
            years: (data.years || []).map(year => year.toString())
          });
        }
      } catch (err) {
        console.error('Metadata yükleme hatası:', err);
      }
    };

    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.gameTitle.trim()) {
      setError('Lütfen oyun adını girin');
      setLoading(false);
      return;
    }
    if (!formData.genre) {
      setError('Lütfen bir türü seçin');
      setLoading(false);
      return;
    }
    if (!formData.platform) {
      setError('Lütfen bir platformu seçin');
      setLoading(false);
      return;
    }
    if (!formData.publisher) {
      setError('Lütfen bir yayıncıyı seçin');
      setLoading(false);
      return;
    }
    if (!formData.releaseYear) {
      setError('Lütfen bir yayın yılını seçin');
      setLoading(false);
      return;
    }

    try {
      const API_BASE_URL = 'http://localhost:5000';

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: formData.platform,
          genre: formData.genre,
          publisher: formData.publisher,
          year: parseInt(formData.releaseYear),
          top_n: 5
        })
      });

      if (!response.ok) {
        throw new Error(`API hatası: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Combine prediction and recommendations into one data object
      const analysisData = {
        ...result.prediction,
        similar_games: result.recommendations || [],
        game_title: formData.gameTitle
      };

      // Sonuçları /results sayfasına gönder
      navigate('/results', { 
        state: { 
          analysis: analysisData,
          inputData: formData
        } 
      });
    } catch (err) {
      console.error('API isteği hatası:', err);
      setError(
        err.message === 'Failed to fetch'
          ? 'Sunucuya bağlanılamıyor. Flask backend\'inin çalıştığından emin olun (http://localhost:5000)'
          : `Hata: ${err.message}`
      );
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow px-margin-mobile py-stack-lg flex flex-col gap-stack-lg max-w-3xl mx-auto w-full pb-24">
      {/* Header Section */}
      <header className="px-margin-mobile pt-stack-xl pb-stack-lg border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-40 backdrop-blur-md -mx-margin-mobile px-margin-mobile">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-xs tracking-tight">
          Project Analysis Terminal
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Configure the parameters for AI evaluation.
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-error/10 border border-error rounded-lg p-stack-md flex gap-stack-md items-start">
          <span className="material-symbols-outlined text-error flex-shrink-0 mt-1">error</span>
          <div className="flex-grow">
            <p className="font-body-md text-body-md text-error">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-error hover:bg-error/10 rounded-full p-1 flex-shrink-0 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-stack-lg">
        {/* Basic Information Card */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-stack-sm flex items-center gap-2 border-b border-outline-variant pb-2">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Input Parameters
          </h2>

          {/* Game Title */}
          <div className="flex flex-col gap-stack-xs">
            <label className="font-body-sm text-body-sm text-on-surface" htmlFor="gameTitle">
              Game Title
            </label>
            <input
              id="gameTitle"
              type="text"
              value={formData.gameTitle}
              onChange={handleChange}
              placeholder="e.g., Project Nebula"
              className="bg-surface-container-lowest font-body-md text-body-md rounded-lg px-4 py-3 w-full transition-colors border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline"
            />
          </div>

          {/* Genre - Searchable Select */}
          <SearchableSelect
            label="Genre"
            id="genre"
            value={formData.genre}
            onChange={handleChange}
            options={options.genres}
            placeholder="Search or select genre..."
            allowCustom={true}
            fallbackValue="Misc"
          />

          {/* Platform - Searchable Select */}
          <SearchableSelect
            label="Target Platform"
            id="platform"
            value={formData.platform}
            onChange={handleChange}
            options={options.platforms}
            placeholder="Search or select platform..."
            allowCustom={true}
            fallbackValue={options.platforms[0]}
          />

          {/* Publisher - Searchable Select */}
          <SearchableSelect
            label="Publisher"
            id="publisher"
            value={formData.publisher}
            onChange={handleChange}
            options={options.publishers}
            placeholder="Search or select publisher..."
            allowCustom={true}
            fallbackValue="Other"
          />

          {/* Release Year - Searchable Select */}
          <SearchableSelect
            label="Target Release Year"
            id="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
            options={options.years}
            placeholder="Search or enter year..."
            allowCustom={true}
            fallbackValue={options.years[options.years.length - 1]}
          />
        </div>

        {/* Action Area */}
        <div className="mt-auto pt-stack-lg">
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-headline-md text-headline-md rounded-xl py-4 px-6 flex items-center justify-center gap-2 transition-all duration-300 ${
              loading
                ? 'bg-secondary/50 text-on-secondary/50 cursor-not-allowed'
                : 'bg-secondary hover:bg-green-600 text-on-secondary shadow-[0_0_20px_rgba(78,222,163,0.3)] hover:shadow-[0_0_30px_rgba(78,222,163,0.5)] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">hourglass_bottom</span>
                ANALYZING...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  analytics
                </span>
                RUN ANALYSIS
              </>
            )}
          </button>
          <p className="text-center font-label-caps text-label-caps text-on-surface-variant mt-stack-md opacity-70">
            {loading ? 'AI modeli analiz yapıyor...' : 'Estimated processing time: ~45s'}
          </p>
        </div>
      </form>
    </main>
  );
}
