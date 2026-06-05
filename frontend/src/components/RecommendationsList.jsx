import React from 'react';

export default function RecommendationsList({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 md:mt-8">
      <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-4">Önerilen Oyunlar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((game, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border-l-4 border-primary">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-gray-800 text-sm md:text-base flex-1">{game.Name}</h4>
              <span className="text-xl ml-2">#${index + 1}</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Platform</p>
                  <p className="font-semibold text-gray-700">{game.Platform}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Yıl</p>
                  <p className="font-semibold text-gray-700">{game.Year}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Türü</p>
                  <p className="font-semibold text-gray-700">{game.Genre}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Yayıncı</p>
                  <p className="font-semibold text-gray-700 truncate">{game.Publisher}</p>
                </div>
              </div>

              {/* Similarity Score */}
              {game.Similarity !== undefined && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-1">Benzerlik Oranı</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-secondary h-full transition-all duration-500"
                        style={{ width: `${Math.min(game.Similarity * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-secondary text-xs">
                      {(game.Similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Sales if available */}
              {game.Global_Sales !== undefined && (
                <div className="text-xs">
                  <p className="text-gray-500">Küresel Satış</p>
                  <p className="font-semibold text-gray-700">${parseFloat(game.Global_Sales).toFixed(2)}M</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
