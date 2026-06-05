import React from 'react';

export default function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <h4 className="font-bold text-red-800 text-sm md:text-base">Hata Oluştu</h4>
          <p className="text-red-700 text-xs md:text-sm mt-1">{error}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 font-bold text-lg"
        >
          ✕
        </button>
      )}
    </div>
  );
}
