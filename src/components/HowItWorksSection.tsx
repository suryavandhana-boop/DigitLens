import React from 'react';
import { Network, Sliders, Cpu, Binary, Sparkles, Pencil } from 'lucide-react';
import { LayerSpec } from '../types';
import { DoodleLightBulb, DoodlePencil, DoodleStar } from './Doodles';

export const HowItWorksSection: React.FC = () => {
  const modelLayers: LayerSpec[] = [
    {
      name: '1. Pixel Input Grid',
      type: '28×28 Flatten (784)',
      outputShape: '784 pixel values',
      description: 'Reads each of the 784 squares from your drawing as grayscale brightness numbers.',
    },
    {
      name: '2. Pattern Detector Layer',
      type: 'Dense (128 Neurons) + ReLU',
      outputShape: '128 hidden signals',
      description: 'Checks for individual stroke features like sharp corners, curved loops, and straight lines.',
    },
    {
      name: '3. Dropout Guard',
      type: 'Dropout Rate 0.20',
      outputShape: 'Prevents overfitting',
      description: 'Randomly turns off 20% of neuron signals so the AI doesn\'t just memorize one drawing style.',
    },
    {
      name: '4. Shape Assembly Layer',
      type: 'Dense (64 Neurons) + ReLU',
      outputShape: '64 combined features',
      description: 'Combines simple lines into complete digit components (e.g., top bar + vertical stick for a 7).',
    },
    {
      name: '5. Final Winner Softmax',
      type: 'Dense (10 Neurons) + Softmax',
      outputShape: '10 probabilities (0–9)',
      description: 'Generates final confidence percentages for each number from 0 to 9. Highest score wins!',
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-[#BAE6FD]/20 border-b-2 border-sky-300 relative overflow-hidden">
      {/* Playful background doodles */}
      <div className="absolute top-10 right-10 hidden sm:block animate-doodle-bob pointer-events-none select-none opacity-60">
        <DoodleLightBulb className="w-10 h-10" />
      </div>
      <div className="absolute bottom-10 left-10 hidden sm:block animate-doodle-pulse pointer-events-none select-none opacity-60">
        <DoodleStar className="w-8 h-8" color="#F97316" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border-2 border-orange-400 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Classroom Lesson
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            How The Neural Network Thinks
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-950 font-handwriting text-lg">
            Let's open the digital textbook and see how math and neurons recognize your numbers!
          </p>
        </div>

        {/* 3 Core Conceptual Notebook Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#f97316] hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 mb-4 shadow-xs">
              <Sliders className="w-6 h-6 text-sky-700" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900">1. Ink to Pixels</h3>
            <p className="text-xs font-bold text-orange-600 font-handwriting text-sm mt-0.5">
              Preprocessing & Centering
            </p>
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              When you draw on the canvas, your strokes are cropped, centered, and scaled down to a 28×28 grid of 784 tiny square cells. Each cell gets a number from 0 (white paper) to 1 (black ink).
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#f97316] hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 mb-4 shadow-xs">
              <Network className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900">2. Pattern Detective</h3>
            <p className="text-xs font-bold text-orange-600 font-handwriting text-sm mt-0.5">
              Hidden Neural Layers
            </p>
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              Hundreds of artificial neurons look for signature patterns. Some look for the round circle of a zero or eight, while others search for the straight vertical stroke of a one or four.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#f97316] hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 mb-4 shadow-xs">
              <Binary className="w-6 h-6 text-sky-700" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900">3. The Final Vote</h3>
            <p className="text-xs font-bold text-orange-600 font-handwriting text-sm mt-0.5">
              Softmax Probability
            </p>
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              The output layer counts up votes for digits 0 to 9 using a formula called Softmax. All probabilities add up to 100%, and the digit with the highest score is chosen as the winner!
            </p>
          </div>
        </div>

        {/* Neural Network Anatomy Textbook Card */}
        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[5px_5px_0px_#0f172a] overflow-hidden">
          <div className="px-6 py-4 bg-sky-100/90 border-b-2 border-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                Inside the AI Brain: Neural Network Architecture
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-orange-600 border border-orange-400">
              Keras Sequential Model
            </span>
          </div>

          <div className="p-6 divide-y-2 divide-slate-100 space-y-4">
            {modelLayers.map((layer, idx) => (
              <div
                key={idx}
                className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-900 shadow-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {layer.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {layer.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center shrink-0 pl-11 sm:pl-0">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
                    {layer.type}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                    {layer.outputShape}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
