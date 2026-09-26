import React from 'react';
import { ArrowRight, Pencil, Sparkles, Brain, Compass, HelpCircle } from 'lucide-react';
import {
  DoodleStudentWithBoard,
  DoodlePencil,
  DoodleLightBulb,
  DoodleNotebook,
  DoodleStar,
} from './Doodles';

interface HeroSectionProps {
  onStartRecognition: () => void;
  onExploreFlow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartRecognition,
  onExploreFlow,
}) => {
  const playgroundHighlights = [
    {
      id: 'digits',
      title: 'Digits 0 to 9',
      subtitle: 'Ten Unique Numbers',
      description: 'From curvy eights to straight ones, each digit has its own secret shape signature.',
      badge: '🎨 Explore',
      icon: '0–9',
    },
    {
      id: 'patterns',
      title: 'Pattern Detective',
      subtitle: 'Loops & Stroke Curves',
      description: 'The smart network inspects horizontal lines, loops, and hooks in your handwriting.',
      badge: '🔍 Shapes',
      icon: '🧠',
    },
    {
      id: 'pixels',
      title: 'Digital Canvas',
      subtitle: 'Instant Pixel Grid',
      description: 'Your drawings are centered and transformed into a neat 28×28 square coordinate grid.',
      badge: '📐 28×28',
      icon: '✏️',
    },
    {
      id: 'brain',
      title: 'Smart AI Brain',
      subtitle: 'Neural Network Layers',
      description: 'Layers of connected digital neurons work in harmony to make the final prediction.',
      badge: '⚡ Learn',
      icon: '💡',
    },
  ];

  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-22 bg-[#E0F2FE] border-b-2 border-sky-300 overflow-hidden">
      {/* Playful Dotted Grid Background */}
      <div className="absolute inset-0 bg-notebook-grid opacity-35 pointer-events-none" />

      {/* Floating Animated Doodles in Background Corners */}
      <div className="absolute top-10 left-6 sm:left-14 hidden sm:block animate-doodle-bob pointer-events-none select-none">
        <DoodlePencil className="w-12 h-12" />
      </div>

      <div className="absolute top-16 right-8 sm:right-20 hidden sm:block animate-doodle-bob-delayed pointer-events-none select-none">
        <DoodleLightBulb className="w-10 h-10" />
      </div>

      <div className="absolute bottom-12 left-8 hidden lg:block animate-doodle-pulse pointer-events-none select-none">
        <DoodleNotebook className="w-12 h-12" />
      </div>

      <div className="absolute top-28 left-1/4 hidden md:block animate-doodle-bob pointer-events-none select-none opacity-60">
        <DoodleStar className="w-6 h-6" color="#F97316" />
      </div>

      <div className="absolute top-1/2 right-10 hidden md:block animate-doodle-bob-delayed pointer-events-none select-none opacity-70">
        <DoodleStar className="w-7 h-7" color="#FBBF24" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Cute Badge with Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-orange-400 shadow-[2px_2px_0px_#f97316] mb-5">
            <span className="text-sm">✨</span>
            <span className="text-xs sm:text-sm font-handwriting font-bold text-orange-700 tracking-wide">
              Write it. Let AI recognize it.
            </span>
          </div>

          {/* User Requested Main Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            Teach AI to Read Your <span className="text-orange-500 underline decoration-wavy decoration-orange-400">Handwriting</span>
          </h1>

          {/* User Requested Subtitle */}
          <p className="mt-4 text-lg sm:text-xl text-sky-950 font-medium max-w-2xl mx-auto">
            Draw a digit and let AI recognize it.
          </p>

          {/* Action Button Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-start-recognition-btn"
              onClick={onStartRecognition}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base sm:text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <Pencil className="w-5 h-5 text-white" />
              <span>Start Recognition</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="hero-how-it-works-btn"
              onClick={onExploreFlow}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-bold text-slate-800 bg-white hover:bg-sky-50 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer"
            >
              <Compass className="w-5 h-5 text-orange-500" />
              <span>Explore How AI Learns</span>
            </button>
          </div>
        </div>

        {/* Doodle Character with Green Chalkboard Card */}
        <div className="mt-12 sm:mt-14 max-w-2xl mx-auto">
          <DoodleStudentWithBoard
            badge="Did you know?"
            factText="AI learns from examples just like you learn your ABCs!"
            subText="Every digit has its own pattern!"
          />
        </div>

        {/* Fun Educational Notebook Cards (Replacing sterile technical dataset cards) */}
        <div className="mt-14 sm:mt-18">
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">📓</span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                Inside the Digital Notebook
              </h2>
            </div>
            <span className="text-xs font-handwriting font-bold text-sky-900 bg-white px-3 py-1 rounded-full border border-sky-300">
              Interactive AI Playground
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {playgroundHighlights.map((item) => (
              <div
                key={item.id}
                id={`playground-card-${item.id}`}
                className="bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#f97316] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-sky-100 border-2 border-slate-900 flex items-center justify-center font-heading font-bold text-lg text-slate-900 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                      {item.icon}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-orange-600 mt-0.5 font-handwriting text-sm">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
