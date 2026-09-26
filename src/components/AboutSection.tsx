import React from 'react';
import { Eye, BookOpen, CheckCircle, Code, ShieldCheck, Heart, Sparkles, Pencil } from 'lucide-react';
import { GreenBoardCard, DoodleStar, DoodlePencil } from './Doodles';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-14 sm:py-20 bg-[#E0F2FE] relative overflow-hidden">
      {/* Background notebook grid pattern */}
      <div className="absolute inset-0 bg-notebook-grid opacity-35 pointer-events-none" />

      {/* Floating doodles */}
      <div className="absolute top-8 left-10 hidden sm:block animate-doodle-bob pointer-events-none select-none opacity-50">
        <DoodlePencil className="w-10 h-10" />
      </div>
      <div className="absolute bottom-8 right-12 hidden sm:block animate-doodle-bob-delayed pointer-events-none select-none opacity-60">
        <DoodleStar className="w-8 h-8" color="#F97316" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border-2 border-orange-400 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Classroom Story
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            About DigitLens
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-950 font-handwriting text-lg">
            Handwritten Digit Recognition Using Neural Networks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main narrative notebook card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-[5px_5px_0px_#0f172a] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 border-2 border-slate-900 text-white flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
                  <Pencil className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-slate-900">
                    The Friendly AI Handwriting Lab
                  </h3>
                  <p className="text-xs font-bold text-orange-600 font-handwriting text-sm">
                    Making Artificial Intelligence intuitive, fun, and transparent
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900 font-bold">DigitLens</strong> is an interactive educational learning playground that illustrates how computers learn to read human handwriting using deep artificial neural networks.
              </p>

              <p className="text-sm text-slate-700 leading-relaxed mt-3">
                Instead of hiding behind black-box mystique, DigitLens gives you an open drawing canvas, lets you see the raw 28×28 grayscale sensor feed with your own eyes, and outlines the exact multi-layer architecture used in modern computer vision.
              </p>

              <div className="mt-6 pt-5 border-t-2 border-slate-100">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Core Architectural Pillars
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Real-time HTML5 28×28 downsampler</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Python & TensorFlow/Keras ready</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Discrete 10-digit classification (0–9)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Touch & desktop handwriting pad</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-sky-100/90 border-2 border-slate-900 text-xs text-sky-950 flex flex-wrap items-center justify-between gap-2 shadow-xs">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                Zero Fake Predictions Policy
              </span>
              <span className="font-mono font-bold px-2 py-0.5 rounded-lg bg-white text-orange-600 border border-orange-300">
                Real Model Loaded
              </span>
            </div>
          </div>

          {/* Right Column: Chalkboard fact + Specs card */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Cute Green Blackboard Card */}
            <GreenBoardCard
              badge="Educational Trivia"
              fact="The famous MNIST dataset has 70,000 real handwritten digits written by high school students and US Census workers!"
              tip="DigitLens mirrors this exact 28×28 spatial format."
            />

            {/* Tech Stack Specs Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a]">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-slate-100">
                <span className="text-xl">⚙️</span>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Engineering Stack Specifications
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
                  <div className="font-bold text-slate-900">Training Benchmark</div>
                  <div className="text-slate-600 mt-0.5">
                    MNIST Benchmark (60k training samples, 10k test samples)
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200">
                  <div className="font-bold text-slate-900">Deep Learning Model</div>
                  <div className="text-slate-600 mt-0.5">
                    Python + TensorFlow/Keras Sequential Dense Layers
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
                  <div className="font-bold text-slate-900">Classification Targets</div>
                  <div className="text-slate-600 mt-0.5">
                    Digits 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 with Softmax probability
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
