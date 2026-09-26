import React from 'react';
import { Database, Sliders, Network, Cpu, Sparkles, ArrowRight } from 'lucide-react';
import { FlowStep } from '../types';
import { DoodleStar, DoodleNotebook } from './Doodles';

export const VisualFlow: React.FC = () => {
  const steps: FlowStep[] = [
    {
      step: 1,
      title: 'MNIST',
      subtitle: 'Handwriting Library',
      details: 'Thousands of real handwritten number samples from students and clerks.',
      badge: 'Step 1',
    },
    {
      step: 2,
      title: 'Preprocessing',
      subtitle: 'Crop & Center',
      details: 'Clean strokes and scale into a uniform 28×28 grayscale pixel canvas.',
      badge: 'Step 2',
    },
    {
      step: 3,
      title: 'Neural Network',
      subtitle: 'Thinking Layers',
      details: 'Layers of interconnected digital neurons checking for loops and lines.',
      badge: 'Step 3',
    },
    {
      step: 4,
      title: 'Training',
      subtitle: 'Practice Makes Perfect',
      details: 'The AI practices recognizing examples repeatedly until accuracy peaks.',
      badge: 'Step 4',
    },
    {
      step: 5,
      title: 'Prediction',
      subtitle: 'The Final Guess',
      details: 'Computes match probabilities for digits 0 to 9 and announces the winner!',
      badge: 'Step 5',
    },
  ];

  return (
    <section id="visual-flow" className="py-14 sm:py-18 bg-[#BAE6FD]/30 border-b-2 border-sky-300 relative overflow-hidden">
      {/* Background notebook grid */}
      <div className="absolute inset-0 bg-notebook-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border-2 border-sky-400 text-sky-900 text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Visual Learning Pipeline
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            How The AI Learns Your Numbers
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-950 font-medium font-handwriting text-lg">
            Follow the 5-step journey from your pencil doodle to the neural network's final guess!
          </p>
        </div>

        {/* 5-Step Notebook Index Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((item, index) => {
            const getIcon = () => {
              switch (item.step) {
                case 1:
                  return <Database className="w-5 h-5 text-sky-700" />;
                case 2:
                  return <Sliders className="w-5 h-5 text-orange-600" />;
                case 3:
                  return <Network className="w-5 h-5 text-sky-700" />;
                case 4:
                  return <Cpu className="w-5 h-5 text-orange-600" />;
                case 5:
                  return <Sparkles className="w-5 h-5 text-orange-600" />;
                default:
                  return <Cpu className="w-5 h-5 text-sky-700" />;
              }
            };

            return (
              <div key={item.step} className="flex flex-col relative">
                <div
                  id={`flow-step-${item.step}`}
                  className="bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#f97316] hover:-translate-y-1 transition-all duration-200 flex-1 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Header with Step Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 border-2 border-slate-900 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        {getIcon()}
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-300">
                        {item.badge}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-bold text-sky-800 font-handwriting text-sm mt-0.5">
                      {item.subtitle}
                    </p>

                    {/* Details */}
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-600 font-mono">
                      Step {item.step}/5
                    </span>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-orange-500 hidden md:block" />
                    )}
                  </div>
                </div>

                {/* Mobile connecting arrow */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-2 text-orange-500 font-bold text-lg">
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Playful Sequence Ribbon */}
        <div className="mt-8 bg-white rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-800">
          <span className="text-orange-600 font-handwriting text-base">✏️ Flow:</span>
          <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-lg border border-sky-300">MNIST</span>
          <span className="text-orange-500 font-bold">→</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-900 rounded-lg border border-orange-300">Preprocessing</span>
          <span className="text-orange-500 font-bold">→</span>
          <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-lg border border-sky-300">Neural Network</span>
          <span className="text-orange-500 font-bold">→</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-900 rounded-lg border border-orange-300">Training</span>
          <span className="text-orange-500 font-bold">→</span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300">Prediction</span>
        </div>
      </div>
    </section>
  );
};
