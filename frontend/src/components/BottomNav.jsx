import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/home';
    if (path === '/analyze') return location.pathname === '/analyze' || location.pathname === '/results';
    return location.pathname === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile py-3 bg-surface-container/90 backdrop-blur-lg border-t border-outline-variant shadow-lg rounded-t-xl">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-colors ${
          isActive('/')
            ? 'text-secondary bg-secondary-container/20'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined mb-1">info</span>
        <span className="font-label-caps text-label-caps text-[10px]">About</span>
      </Link>

      <Link
        to="/search"
        className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-colors ${
          isActive('/search')
            ? 'text-secondary bg-secondary-container/20'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined mb-1">search</span>
        <span className="font-label-caps text-label-caps text-[10px]">Search</span>
      </Link>

      <Link
        to="/analyze"
        className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-colors ${
          isActive('/analyze')
            ? 'text-secondary bg-secondary-container/20'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined mb-1">monitoring</span>
        <span className="font-label-caps text-label-caps text-[10px]">Analyze</span>
      </Link>
    </nav>
  );
}
