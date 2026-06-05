import React, { useState, useEffect } from 'react';
import { gameAPI } from '../api/gameAPI';

export default function SearchForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    platform: '',
    genre: '',
    publisher: '',
    year: new Date().getFullYear(),
  });
  const [metadata, setMetadata] = useState({
    platforms: [],
    genres: [],
    publishers: []
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await gameAPI.getMetadata();
        setMetadata(response.data);
      } catch (error) {
        console.error('Metadata yükleme hatası:', error);
      }
    };
    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.platform && formData.genre && formData.publisher) {
      onSubmit(formData);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-4 lg:gap-4">
      {/* Platform */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <select
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Platform Seçin</option>
          {metadata.platforms?.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Genre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Türü</label>
        <select
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Türü Seçin</option>
          {metadata.genres?.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Publisher */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Yayıncı</label>
        <select
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Yayıncı Seçin</option>
          {metadata.publishers?.map(pub => (
            <option key={pub} value={pub}>{pub}</option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Yıl</label>
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-1 lg:col-span-4 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analiz Ediliyor...' : 'Analiz Et'}
        </button>
      </div>
    </form>
  );
}
