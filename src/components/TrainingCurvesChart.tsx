import React, { useState } from 'react';
import { EpochMetric } from '../types';
import { Activity, TrendingUp, CheckCircle, Info } from 'lucide-react';

interface TrainingCurvesChartProps {
  history: EpochMetric[];
}

export const TrainingCurvesChart: React.FC<TrainingCurvesChartProps> = ({ history }) => {
  const [activeMetric, setActiveMetric] = useState<'accuracy' | 'loss'>('accuracy');
  const [hoveredEpoch, setHoveredEpoch] = useState<number | null>(null);

  // SVG viewBox and chart bounds
  const width = 540;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale calculations
  const minX = 1;
  const maxX = history.length;

  const getX = (epoch: number) => {
    return padding.left + ((epoch - minX) / (maxX - minX)) * chartWidth;
  };

  // Y scale for accuracy (70% - 100%) or loss (0.0 - 0.75)
  const minY = activeMetric === 'accuracy' ? 70 : 0.0;
  const maxY = activeMetric === 'accuracy' ? 100 : 0.75;

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return padding.top + chartHeight - ((clamped - minY) / (maxY - minY)) * chartHeight;
  };

  // Generate SVG path strings
  const trainPoints = history.map((h) => ({
    x: getX(h.epoch),
    y: getY(activeMetric === 'accuracy' ? h.accuracy : h.loss),
  }));

  const valPoints = history.map((h) => ({
    x: getX(h.epoch),
    y: getY(activeMetric === 'accuracy' ? h.valAccuracy : h.valLoss),
  }));

  const makeLinePath = (points: { x: number; y: number }[]) => {
    return points.reduce(
      (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
      ''
    );
  };

  const trainPath = makeLinePath(trainPoints);
  const valPath = makeLinePath(valPoints);

  // Area under train curve for subtle tint
  const areaTrainPath = `${trainPath} L ${trainPoints[trainPoints.length - 1].x} ${
    padding.top + chartHeight
  } L ${trainPoints[0].x} ${padding.top + chartHeight} Z`;

  // Grid tick marks
  const yTicks =
    activeMetric === 'accuracy'
      ? [70, 80, 90, 100]
      : [0.0, 0.25, 0.5, 0.75];

  const selectedData = hoveredEpoch !== null
    ? history.find((h) => h.epoch === hoveredEpoch)
    : history[history.length - 1];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex flex-col justify-between h-full">
      {/* Chart Top Header & Toggle */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold text-slate-900">
                Training & Validation Progression
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Real epoch logs across 7 epochs (Adam optimizer, batch 64)
              </p>
            </div>
          </div>

          {/* Metric Toggle Tabs */}
          <div className="flex items-center bg-sky-50 p-1 rounded-xl border border-sky-200">
            <button
              onClick={() => setActiveMetric('accuracy')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMetric === 'accuracy'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accuracy (%)
            </button>
            <button
              onClick={() => setActiveMetric('loss')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMetric === 'loss'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Loss (Cross-Entropy)
            </button>
          </div>
        </div>

        {/* Legend & Hovered Metric Inspection */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-3 py-2 bg-sky-50/70 rounded-xl border border-sky-200 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-orange-700">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-slate-900 inline-block" />
              <span>Training {activeMetric === 'accuracy' ? 'Accuracy' : 'Loss'}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sky-700">
              <span className="w-3 h-3 rounded-full bg-sky-500 border border-slate-900 inline-block" />
              <span>Validation {activeMetric === 'accuracy' ? 'Accuracy' : 'Loss'}</span>
            </div>
          </div>

          {selectedData && (
            <div className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              Epoch {selectedData.epoch}/7: {' '}
              {activeMetric === 'accuracy' ? (
                <>
                  <span className="text-orange-600">{selectedData.accuracy}%</span>
                  {' / '}
                  <span className="text-sky-600">{selectedData.valAccuracy}% val</span>
                </>
              ) : (
                <>
                  <span className="text-orange-600">{selectedData.loss.toFixed(4)}</span>
                  {' / '}
                  <span className="text-sky-600">{selectedData.valLoss.toFixed(4)} val</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Responsive SVG Chart */}
        <div className="relative w-full aspect-[540/240] max-h-[260px] overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            onMouseLeave={() => setHoveredEpoch(null)}
          >
            {/* Background Grid Lines */}
            {yTicks.map((tick) => {
              const y = getY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-slate-400 font-bold"
                  >
                    {activeMetric === 'accuracy' ? `${tick}%` : tick.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* X-Axis Ticks (Epochs 1-7) */}
            {history.map((h) => {
              const x = getX(h.epoch);
              return (
                <g key={h.epoch}>
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    className={`text-[11px] font-mono font-bold ${
                      hoveredEpoch === h.epoch ? 'fill-orange-600 font-extrabold' : 'fill-slate-500'
                    }`}
                  >
                    E{h.epoch}
                  </text>
                </g>
              );
            })}

            {/* Subtle Gradient Area for Training Line */}
            <path d={areaTrainPath} fill="#FED7AA" fillOpacity="0.25" />

            {/* Validation Line */}
            <path
              d={valPath}
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Training Line */}
            <path
              d={trainPath}
              fill="none"
              stroke="#F97316"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Point Markers */}
            {history.map((h) => {
              const tx = getX(h.epoch);
              const ty = getY(activeMetric === 'accuracy' ? h.accuracy : h.loss);
              const vy = getY(activeMetric === 'accuracy' ? h.valAccuracy : h.valLoss);
              const isHovered = hoveredEpoch === h.epoch;

              return (
                <g
                  key={h.epoch}
                  onMouseEnter={() => setHoveredEpoch(h.epoch)}
                  className="cursor-pointer"
                >
                  {/* Invisible wide hit area for easy hover */}
                  <rect
                    x={tx - 18}
                    y={padding.top}
                    width={36}
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Vertical hover guide bar */}
                  {isHovered && (
                    <line
                      x1={tx}
                      y1={padding.top}
                      x2={tx}
                      y2={height - padding.bottom}
                      stroke="#CBD5E1"
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Validation circle */}
                  <circle
                    cx={tx}
                    cy={vy}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all"
                  />

                  {/* Training circle */}
                  <circle
                    cx={tx}
                    cy={ty}
                    r={isHovered ? 6 : 4}
                    fill="#F97316"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Bottom Insights Note */}
      <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-sky-50/50 p-3 rounded-xl border border-sky-100">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            Fast convergence: cross-entropy loss dropped from{' '}
            <strong className="text-slate-900">0.6783</strong> to{' '}
            <strong className="text-slate-900">0.0794</strong> by Epoch 7.
          </span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
          7 Epochs
        </span>
      </div>
    </div>
  );
};
