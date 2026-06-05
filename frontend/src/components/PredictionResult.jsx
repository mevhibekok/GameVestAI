import React from 'react';

export default function PredictionResult({ prediction }) {
  if (!prediction) return null;

  const getRecommendationColor = (level) => {
    switch (level) {
      case 'recommend_investment':
        return 'bg-green-50 border-green-200';
      case 'needs_review':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const getRecommendationBadgeColor = (level) => {
    switch (level) {
      case 'recommend_investment':
        return 'bg-secondary text-white';
      case 'needs_review':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-red-500 text-white';
    }
  };

  const getRecommendationText = (level) => {
    switch (level) {
      case 'recommend_investment':
        return '✓ Yatırım Önerilir';
      case 'needs_review':
        return '⚠ İnceleme Gerekli';
      default:
        return '✗ Riskli Yatırım';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-4 md:p-6 ${getRecommendationColor(prediction.recommendation_level)}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol taraf - Temel bilgiler */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Analiz Sonuçları</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Platform</p>
              <p className="font-semibold text-gray-800">{prediction.platform}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Türü</p>
              <p className="font-semibold text-gray-800">{prediction.genre}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Yayıncı</p>
              <p className="font-semibold text-gray-800">{prediction.publisher}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Yıl</p>
              <p className="font-semibold text-gray-800">{prediction.year}</p>
            </div>
          </div>
        </div>

        {/* Sağ taraf - Tahmin ve olasılık */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Tahmin</h3>
          <div className="space-y-4">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getRecommendationBadgeColor(prediction.recommendation_level)}`}>
                {getRecommendationText(prediction.recommendation_level)}
              </span>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-2">İyi Yatırım Olasılığı</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${prediction.good_investment_probability * 100}%` }}
                  />
                </div>
                <span className="font-bold text-lg text-primary">
                  {(prediction.good_investment_probability * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Eşik: {(prediction.threshold * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
