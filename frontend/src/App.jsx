import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AnalysisFormPage from './pages/AnalysisFormPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import './index.css';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-on-background dark:bg-background dark:text-on-background">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/analyze" element={<AnalysisFormPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/results" element={<AnalysisResultsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
