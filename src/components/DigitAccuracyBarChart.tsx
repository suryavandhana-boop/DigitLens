import React from 'react';
import { DigitAccuracy } from '../types';
import { BarChart3, Award, HelpCircle } from 'lucide-react';

interface DigitAccuracyBarChartProps {
  stats: DigitAccuracy[];
}

export const DigitAccuracyBarChart: React.FC<DigitAccuracyBarChartProps> = ({ stats }) => {
  // Find highest and lowest accuracy digits
  const sorted = [...stats].sort((a, b) => b.accuracy - a.accuracy);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold text-slate-900">
                Per-Digit Recognition Rates (0–9)
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Tested across 2,000 real MNIST test samples
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Best: Digit {highest.digit} ({highest.accuracy}%)</span>
          </div>
        </div>

        {/* 10 Digit Accuracy Rows */}
        <div className="space-y-2 my-2">
          {stats.map((s) => {
            const isHighest = s.digit === highest.digit;
            const isLowest = s.digit === lowest.digit;

            return (
              <div
                key={s.digit}
                className="flex items-center gap-2.5 sm:gap-3 text-xs p-1 rounded-xl hover:bg-sky-50/70 transition-colors"
              >
                {/* Digit Icon Badge */}
                <div
                  className={`w-7 h-7 rounded-xl font-mono font-bold flex items-center justify-center text-xs shrink-0 border ${
                    isHighest
                      ? 'bg-orange-500 text-white border-slate-900 shadow-[1px_1px_0px_#0f172a]'
                      : 'bg-sky-100 text-slate-900 border-sky-300'
                  }`}
                >
                  {s.digit}
                </div>

                {/* Accuracy Bar Container */}
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isHighest
                        ? 'bg-emerald-500'
                        : s.accuracy >= 95
                        ? 'bg-orange-500'
                        : s.accuracy >= 90
                        ? 'bg-sky-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>

                {/* Stats Numbers */}
                <div className="flex items-center gap-2 w-28 sm:w-32 justify-end shrink-0 font-mono">
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    {s.correct}/{s.total}
                  </span>
                  <span className="text-xs font-bold text-slate-900 w-12 text-right">
                    {s.accuracy}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-Digit Observation Box */}
      <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-start gap-2 text-xs text-sky-950 bg-sky-50/80 p-3 rounded-xl border border-sky-200">
        <HelpCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-slate-900">Pattern Insight:</strong> Digit 1 achieved the highest accuracy (
          {highest.accuracy}%) due to distinct vertical strokes. Digit 8 ({lowest.accuracy}%) has the greatest
          handwriting variation because unevenly closed loops can be confused with 3, 5, or 6.
        </span>
      </div>
    </div>
  );
};
