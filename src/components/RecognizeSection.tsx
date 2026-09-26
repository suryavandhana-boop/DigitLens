import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, PenTool, Grid, Info, Sparkles, Pencil, CheckCircle2, AlertCircle } from 'lucide-react';
import { DoodleRobotWithBoard, DoodleStar } from './Doodles';
import { predictDigit, preprocessCanvasForMNIST, PredictionResult, getOrLoadModel } from '../services/mnistPredictor';

export const RecognizeSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [brushSize, setBrushSize] = useState<number>(18);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // "Challenge the AI" states
  const [challengeTarget, setChallengeTarget] = useState<number>(() => Math.floor(Math.random() * 10));
  const [challengeScore, setChallengeScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [lastChallengeOutcome, setLastChallengeOutcome] = useState<{
    matched: boolean;
    predictedDigit: number;
    target: number;
  } | null>(null);

  // Prediction states
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize and handle canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill clean white background initially
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    update28x28Preview();

    // Pre-warm the TensorFlow.js MNIST model in background
    getOrLoadModel().catch((err: unknown) => {
      console.warn('Preloading model notice:', err);
    });
  }, []);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

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
    ctx.strokeStyle = '#0F172A'; // Deep ink
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setIsDrawing(true);
    setHasDrawn(true);
    setErrorMessage(null);
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
    update28x28Preview();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    update28x28Preview();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setPrediction(null);
    setErrorMessage(null);
    setLastChallengeOutcome(null);
    update28x28Preview();
  };

  const handleNewChallenge = () => {
    let nextDigit = Math.floor(Math.random() * 10);
    if (nextDigit === challengeTarget) {
      nextDigit = (nextDigit + 1) % 10;
    }
    setChallengeTarget(nextDigit);
    setLastChallengeOutcome(null);
    setPrediction(null);
    setErrorMessage(null);
  };

  // Extract 28x28 scaled grayscale representation (MNIST format)
  const update28x28Preview = () => {
    const canvas = canvasRef.current;
    const preview = previewCanvasRef.current;
    if (!canvas || !preview) return;

    const pCtx = preview.getContext('2d');
    if (!pCtx) return;

    try {
      const { preview28Canvas, tensor } = preprocessCanvasForMNIST(canvas);
      pCtx.drawImage(preview28Canvas, 0, 0, 28, 28);
      tensor.dispose();
    } catch {
      // Fallback direct draw
      pCtx.drawImage(canvas, 0, 0, 28, 28);
    }
  };

  // Perform real MNIST neural network prediction
  const handleRecognize = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasDrawn) {
      setErrorMessage('Please draw a digit (0–9) on the sketchpad first!');
      return;
    }

    setIsPredicting(true);
    setErrorMessage(null);
    update28x28Preview();

    try {
      const result = await predictDigit(canvas);
      if (!result) {
        setErrorMessage('Please draw a clearer digit on the sketchpad!');
        setPrediction(null);
      } else {
        setPrediction(result);

        // Evaluate challenge with real model prediction
        const matched = result.predictedDigit === challengeTarget;
        setChallengeScore((prev) => ({
          correct: prev.correct + (matched ? 1 : 0),
          total: prev.total + 1,
        }));
        setLastChallengeOutcome({
          matched,
          predictedDigit: result.predictedDigit,
          target: challengeTarget,
        });

        // Automatically and smoothly scroll to the existing prediction result section
        // so it is immediately visible without manual scrolling
        requestAnimationFrame(() => {
          setTimeout(() => {
            const targetEl = resultRef.current || document.getElementById('prediction-result-card');
            if (targetEl) {
              targetEl.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
              });
            }
          }, 60);
        });
      }
    } catch (err) {
      console.error('Prediction failed:', err);
      setErrorMessage('Could not process drawing. Please try again!');
    } finally {
      setIsPredicting(false);
    }
  };

  // Generate friendly feedback according to challenge criteria
  const getFeedback = () => {
    if (!prediction) return null;

    if (lastChallengeOutcome) {
      if (lastChallengeOutcome.matched) {
        return {
          isMatch: true,
          primary: "🎉 You're correct! Amazing!",
          secondary: `✨ That's right! The digit is ${prediction.predictedDigit}.`,
        };
      } else {
        return {
          isMatch: false,
          primary: null,
          secondary: `Almost! The AI saw ${prediction.predictedDigit}. Try again! ✨`,
        };
      }
    }

    // Default if no challenge outcome was tracked
    return {
      isMatch: true,
      primary: null,
      secondary: `✨ That's right! The digit is ${prediction.predictedDigit}.`,
    };
  };

  const feedback = getFeedback();

  return (
    <section id="recognize" className="py-14 sm:py-20 bg-[#E0F2FE] border-b-2 border-sky-300 relative overflow-hidden">
      {/* Background Notebook Ruled Lines */}
      <div className="absolute inset-0 bg-notebook-ruled opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border-2 border-orange-400 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Pencil className="w-3.5 h-3.5 text-orange-600" />
            Handwriting Playground
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Draw Your Digit Here!
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-950 font-handwriting text-lg">
            Pick your pencil stroke, sketch any number from 0 to 9, and let the real MNIST neural network recognize it!
          </p>
        </div>

        {/* Two-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Drawing Canvas Notebook Pad (Left Column) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-900 shadow-[5px_5px_0px_#0f172a] relative">
            {/* Top Notebook Binder Holes & Stroke Controls */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b-2 border-slate-100 mb-5 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ✏️
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Digital Sketchpad
                  </h3>
                  <p className="text-xs text-sky-900 font-handwriting font-bold">
                    Use mouse, trackpad, or finger
                  </p>
                </div>
              </div>

              {/* Stroke Size Selector */}
              <div className="flex items-center gap-1.5 bg-sky-50 px-2.5 py-1.5 rounded-xl border border-sky-200">
                <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
                  <PenTool className="w-3 h-3 text-orange-500" />
                  <span className="hidden xs:inline">Pencil:</span>
                </span>
                {[12, 18, 24].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      brushSize === size
                        ? 'bg-orange-500 text-white border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]'
                        : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
                    }`}
                    title={`${size}px stroke`}
                  >
                    {size === 12 ? 'S' : size === 18 ? 'M' : 'L'}
                  </button>
                ))}
              </div>
            </div>

            {/* Small Interactive "Challenge the AI" Card */}
            <div
              id="ai-challenge-card"
              className="mb-4 bg-sky-50/90 rounded-2xl p-3.5 sm:p-4 border-2 border-sky-300 shadow-xs relative"
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                    🎯
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-slate-900 leading-tight">
                      Challenge the AI
                    </h4>
                    <p className="text-xs text-sky-900 font-handwriting font-bold leading-tight">
                      Can you make the AI recognize this digit?
                    </p>
                  </div>
                </div>

                {/* Session Score & New Challenge Button */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    id="challenge-score-badge"
                    className="px-2.5 py-1 bg-white rounded-xl border border-sky-300 text-xs font-bold font-mono text-slate-800 shadow-xs"
                  >
                    Score: {challengeScore.correct} / {challengeScore.total}
                  </div>
                  <button
                    id="new-challenge-btn"
                    onClick={handleNewChallenge}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-orange-800 bg-orange-100 hover:bg-orange-200 border border-orange-300 transition-all cursor-pointer active:scale-95 shadow-xs"
                    title="Choose a new target digit"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>New Challenge</span>
                  </button>
                </div>
              </div>

              {/* Target Prompt Banner & Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-xl p-2.5 px-3 border border-sky-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Target:
                  </span>
                  <span
                    id="challenge-target-digit"
                    className="px-3 py-0.5 rounded-lg bg-orange-500 text-white font-heading font-bold text-base border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                  >
                    Draw: {challengeTarget}
                  </span>
                </div>

                {/* Challenge Feedback Notice (if available) */}
                {lastChallengeOutcome ? (
                  <div
                    id="challenge-feedback-inline"
                    className={`text-xs font-bold font-handwriting px-2.5 py-1 rounded-lg border ${
                      lastChallengeOutcome.matched
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-orange-50 text-orange-800 border-orange-300'
                    }`}
                  >
                    {lastChallengeOutcome.matched
                      ? "🎉 You're correct! Amazing!"
                      : `Almost! The AI saw ${lastChallengeOutcome.predictedDigit}. Try again! ✨`}
                  </div>
                ) : (
                  <span className="text-xs text-sky-800 font-handwriting">
                    Sketch digit {challengeTarget} and click Recognize!
                  </span>
                )}
              </div>
            </div>

            {/* Canvas Drawing Area */}
            <div className="flex flex-col items-center justify-center">
              <div
                className={`relative rounded-2xl overflow-hidden border-3 border-slate-900 shadow-inner bg-white select-none max-w-full touch-none ${
                  showGrid
                    ? 'bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:28px_28px]'
                    : ''
                }`}
              >
                <canvas
                  id="digit-drawing-canvas"
                  ref={canvasRef}
                  width={280}
                  height={280}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="cursor-crosshair touch-none w-[260px] h-[260px] xs:w-[280px] xs:h-[280px] sm:w-[320px] sm:h-[320px]"
                />

                {!hasDrawn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300">
                    <span className="font-heading text-6xl font-light opacity-30 text-sky-400">
                      {challengeTarget}
                    </span>
                    <span className="font-handwriting text-base font-bold text-slate-400 mt-2">
                      ✏️ Draw digit {challengeTarget} here!
                    </span>
                  </div>
                )}
              </div>

              {/* Error / Drawing notice */}
              {errorMessage && (
                <div className="mt-3 text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-300 flex items-center gap-1.5 animate-doodle-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMessage}
                </div>
              )}

              {/* Action Toolbar with Recognize & Clear */}
              <div className="mt-5 w-full max-w-[340px] flex items-center justify-between gap-2 sm:gap-2.5">
                <button
                  id="recognize-digit-btn"
                  onClick={handleRecognize}
                  disabled={isPredicting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-3 rounded-2xl text-sm sm:text-base font-bold text-white bg-orange-500 hover:bg-orange-600 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{isPredicting ? 'Recognizing...' : 'Recognize'}</span>
                </button>

                <button
                  id="canvas-clear-btn"
                  onClick={clearCanvas}
                  className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-orange-50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-orange-600" />
                  <span>Clear</span>
                </button>

                <button
                  id="canvas-grid-toggle-btn"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-3 py-3 rounded-2xl text-xs font-bold border-2 transition-all flex items-center gap-1 cursor-pointer ${
                    showGrid
                      ? 'bg-sky-100 text-sky-900 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-sky-50'
                  }`}
                  title="Toggle 28×28 grid"
                >
                  <Grid className="w-3.5 h-3.5 text-orange-500" />
                  <span>Grid</span>
                </button>
              </div>
            </div>

            {/* 28x28 Preprocessing Sensor Card */}
            <div className="mt-6 pt-4 border-t-2 border-slate-100 flex items-center justify-between bg-sky-50/80 p-4 rounded-2xl border-2 border-sky-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center p-1 border-2 border-slate-900 shadow-xs">
                  <canvas
                    ref={previewCanvasRef}
                    width={28}
                    height={28}
                    className="w-9 h-9 [image-rendering:pixelated]"
                  />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-slate-900">
                    What The AI Eyes See (28×28)
                  </h4>
                  <p className="text-xs text-sky-800 font-handwriting">
                    Normalized grayscale input fed to TensorFlow model
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white rounded-lg text-orange-600 border border-orange-300 shadow-xs">
                28×28 MNIST
              </span>
            </div>
          </div>

          {/* Right Column: Prediction Results + Scoreboard + Robot Signboard */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Real Prediction Result Card (When prediction is active) */}
            {prediction ? (
              <div
                ref={resultRef}
                id="prediction-result-card"
                className="bg-orange-500 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-[5px_5px_0px_#0f172a] relative overflow-hidden"
              >
                <div className="flex items-center justify-between pb-3 border-b-2 border-orange-400/80 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-orange-700 text-xs font-bold uppercase tracking-wider shadow-xs">
                      Prediction Result
                    </span>
                  </div>
                  <span className="text-xs font-bold text-orange-100 font-mono">
                    Real MNIST Model
                  </span>
                </div>

                {/* Primary Prediction Display (Predicted Digit & Confidence) */}
                <div className="grid grid-cols-2 gap-4 my-2">
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="text-xs font-bold text-orange-100 uppercase tracking-wider">
                      Predicted Digit
                    </div>
                    <div className="font-heading text-5xl sm:text-6xl font-bold text-white mt-1">
                      {prediction.predictedDigit}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="text-xs font-bold text-orange-100 uppercase tracking-wider">
                      Confidence
                    </div>
                    <div className="font-heading text-4xl sm:text-5xl font-bold text-white mt-1">
                      {prediction.confidence}%
                    </div>
                  </div>
                </div>

                {/* Friendly Feedback Messages */}
                {feedback && (
                  <div className="mt-4 pt-3 border-t-2 border-orange-400/80 bg-white/15 p-3.5 rounded-2xl border border-white/20">
                    {feedback.primary && (
                      <div className="font-heading text-base font-bold text-white mb-0.5">
                        {feedback.primary}
                      </div>
                    )}
                    <div className="font-handwriting text-lg text-orange-100 font-bold">
                      {feedback.secondary}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Doodle Robot Character Holding Chalkboard (Initial view) */
              <DoodleRobotWithBoard
                badge="AI Quick Tip"
                factText="Quick Tip: Every digit has its own pattern!"
                subText="Draw in the center and click 'Recognize' to test!"
              />
            )}

            {/* Neural Network Real Probability Scoreboard */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                    📊
                  </span>
                  <h4 className="font-heading text-sm font-bold text-slate-900">
                    Neural Network Probabilities (0–9)
                  </h4>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                  {prediction ? 'Live Output' : 'Awaiting Input'}
                </span>
              </div>

              {/* Digits 0 to 9 Scoreboard Rows */}
              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
                  const prob = prediction ? prediction.probabilities[digit] : null;
                  const percent = prob !== null ? Math.round(prob * 100) : null;
                  const isTop = prediction ? prediction.predictedDigit === digit : false;

                  return (
                    <div
                      key={digit}
                      className={`flex items-center gap-3 text-xs p-1 rounded-xl transition-all ${
                        isTop ? 'bg-orange-50 font-bold border border-orange-200' : ''
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center text-xs ${
                          isTop
                            ? 'bg-orange-500 text-white border border-slate-900 shadow-[1px_1px_0px_#0f172a]'
                            : 'bg-sky-50 border border-sky-200 text-slate-800'
                        }`}
                      >
                        {digit}
                      </span>
                      <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isTop ? 'bg-orange-500' : 'bg-sky-400'
                          }`}
                          style={{ width: `${percent !== null ? Math.max(percent, 1) : 0}%` }}
                        />
                      </div>
                      <span
                        className={`w-10 text-right font-mono text-xs font-bold ${
                          isTop ? 'text-orange-700' : 'text-slate-500'
                        }`}
                      >
                        {percent !== null ? `${percent}%` : '--%'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status Note */}
              <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-start gap-2 text-xs text-sky-900 font-medium bg-sky-50/70 p-3 rounded-xl border border-sky-200">
                <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>
                  {prediction
                    ? `Real inference generated by TensorFlow/Keras neural network weights trained on MNIST.`
                    : `Draw a digit and click 'Recognize' to evaluate probabilities across all 10 output neurons.`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
