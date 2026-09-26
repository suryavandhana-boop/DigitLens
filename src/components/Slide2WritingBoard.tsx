import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, PenTool, Grid, Pencil, Eraser, Sparkles, ArrowRight, Check, Shuffle, Target, Loader2 } from 'lucide-react';
import { DoodleStar, DoodlePencil, DoodleLightBulb, DoodleStudentWithBoard } from './Doodles';
import { predictDigit, PredictionResult, getOrLoadModel } from '../services/mnistPredictor';
import { LearningFact, SLIDE2_INITIAL_FACTS, SLIDE2_POST_PREDICTION_FACTS } from '../services/factsService';

interface Slide2WritingBoardProps {
  onGoToChallenge: () => void;
  initialFact?: LearningFact;
  postPredictionFact?: LearningFact;
}

interface SizeOption {
  id: string;
  label: string;
  size: number;
}

const PEN_SIZES: SizeOption[] = [
  { id: 'thin', label: 'Thin', size: 6 },
  { id: 'small', label: 'Small', size: 12 },
  { id: 'medium', label: 'Medium', size: 18 },
  { id: 'thick', label: 'Thick', size: 26 },
  { id: 'extra-thick', label: 'Extra-thick', size: 36 },
];

interface ColorOption {
  name: string;
  hex: string;
}

