import React, { useState } from 'react';
import { Menu, X, Sparkles, Pencil } from 'lucide-react';

interface HeaderProps {
  currentSlide: number;
  onSelectSlide: (slide: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentSlide, onSelectSlide }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const slides = [
    { id: 1, label: '1. Explore' },
    { id: 2, label: '2. Writing Board' },
    { id: 3, label: '3. Challenge & Scoreboard' },
  ];

  const handleSlideClick = (id: number) => {
    onSelectSlide(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#E0F2FE]/95 backdrop-blur-md border-b-2 border-sky-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div
            id="brand-logo"
            onClick={() => handleSlideClick(1)}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-orange-500 border-2 border-slate-900 flex items-center justify-center text-white shadow-[2px_2px_0px_#0f172a] group-hover:rotate-6 transition-transform duration-200">
              <Pencil className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  Digit<span className="text-orange-500">Lens</span>
                </span>
              </div>
              <p className="text-xs text-sky-900 font-handwriting font-bold hidden md:block">
                ✏️ Write it. Let AI recognize it.
              </p>
            </div>
          </div>

          {/* Desktop Navigation for the 3 Simple Slides */}
          <nav className="hidden md:flex items-center gap-2">
            {slides.map((slide) => {
              const isActive = currentSlide === slide.id;
              return (
                <button
                  key={slide.id}
                  id={`nav-slide-${slide.id}`}
                  onClick={() => handleSlideClick(slide.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-orange-600 border-2 border-orange-400 shadow-[2px_2px_0px_#f97316]'
                      : 'text-slate-800 hover:text-orange-600 hover:bg-sky-200/80 border border-transparent'
                  }`}
                >
                  {slide.label}
                </button>
              );
            })}

            {/* Quick Action button */}
            {currentSlide === 1 ? (
              <button
                id="header-start-btn"
                onClick={() => handleSlideClick(2)}
                className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer active:scale-95"
              >
                <Pencil className="w-4 h-4" />
                <span>Start Drawing</span>
              </button>
            ) : currentSlide === 2 ? (
              <button
                id="header-challenge-btn"
                onClick={() => handleSlideClick(3)}
                className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer active:scale-95"
              >
                <span>Take Challenge</span>
                <span>→</span>
              </button>
            ) : null}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-sky-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t-2 border-sky-300 space-y-1.5 bg-[#E0F2FE]">
            {slides.map((slide) => (
              <button
                key={slide.id}
                id={`mobile-nav-slide-${slide.id}`}
                onClick={() => handleSlideClick(slide.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  currentSlide === slide.id
                    ? 'bg-white text-orange-600 border-2 border-orange-400'
                    : 'text-slate-800 hover:bg-sky-200/80'
                }`}
              >
                {slide.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
