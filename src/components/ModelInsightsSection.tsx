import React, { useState } from 'react';
import { REAL_MODEL_INSIGHTS } from '../services/modelInsightsData';
import { RealTestSample } from '../types';
import { TrainingCurvesChart } from './TrainingCurvesChart';
import { DigitAccuracyBarChart } from './DigitAccuracyBarChart';
import { MNISTSampleCanvas } from './MNISTSampleCanvas';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Award,
  BarChart,
  Eye,
  Info,
} from 'lucide-react';
import { DoodleStar } from './Doodles';

export const ModelInsightsSection: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<RealTestSample | null>(
    REAL_MODEL_INSIGHTS.testSamples[0]
  );

  const {
    testAccuracy,
    evaluatedSamples,
    totalCorrect,
    perDigitStats,
    trainingHistory,
    testSamples,
  } = REAL_MODEL_INSIGHTS;

  return (
    <section
      id="model-insights"
      className="py-14 sm:py-20 bg-[#F0F9FF] border-b-2 border-sky-300 relative overflow-hidden"
    >
      {/* Background Notebook Ruled Lines */}
      <div className="absolute inset-0 bg-notebook-ruled opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border-2 border-orange-400 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <BarChart className="w-3.5 h-3.5 text-orange-600" />
            Empirical Neural Network Performance
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Model Insights & Real Accuracy
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-950 font-handwriting text-lg">
            Evaluated on real unseen digits from the official MNIST test set (t10k). Real loss curves, genuine test images, and per-digit statistics.
          </p>
        </div>

        {/* Top Metric Cards: Real Accuracy Benchmarks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {/* Card 1: Real Test Accuracy */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Real Test Accuracy
              </span>
              <span className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                🎯
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl sm:text-5xl font-bold text-slate-900">
                {testAccuracy}%
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Official t10k
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 font-medium">
              {totalCorrect.toLocaleString()} out of {evaluatedSamples.toLocaleString()} unseen test digits classified correctly.
            </p>
          </div>

          {/* Card 2: Training Convergence */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Training Accuracy
              </span>
              <span className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                ⚡
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl sm:text-5xl font-bold text-slate-900">
                97.6%
              </span>
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                Epoch 7
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 font-medium">
              Categorical cross-entropy loss minimized to 0.0794 with Adam optimization.
            </p>
          </div>

          {/* Card 3: Neural Architecture */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Model Architecture
              </span>
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                <Layers className="w-4 h-4" />
              </span>
            </div>
            <div className="font-heading text-2xl font-bold text-slate-900 font-mono">
              784 → 128 → 64 → 10
            </div>
            <p className="mt-2 text-xs text-slate-600 font-medium">
              Multilayer Perceptron (MLP) with ReLU activations and 20% Dropout regularization.
            </p>
          </div>

          {/* Card 4: Inference Engine */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Inference Engine
              </span>
              <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                <Cpu className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-slate-900">
                ~5ms
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                Client WebGL
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 font-medium">
              Zero-latency client-side prediction executed directly by TensorFlow.js.
            </p>
          </div>
        </div>

        {/* Visual Charts: Training Curves & Per-Digit Recognition Bar Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left: Real Training & Validation Loss/Accuracy Progression */}
          <div className="lg:col-span-6">
            <TrainingCurvesChart history={trainingHistory} />
          </div>

          {/* Right: Per-Digit Recognition Breakdown */}
          <div className="lg:col-span-6">
            <DigitAccuracyBarChart stats={perDigitStats} />
          </div>
        </div>

        {/* Real MNIST Test Images Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-[5px_5px_0px_#0f172a] relative">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b-2 border-slate-100 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
                  Real MNIST Test Samples
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Actual 28×28 grayscale images extracted directly from the official test dataset with genuine model predictions.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-900 rounded-xl border border-sky-200 text-xs font-bold">
              <Info className="w-3.5 h-3.5 text-orange-500" />
              <span>Click any sample to inspect its probability breakdown</span>
            </div>
          </div>

          {/* Grid of Real MNIST Test Samples */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 mb-6">
            {testSamples.map((sample) => {
              const isSelected = selectedSample?.sampleIndex === sample.sampleIndex;

              return (
                <button
                  key={sample.sampleIndex}
                  onClick={() => setSelectedSample(sample)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center relative group ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 shadow-[3px_3px_0px_#f97316] scale-102'
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  {/* Status Indicator Pill */}
                  <div className="absolute top-2 right-2">
                    {sample.isCorrect ? (
                      <span
                        className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold"
                        title="Correct prediction"
                      >
                        ✓
                      </span>
                    ) : (
                      <span
                        className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold"
                        title="Challenging sample (prediction mismatch)"
                      >
                        !
                      </span>
                    )}
                  </div>

                  {/* 28x28 Raw MNIST Pixel Canvas */}
                  <MNISTSampleCanvas
                    pixels={sample.pixels}
                    size={56}
                    className="mb-2.5 transition-transform group-hover:scale-105"
                  />

                  {/* Labels & Model Predictions */}
                  <div className="w-full space-y-0.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-mono px-1">
                      <span className="text-slate-500">True:</span>
                      <strong className="text-slate-900 text-xs">{sample.trueLabel}</strong>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono px-1">
                      <span className="text-slate-500">Pred:</span>
                      <strong
                        className={`text-xs ${
                          sample.isCorrect ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'
                        }`}
                      >
                        {sample.predictedDigit}
                      </strong>
                    </div>

                    <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                      <span>Conf:</span>
                      <span className="font-bold text-slate-700">{sample.confidence}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Sample Inspector Card */}
          {selectedSample && (
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-sky-50 border-2 border-sky-300 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <MNISTSampleCanvas
                  pixels={selectedSample.pixels}
                  size={72}
                  className="shadow-md"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-lg font-bold text-slate-900">
                      Sample #{selectedSample.sampleIndex}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                        selectedSample.isCorrect
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {selectedSample.isCorrect
                        ? 'Accurate Match'
                        : `Misclassified: True ${selectedSample.trueLabel} → Predicted ${selectedSample.predictedDigit}`}
                    </span>
                  </div>

                  <p className="text-xs text-sky-900 mt-1 font-medium">
                    Ground Truth: <strong className="text-slate-900 font-mono">{selectedSample.trueLabel}</strong> |
                    Model Confidence: <strong className="text-orange-600 font-mono">{selectedSample.confidence}%</strong>
                  </p>
                </div>
              </div>

              {/* Mini 10-Class Softmax Distribution for Selected Sample */}
              <div className="flex-1 w-full max-w-md">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>10-Class Softmax Vector</span>
                  <span className="font-mono text-slate-400">Sum = 1.0</span>
                </div>
                <div className="grid grid-cols-10 gap-1">
                  {selectedSample.probabilities.map((prob, d) => {
                    const isPred = d === selectedSample.predictedDigit;
                    const isTrue = d === selectedSample.trueLabel;
                    const heightPercent = Math.max(Math.round(prob * 100), 4);

                    return (
                      <div key={d} className="flex flex-col items-center gap-1">
                        <div className="w-full h-12 bg-white rounded-md border border-slate-200 overflow-hidden flex flex-col justify-end p-0.5">
                          <div
                            className={`w-full rounded-xs transition-all ${
                              isPred
                                ? 'bg-orange-500'
                                : isTrue
                                ? 'bg-sky-400'
                                : 'bg-slate-200'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                            title={`Digit ${d}: ${(prob * 100).toFixed(1)}%`}
                          />
                        </div>
                        <span
                          className={`font-mono text-[10px] font-bold ${
                            isPred ? 'text-orange-600' : 'text-slate-500'
                          }`}
                        >
                          {d}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
