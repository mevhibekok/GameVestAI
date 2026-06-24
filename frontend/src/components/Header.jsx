import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/home';
    if (path === '/analyze') return location.pathname === '/analyze' || location.pathname === '/results';
    return location.pathname === path;
  };

  const navClass = (path) =>
    isActive(path)
      ? 'font-body-md text-body-md text-primary font-semibold border-b-2 border-primary pb-px flex items-center h-full transition-colors'
      : 'font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full';

  return (
    <header className="bg-surface dark:bg-surface border-b border-outline-variant dark:border-outline-variant w-full sticky top-0 z-50">
      <div className="relative flex items-center justify-center w-full px-margin-desktop h-16 max-w-container-max mx-auto">
        {/* Brand */}
        <div className="absolute left-margin-desktop flex items-center gap-stack-md">
          <span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-on-surface tracking-tight">
            GameVestAI
          </span>
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-gutter h-full">
          <Link to="/" className={navClass('/')}>
            About
          </Link>
          <Link to="/search" className={navClass('/search')}>
            Search
          </Link>
          <Link to="/analyze" className={navClass('/analyze')}>
            Analyze
          </Link>
        </nav>
      </div>
    </header>
  );
}
