import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const gameAPI = {
  // Health check
  health: () => apiClient.get('/health'),
  
  // Get metadata (genres, platforms, publishers)
  getMetadata: () => apiClient.get('/metadata'),
  
  // Predict investment opportunity
  predict: (data) => apiClient.post('/predict', {
    platform: data.platform,
    genre: data.genre,
    publisher: data.publisher,
    year: data.year
  }),
  
  // Get game recommendations
  getRecommendations: (data) => apiClient.post('/recommend', {
    platform: data.platform,
    genre: data.genre,
    publisher: data.publisher,
    year: data.year,
    top_n: data.topN || 5
  }),
  
  // Comprehensive analysis
  analyze: (data) => apiClient.post('/analyze', {
    platform: data.platform,
    genre: data.genre,
    publisher: data.publisher,
    year: data.year,
    top_n: data.topN || 5
  })
};

export default apiClient;
