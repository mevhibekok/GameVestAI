import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="inline-block">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
      </div>
      <p className="text-gray-600 mt-4 text-sm md:text-base">Analiz yapılıyor lütfen bekleyiniz...</p>
    </div>
  );
}