const DARK_COLORS: ColorOption[] = [
  { name: 'Ink Black', hex: '#0F172A' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Deep Plum', hex: '#581C87' },
  { name: 'Forest Green', hex: '#14532D' },
  { name: 'Deep Rust', hex: '#9A3412' },
];

const LIGHT_COLORS: ColorOption[] = [
  { name: 'Vibrant Orange', hex: '#F97316' },
  { name: 'Sky Blue', hex: '#0284C7' },
  { name: 'Sunny Amber', hex: '#F59E0B' },
  { name: 'Leaf Green', hex: '#16A34A' },
  { name: 'Bubblegum Pink', hex: '#EC4899' },
];

interface RecognitionOutcome {
  isCorrect: boolean;
  predictedDigit: number;
  confidence: number;
  targetDigit: number;
}

export const Slide2WritingBoard: React.FC<Slide2WritingBoardProps> = ({
  onGoToChallenge,
  initialFact = SLIDE2_INITIAL_FACTS[0],
  postPredictionFact = SLIDE2_POST_PREDICTION_FACTS[0],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Drawing tools and settings
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>('pen');
  const [selectedColor, setSelectedColor] = useState<string>('#0F172A');
  const [brushSize, setBrushSize] = useState<number>(18); // Default Medium
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Practice Target and Prediction state
  const [targetDigit, setTargetDigit] = useState<number>(3);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [, setPrediction] = useState<PredictionResult | null>(null);
  const [outcome, setOutcome] = useState<RecognitionOutcome | null>(null);
  const [emptyHint, setEmptyHint] = useState<boolean>(false);

  // Interactive Learning Fact states for Slide 2
  const [isPostPredictionFact, setIsPostPredictionFact] = useState<boolean>(false);
  const [currentFact, setCurrentFact] = useState<LearningFact>(
    () => initialFact || SLIDE2_INITIAL_FACTS[0]
  );

  useEffect(() => {
    if (!isPostPredictionFact && initialFact) {
      setCurrentFact(initialFact);
    }
  }, [initialFact, isPostPredictionFact]);

  // Initialize canvas with clean white background and preload model
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Warm up the real MNIST model in the background
    getOrLoadModel().catch((err: unknown) => {
      console.warn('Preloading MNIST model notice:', err);
    });
  }, []);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e && e.touches.length > 0 ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : ('clientX' in e ? e.clientX : 0);
    const clientY = touch ? touch.clientY : ('clientY' in e ? e.clientY : 0);

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Eraser removes only the strokes it touches by painting white matching paper
    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 1.5;
    } else {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setIsDrawing(true);
    setHasDrawn(true);
    setEmptyHint(false);

    // Immediate initial touch dot
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setOutcome(null);
    setPrediction(null);
    setEmptyHint(false);
  };

  const handleSelectColor = (hex: string) => {
    setSelectedColor(hex);
    // If eraser was active, automatically switch to pen when a color is chosen
    if (activeTool === 'eraser') {
      setActiveTool('pen');
    }
  };

  const handleShuffleTarget = () => {
    let next = Math.floor(Math.random() * 10);
    if (next === targetDigit) {
      next = (next + 1) % 10;
    }
    setTargetDigit(next);
    setOutcome(null);
  };

  // Real digit recognition when user clicks "Show the Answer"
  const handleShowAnswer = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasDrawn) {
      setEmptyHint(true);
      setOutcome(null);
      requestAnimationFrame(() => {
        const hintEl = document.getElementById('empty-draw-hint');
        if (hintEl) {
          hintEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
      return;
    }

    setEmptyHint(false);
    setIsPredicting(true);

    try {
      const result = await predictDigit(canvas);
      if (!result) {
        setEmptyHint(true);
        setOutcome(null);
        setIsPredicting(false);
        return;
      }

      setPrediction(result);
      const isCorrect = result.predictedDigit === targetDigit;
      setOutcome({
        isCorrect,
        predictedDigit: result.predictedDigit,
        confidence: result.confidence,
        targetDigit,
      });

      // Slide 2 requirement: After the user gets a digit prediction, show another different fact
      if (postPredictionFact) {
        setCurrentFact(postPredictionFact);
        setIsPostPredictionFact(true);
      }

      // Automatically and smoothly scroll/push the view down to the result section
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = resultRef.current || document.getElementById('answer-result-box');
          if (el) {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }, 60);
      });
    } catch (err) {
      console.error('Failed real digit prediction:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-[#E0F2FE] relative overflow-hidden min-h-[calc(100vh-140px)] flex flex-col justify-center">
      {/* Background notebook ruled lines */}
      <div className="absolute inset-0 bg-notebook-ruled opacity-40 pointer-events-none" />

      {/* Background corner doodles */}
      <div className="absolute top-8 left-8 hidden sm:block animate-doodle-bob pointer-events-none select-none opacity-50">
        <DoodlePencil className="w-10 h-10" />
      </div>
      <div className="absolute top-10 right-10 hidden sm:block animate-doodle-bob-delayed pointer-events-none select-none opacity-60">
        <DoodleStar className="w-8 h-8" color="#F97316" />
      </div>
      <div className="absolute bottom-8 left-12 hidden sm:block animate-doodle-bob-delayed pointer-events-none select-none opacity-50">
        <DoodleLightBulb className="w-10 h-10" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border-2 border-orange-400 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
            <Pencil className="w-3.5 h-3.5 text-orange-600" />
            Slide 2: Writing Board
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Writing Board
          </h2>
          <p className="mt-1 text-base sm:text-lg text-sky-950 font-handwriting font-bold">
            Draw the target number, then tap &quot;Show the Answer&quot; to test your writing!
          </p>
        </div>

        {/* Practice Target Digit Selector Bar */}
        <div className="w-full max-w-3xl mx-auto mb-3.5">
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                <Target className="w-4 h-4 text-orange-500" />
                <span>Practice Target:</span>
              </span>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500 text-white font-heading text-lg font-bold border-2 border-slate-900 shadow-xs">
                {targetDigit}
              </span>
              <button
                onClick={handleShuffleTarget}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium text-slate-700 bg-sky-100 hover:bg-sky-200 border border-sky-300 transition-colors cursor-pointer"
                title="Pick another random number"
              >
                <Shuffle className="w-3 h-3 text-sky-700" />
                <span>Next 🎲</span>
              </button>
            </div>

            {/* Quick 0-9 chips */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  onClick={() => {
                    setTargetDigit(digit);
                    setOutcome(null);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    targetDigit === digit
                      ? 'bg-orange-500 text-white border-2 border-slate-900 shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-orange-100 border border-slate-200'
                  }`}
                >
                  {digit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GREEN CHALKBOARD-STYLE FRAME WITH DEFINED RECTANGULAR WHITE DRAWING SHEET */}
        <div className="w-full max-w-3xl mx-auto">
          {/* Outer Green Chalkboard Frame */}
          <div className="rounded-3xl p-3.5 sm:p-6 md:p-7 bg-[#1B4D3E] border-4 sm:border-[6px] border-[#0E2F25] shadow-[6px_6px_0px_#0f172a] relative">
            
            {/* TOOLBAR ROW 1: Pen Tool vs Eraser Tool + 5 Pen Sizes */}
            <div className="flex flex-col md:flex-row items-center justify-between pb-3 sm:pb-4 border-b-2 border-[#2C6B56] mb-3.5 gap-3">
              {/* Tool Selector: Pen vs Eraser */}
              <div className="flex items-center gap-2 bg-[#0E2F25]/90 p-1.5 rounded-2xl border border-[#2C6B56]">
                <button
                  id="tool-pen-btn"
                  onClick={() => setActiveTool('pen')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTool === 'pen'
                      ? 'bg-orange-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Pen</span>
                </button>

                <button
                  id="tool-eraser-btn"
                  onClick={() => setActiveTool('eraser')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTool === 'eraser'
                      ? 'bg-rose-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                  }`}
                  title="Eraser removes only the strokes it touches"
                >
                  <Eraser className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Eraser</span>
                </button>
              </div>

              {/* 5 Pen Sizes: Thin, Small, Medium, Thick, Extra-thick */}
              <div className="flex items-center gap-1 sm:gap-1.5 bg-[#0E2F25]/90 px-2 sm:px-3 py-1.5 rounded-2xl border border-[#2C6B56] flex-wrap justify-center">
                <span className="text-xs font-bold text-emerald-200 mr-1 hidden sm:inline">
                  Size:
                </span>
                {PEN_SIZES.map((option) => {
                  const isSelected = brushSize === option.size;
                  return (
                    <button
                      key={option.id}
                      id={`pen-size-${option.id}`}
                      onClick={() => setBrushSize(option.size)}
                      className={`px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500 text-white border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]'
                          : 'bg-white text-slate-800 hover:bg-orange-50 border border-slate-300'
                      }`}
                      title={`${option.label} (${option.size}px)`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TOOLBAR ROW 2: Dark and Light Pen Colors */}
            <div className="bg-[#0E2F25]/80 rounded-2xl p-2.5 sm:p-3 mb-4 border border-[#2C6B56] flex flex-col sm:flex-row items-center justify-between gap-2.5">
              {/* Dark Colors */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 font-mono">
                  Dark:
                </span>
                <div className="flex items-center gap-1.5">
                  {DARK_COLORS.map((col) => {
                    const isSelected = selectedColor === col.hex && activeTool === 'pen';
                    return (
                      <button
                        key={col.hex}
                        id={`color-dark-${col.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleSelectColor(col.hex)}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all cursor-pointer relative flex items-center justify-center ${
                          isSelected
                            ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0E2F25] shadow-md'
                            : 'hover:scale-105 opacity-90 hover:opacity-100 border border-white/30'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={`${col.name} (${col.hex})`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden sm:block w-px h-6 bg-[#2C6B56]" />

              {/* Light Colors */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 font-mono">
                  Light:
                </span>
                <div className="flex items-center gap-1.5">
                  {LIGHT_COLORS.map((col) => {
                    const isSelected = selectedColor === col.hex && activeTool === 'pen';
                    return (
                      <button
                        key={col.hex}
                        id={`color-light-${col.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleSelectColor(col.hex)}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all cursor-pointer relative flex items-center justify-center ${
                          isSelected
                            ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0E2F25] shadow-md'
                            : 'hover:scale-105 opacity-90 hover:opacity-100 border border-white/30'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={`${col.name} (${col.hex})`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CLEARLY DEFINED LARGE RECTANGULAR WHITE DRAWING SHEET */}
            <div className="flex flex-col items-center justify-center">
              <div
                id="white-drawing-sheet"
                className={`relative rounded-xl overflow-hidden border-4 border-slate-900 shadow-2xl bg-white select-none max-w-full touch-none w-full max-w-[440px] aspect-square flex items-center justify-center ${
                  showGrid
                    ? 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:28px_28px]'
                    : ''
                }`}
              >
                <canvas
                  id="digit-drawing-canvas"
                  ref={canvasRef}
                  width={380}
                  height={380}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className={`touch-none w-full h-full block bg-white ${
                    activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
                  }`}
                />

                {/* Friendly Watermark Placeholder Guide */}
                {!hasDrawn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300">
                    <span className="font-heading text-7xl sm:text-8xl font-light opacity-25 text-slate-400 select-none">
                      {targetDigit}
                    </span>
                    <span className="font-handwriting text-base sm:text-lg font-bold text-slate-500 mt-2 select-none px-4 text-center">
                      ✏️ Draw number {targetDigit} inside this sheet!
                    </span>
                  </div>
                )}
              </div>

              {/* ACTION TOOLBAR: Clear Sheet + Grid Toggle + Clearly Visible "Show the Answer" + Challenge */}
              <div className="mt-5 w-full max-w-[440px] flex flex-wrap items-center justify-between gap-2 sm:gap-2.5">
                <button
                  id="canvas-clear-btn"
                  onClick={clearCanvas}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-orange-50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
                  <span>Clear</span>
                </button>

                <button
                  id="canvas-grid-toggle-btn"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    showGrid
                      ? 'bg-emerald-100 text-emerald-950 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                      : 'bg-white text-slate-700 border-slate-900 hover:bg-sky-50 shadow-[1px_1px_0px_#0f172a]'
                  }`}
                  title="Toggle Grid Lines"
                >
                  <Grid className="w-3.5 h-3.5 text-orange-500" />
                  <span>{showGrid ? 'Grid' : 'Plain'}</span>
                </button>

                <button
                  id="slide2-to-challenge-btn"
                  onClick={onGoToChallenge}
                  className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer active:scale-95"
                  title="Go to Challenge & Scoreboard"
                >
                  <span>Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* CLEARLY VISIBLE "RECOGNIZE" BUTTON */}
                <button
                  id="recognize-btn"
                  onClick={handleShowAnswer}
                  disabled={isPredicting}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-amber-300 hover:bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer active:scale-95 disabled:opacity-75"
                  title="Recognize drawn digit"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-700" />
                  <span>Recognize</span>
                </button>

                {/* CLEARLY VISIBLE "SHOW THE ANSWER" BUTTON */}
                <button
                  id="show-the-answer-btn"
                  onClick={handleShowAnswer}
                  disabled={isPredicting}
                  className="w-full sm:w-auto sm:grow order-last sm:order-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer active:scale-95 disabled:opacity-75"
                >
                  {isPredicting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Show the Answer</span>
                    </>
                  )}
                </button>
              </div>

              {/* EMPTY DRAWING HINT */}
              {emptyHint && (
                <div
                  id="empty-draw-hint"
                  className="mt-3.5 w-full max-w-[440px] p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-xs"
                >
                  <span className="text-base select-none">✍️</span>
                  <span>Please draw a number on the sheet first, then tap Show the Answer!</span>
                </div>
              )}

              {/* CLEAN, POLISHED ROUNDED BOX FOR RESULT & FRIENDLY MESSAGE */}
              {outcome && (
                <div
                  ref={resultRef}
                  id="answer-result-box"
                  className={`mt-4 w-full max-w-[440px] p-4 sm:p-5 rounded-3xl border-2 transition-all duration-300 shadow-[4px_4px_0px_#0f172a] ${
                    outcome.isCorrect
                      ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-400 text-slate-800'
                      : 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-300 text-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5">
                    {/* Normal system/Apple-style Unicode Emojis & Friendly Message */}
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <span className="text-3xl sm:text-4xl select-none shrink-0" role="img" aria-label="outcome emoji">
                        {outcome.isCorrect ? '🎉' : '✨'}
                      </span>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {outcome.isCorrect
                            ? "🎉 You're correct! Great job!"
                            : `Almost! Looks like digit ${outcome.predictedDigit}!`}
                        </h4>
                        <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 leading-normal">
                          {outcome.isCorrect
                            ? `✨ Perfect! AI recognized your handwritten digit ${outcome.predictedDigit} with ${outcome.confidence}% confidence! 👍`
                            : `Target was digit ${outcome.targetDigit}. AI detected digit ${outcome.predictedDigit} with ${outcome.confidence}% confidence. Give it another try! ✨`}
                        </p>
                      </div>
                    </div>

                    {/* Clean real prediction and confidence badge */}
                    <div className="flex items-center gap-2.5 bg-white/95 px-3.5 py-1.5 rounded-2xl border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a] shrink-0">
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          AI Answer
                        </div>
                        <div className="text-2xl font-bold text-orange-600 font-heading">
                          {outcome.predictedDigit}
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Confidence
                        </div>
                        <div className="text-sm font-bold text-emerald-600 font-mono">
                          {outcome.confidence}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Did You Know Fact inside Result Box */}
                  <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex items-start gap-2.5 bg-white/80 p-2.5 rounded-2xl border border-slate-200/90 text-left">
                    <span className="text-base select-none shrink-0" role="img" aria-label="lightbulb">💡</span>
                    <div className="text-xs sm:text-sm font-normal text-slate-700 leading-snug">
                      <span className="font-semibold text-orange-700">Did You Know? </span>
                      {currentFact.fact}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Chalkboard Tray Ledge Graphic */}
            <div className="mt-5 pt-3 border-t-2 border-[#2C6B56] flex flex-wrap items-center justify-between text-xs text-emerald-200 font-handwriting gap-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Real MNIST AI Model • Touch & Mouse ready
              </span>
              <span className="bg-[#0E2F25] px-2.5 py-0.5 rounded-lg border border-[#2C6B56] font-mono text-[11px] text-white">
                Chalkboard Frame
              </span>
            </div>
          </div>

          {/* Slide 2: Did You Know? Interactive Learning Card */}
          <div className="w-full max-w-3xl mx-auto mt-6">
            <DoodleStudentWithBoard
              badge={isPostPredictionFact ? 'Did You Know? 💡' : currentFact.badge || 'Did You Know? ✍️'}
              factText={currentFact.fact}
              subText={currentFact.tip}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
