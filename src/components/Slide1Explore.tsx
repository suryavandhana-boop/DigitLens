import React from 'react';
import { Pencil, ArrowRight } from 'lucide-react';
import { DoodleStar, DoodlePencil, DoodleLightBulb, DoodleStudentWithBoard } from './Doodles';
import { LearningFact, MOVIE_STYLE_FACTS } from '../services/factsService';

interface Slide1ExploreProps {
  onStartExploring: () => void;
  fact?: LearningFact;
}

export const Slide1Explore: React.FC<Slide1ExploreProps> = ({
  onStartExploring,
  fact = MOVIE_STYLE_FACTS[0],
}) => {
  return (
    <section className="relative min-h-[calc(100vh-140px)] flex items-center justify-center py-12 md:py-18 bg-[#E0F2FE] overflow-hidden">
      {/* Background notebook grid pattern */}
      <div className="absolute inset-0 bg-notebook-grid opacity-35 pointer-events-none" />

      {/* Floating Animated Doodles in Background */}
      <div className="absolute top-10 left-10 hidden sm:block animate-doodle-bob pointer-events-none select-none opacity-80">
        <DoodleStar className="w-9 h-9" color="#F97316" />
      </div>
      <div className="absolute top-14 right-14 hidden sm:block animate-doodle-bob-delayed pointer-events-none select-none opacity-80">
        <DoodleLightBulb className="w-10 h-10" />
      </div>
      <div className="absolute bottom-12 left-16 hidden sm:block animate-doodle-bob-delayed pointer-events-none select-none opacity-80">
        <DoodlePencil className="w-12 h-12" />
      </div>
      <div className="absolute bottom-14 right-16 hidden sm:block animate-doodle-bob pointer-events-none select-none opacity-80">
        <DoodleStar className="w-8 h-8" color="#38BDF8" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          {/* Tagline / Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-orange-400 shadow-[2px_2px_0px_#f97316] mb-5">
            <span className="text-sm">✨</span>
            <span className="text-xs sm:text-sm font-handwriting font-bold text-orange-700 tracking-wide">
              Write it. Let AI recognize it.
            </span>
          </div>

          {/* Title: DigitLens */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            Digit<span className="text-orange-500">Lens</span>
          </h1>

          {/* Simple beginner-friendly welcome */}
          <p className="mt-3 text-lg sm:text-xl md:text-2xl text-sky-950 font-handwriting font-bold">
            Write it. Let AI recognize it.
          </p>

          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md font-medium">
            Welcome to your friendly handwriting playground! Draw numbers from 0 to 9 with pencil strokes and watch how computers read your digits.
          </p>

          {/* Start Exploring Button (Using existing button styling) */}
          <div className="mt-8 flex items-center justify-center">
            <button
              id="start-exploring-btn"
              onClick={onStartExploring}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base sm:text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <Pencil className="w-5 h-5 text-white" />
              <span>Start Exploring</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* One short, simple movie-style learning fact card */}
          <div className="mt-12 sm:mt-14 w-full max-w-lg">
            <DoodleStudentWithBoard
              badge={fact.badge || 'Did You Know? 🎬'}
              factText={fact.fact}
              subText={fact.tip}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
