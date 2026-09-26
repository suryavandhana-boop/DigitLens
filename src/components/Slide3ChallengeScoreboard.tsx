import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  RotateCcw,
  PenTool,
  Grid,
  Sparkles,
  Eraser,
  Check,
  Trophy,
  Target,
  ArrowRight,
  Flame,
  AlertCircle,
  HelpCircle,
  Hash,
  Users,
} from 'lucide-react';
import { DoodleRobotWithBoard, DoodleStar, DoodlePencil } from './Doodles';
import {
  predictDigit,
  PredictionResult,
  getOrLoadModel,
  preprocessCanvasForMNIST,
} from '../services/mnistPredictor';
import { LearningFact, SLIDE3_FACTS } from '../services/factsService';

interface Slide3ChallengeScoreboardProps {
  onBackToBoard: () => void;
  fact?: LearningFact;
}

// Local Player & Scoreboard Interfaces
export interface PlayerRecord {
  id: string;
  name: string;
  score: number; // correct challenges
  total: number; // total challenges played
  updatedAt: number;
}

const STORAGE_PLAYERS_KEY = 'mnist_challenge_players_v1';
const STORAGE_CURRENT_PLAYER_KEY = 'mnist_current_player_name_v1';

const getStoredPlayers = (): PlayerRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_PLAYERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStoredPlayers = (players: PlayerRecord[]) => {
  try {
    localStorage.setItem(STORAGE_PLAYERS_KEY, JSON.stringify(players));
  } catch (err) {
    console.warn('Could not save player scores to localStorage:', err);
  }
};

// Challenge Modes
export type ChallengeMode = 'draw' | 'addition' | 'subtraction' | 'multiplication' | 'division';

interface ChallengeTab {
  id: ChallengeMode;
  label: string;
  icon: string;
  badge: string;
  description: string;
}

const CHALLENGE_TABS: ChallengeTab[] = [
  {
    id: 'draw',
    label: 'Draw a Digit',
    icon: '✏️',
    badge: '0–9 Recognition',
    description: 'Draw the requested digit on the white sheet for the AI to recognize!',
  },
  {
    id: 'addition',
    label: 'Addition',
    icon: '➕',
    badge: 'Maths (+)',
    description: 'Simple beginner addition challenges to practice your numbers!',
  },
  {
    id: 'subtraction',
    label: 'Subtraction',
    icon: '➖',
    badge: 'Maths (−)',
    description: 'Beginner-friendly subtraction questions with positive answers.',
  },
  {
    id: 'multiplication',
    label: 'Multiplication',
    icon: '✖️',
    badge: 'Maths (×)',
    description: 'Fun times-table questions to test quick mental multiplication!',
  },
  {
    id: 'division',
    label: 'Division',
    icon: '➗',
    badge: 'Maths (÷)',
    description: 'Clean division problems with easy whole-number answers.',
  },
];

// Drawing toolkit options identical to Slide 2
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

// Math Question Interface
interface MathQuestion {
  num1: number;
  num2: number;
  operation: '+' | '−' | '×' | '÷';
  answer: number;
  text: string;
}

// Generate simple beginner-friendly maths questions
function createMathQuestion(mode: 'addition' | 'subtraction' | 'multiplication' | 'division'): MathQuestion {
  if (mode === 'addition') {
    const a = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const b = Math.floor(Math.random() * 10) + 1; // 1 to 10
    return {
      num1: a,
      num2: b,
      operation: '+',
      answer: a + b,
      text: `${a} + ${b}`,
    };
  } else if (mode === 'subtraction') {
    const b = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const diff = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const a = b + diff; // guarantees a > b, positive result
    return {
      num1: a,
      num2: b,
      operation: '−',
      answer: diff,
      text: `${a} − ${b}`,
    };
  } else if (mode === 'multiplication') {
    const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const b = Math.floor(Math.random() * 5) + 1; // 1 to 5
    return {
      num1: a,
      num2: b,
      operation: '×',
      answer: a * b,
      text: `${a} × ${b}`,
    };
  } else {
    // Division: clean integer division
    const divisor = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const quotient = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const dividend = divisor * quotient;
    return {
      num1: dividend,
      num2: divisor,
      operation: '÷',
      answer: quotient,
      text: `${dividend} ÷ ${divisor}`,
    };
  }
}

export const Slide3ChallengeScoreboard: React.FC<Slide3ChallengeScoreboardProps> = ({
  onBackToBoard,
  fact = SLIDE3_FACTS[0],
}) => {
  // Active Challenge Mode
  const [activeMode, setActiveMode] = useState<ChallengeMode>('draw');

  // Players & Local Scoreboard State
  const [players, setPlayers] = useState<PlayerRecord[]>(() => getStoredPlayers());
  const [playerNameInput, setPlayerNameInput] = useState<string>('');
  const [playerNameError, setPlayerNameError] = useState<string | null>(null);
  const [activePlayerName, setActivePlayerName] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_PLAYER_KEY);
      if (stored && stored.trim()) return stored.trim();
      const all = getStoredPlayers();
      return all.length > 0 ? all[0].name : null;
    } catch {
      return null;
    }
  });

  // Current active player record
  const currentPlayer = useMemo(() => {
    if (!activePlayerName) return null;
    return (
      players.find(
        (p) => p.name.trim().toLowerCase() === activePlayerName.trim().toLowerCase()
      ) || null
    );
  }, [activePlayerName, players]);

  // Sorted players by score descending
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.total !== a.total) return b.total - a.total;
      return b.updatedAt - a.updatedAt;
    });
  }, [players]);

  // Unified Challenge Score
  const [challengeScore, setChallengeScore] = useState<{ correct: number; total: number }>(() => {
    try {
      const storedName = localStorage.getItem(STORAGE_CURRENT_PLAYER_KEY);
      const all = getStoredPlayers();
      if (storedName) {
        const found = all.find((p) => p.name.trim().toLowerCase() === storedName.trim().toLowerCase());
        if (found) return { correct: found.score, total: found.total };
      }
      if (all.length > 0) {
        return { correct: all[0].score, total: all[0].total };
      }
    } catch {}
    return { correct: 0, total: 0 };
  });
  const [streak, setStreak] = useState<number>(0);

  // Record challenge outcome and save to local storage for active player
  const recordScoreResult = (isSuccess: boolean) => {
    setChallengeScore((prev) => {
      const next = {
        correct: prev.correct + (isSuccess ? 1 : 0),
        total: prev.total + 1,
      };

      if (activePlayerName) {
        setPlayers((prevPlayers) => {
          const trimmed = activePlayerName.trim().toLowerCase();
          const existingIdx = prevPlayers.findIndex(
            (p) => p.name.trim().toLowerCase() === trimmed
          );

          let updated: PlayerRecord[];
          if (existingIdx >= 0) {
            updated = prevPlayers.map((p, idx) =>
              idx === existingIdx
                ? {
                    ...p,
                    score: p.score + (isSuccess ? 1 : 0),
                    total: p.total + 1,
                    updatedAt: Date.now(),
                  }
                : p
            );
          } else {
            updated = [
              ...prevPlayers,
              {
                id: Date.now().toString(),
                name: activePlayerName.trim(),
                score: isSuccess ? 1 : 0,
                total: 1,
                updatedAt: Date.now(),
              },
            ];
          }
          saveStoredPlayers(updated);
          return updated;
        });
      }

      return next;
    });
  };

  // Start / Add / Switch player
  const handleStartPlayer = (nameToSet?: string) => {
    const raw = nameToSet !== undefined ? nameToSet : playerNameInput;
    const trimmed = raw.trim();

    if (!trimmed) {
      setPlayerNameError('Please enter a player name!');
      return;
    }
    if (trimmed.length > 20) {
      setPlayerNameError('Name must be 20 characters or fewer.');
      return;
    }

    setPlayerNameError(null);
    setPlayerNameInput('');

    const existing = players.find(
      (p) => p.name.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (existing) {
      setActivePlayerName(existing.name);
      setChallengeScore({ correct: existing.score, total: existing.total });
    } else {
      const newPlayer: PlayerRecord = {
        id: Date.now().toString(),
        name: trimmed,
        score: 0,
        total: 0,
        updatedAt: Date.now(),
      };
      const updated = [...players, newPlayer];
      setPlayers(updated);
      saveStoredPlayers(updated);
      setActivePlayerName(trimmed);
      setChallengeScore({ correct: 0, total: 0 });
    }

    try {
      localStorage.setItem(STORAGE_CURRENT_PLAYER_KEY, trimmed);
    } catch {}
  };

  // Switch player by clicking on scoreboard
  const handleSwitchPlayer = (player: PlayerRecord) => {
    setActivePlayerName(player.name);
    setChallengeScore({ correct: player.score, total: player.total });
    setPlayerNameError(null);
    try {
      localStorage.setItem(STORAGE_CURRENT_PLAYER_KEY, player.name);
    } catch {}
  };

  // Clear scoreboard
  const handleClearScoreboard = () => {
    setPlayers([]);
    saveStoredPlayers([]);
    setActivePlayerName(null);
    setChallengeScore({ correct: 0, total: 0 });
    setStreak(0);
    try {
      localStorage.removeItem(STORAGE_CURRENT_PLAYER_KEY);
    } catch {}
  };

  // Drawing Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Drawing Tools State (Matches Slide 2)
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>('pen');
  const [selectedColor, setSelectedColor] = useState<string>('#0F172A');
  const [brushSize, setBrushSize] = useState<number>(18);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  // Digit Challenge State (0–9)
  const [challengeTarget, setChallengeTarget] = useState<number>(() => Math.floor(Math.random() * 10));
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [drawErrorMessage, setDrawErrorMessage] = useState<string | null>(null);
  const [drawOutcome, setDrawOutcome] = useState<{
    matched: boolean;
    predictedDigit: number;
    target: number;
  } | null>(null);

  // Maths Challenge State
  const [mathQuestion, setMathQuestion] = useState<MathQuestion>(() => createMathQuestion('addition'));
  const [userMathAnswer, setUserMathAnswer] = useState<string>('');
  const [mathFeedback, setMathFeedback] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    message: string;
    expectedAnswer: number;
  } | null>(null);
  const [mathInputError, setMathInputError] = useState<string | null>(null);

  // Slide 3 Did You Know Fact
  const currentFact: LearningFact = fact || SLIDE3_FACTS[0];

  // Initialize Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    update28x28Preview();
  }, []);

  useEffect(() => {
    initCanvas();
    getOrLoadModel().catch((err: unknown) => {
      console.warn('Preloading model notice:', err);
    });
  }, [initCanvas]);

  // Mode Switch Handler
  const handleSelectMode = (newMode: ChallengeMode) => {
    setActiveMode(newMode);
    setMathInputError(null);
    setDrawErrorMessage(null);

    if (newMode !== 'draw') {
      const q = createMathQuestion(newMode);
      setMathQuestion(q);
      setUserMathAnswer('');
      setMathFeedback(null);
    } else {
      // Re-init canvas when returning to draw mode
      setTimeout(() => {
        initCanvas();
      }, 50);
    }
  };

  // Canvas drawing coordinate helpers
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

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 1.6;
    } else {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setIsDrawing(true);
    setHasDrawn(true);
    setDrawErrorMessage(null);

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
    setDrawErrorMessage(null);
    setDrawOutcome(null);
    update28x28Preview();
  };

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
      pCtx.drawImage(canvas, 0, 0, 28, 28);
    }
  };

  // Draw Digit Target Change
  const handleNewTargetDigit = () => {
    let nextDigit = Math.floor(Math.random() * 10);
    if (nextDigit === challengeTarget) {
      nextDigit = (nextDigit + 1) % 10;
    }
    setChallengeTarget(nextDigit);
    clearCanvas();
  };

  // Recognize Digit Challenge
  const handleRecognizeChallenge = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasDrawn) {
      setDrawErrorMessage(`Please draw the target digit ${challengeTarget} on the white sheet first!`);
      return;
    }

    setIsPredicting(true);
    setDrawErrorMessage(null);
    update28x28Preview();

    try {
      const result = await predictDigit(canvas);
      if (!result) {
        setDrawErrorMessage('Please draw a clearer digit inside the sheet!');
        setPrediction(null);
      } else {
        setPrediction(result);
        const matched = result.predictedDigit === challengeTarget;

        recordScoreResult(matched);

        if (matched) {
          setStreak((s) => s + 1);
        } else {
          setStreak(0);
        }

        setDrawOutcome({
          matched,
          predictedDigit: result.predictedDigit,
          target: challengeTarget,
        });

        // Smooth scroll to prediction result card
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
      setDrawErrorMessage('Could not process drawing. Please try again!');
    } finally {
      setIsPredicting(false);
    }
  };

  // Maths Question Generator
  const handleNextMathQuestion = () => {
    if (activeMode === 'draw') return;
    const q = createMathQuestion(activeMode);
    setMathQuestion(q);
    setUserMathAnswer('');
    setMathFeedback(null);
    setMathInputError(null);
  };

  // Check Maths Answer
  const handleCheckMathAnswer = () => {
    const trimmed = userMathAnswer.trim();
    if (!trimmed) {
      setMathInputError('Please type or tap a number answer first!');
      return;
    }

    const parsed = parseInt(trimmed, 10);
    if (isNaN(parsed)) {
      setMathInputError('Please enter a valid whole number!');
      return;
    }

    setMathInputError(null);
    const isCorrect = parsed === mathQuestion.answer;

    recordScoreResult(isCorrect);

    if (isCorrect) {
      setStreak((s) => s + 1);
      setMathFeedback({
        submitted: true,
        isCorrect: true,
        message: `🎉 Correct! ${mathQuestion.text} = ${mathQuestion.answer}. Brilliant!`,
        expectedAnswer: mathQuestion.answer,
      });
    } else {
      setStreak(0);
      setMathFeedback({
        submitted: true,
        isCorrect: false,
        message: `Almost! ${mathQuestion.text} = ${mathQuestion.answer}. Keep going! ✨`,
        expectedAnswer: mathQuestion.answer,
      });
    }
  };

  // Keypad button click
  const handleKeypadPress = (val: string) => {
    setMathInputError(null);
    if (val === 'answer') {
      handleCheckMathAnswer();
    } else if (val === 'backspace') {
      setUserMathAnswer((prev) => prev.slice(0, -1));
    } else {
      if (userMathAnswer.length < 4) {
        setUserMathAnswer((prev) => prev + val);
      }
    }
  };

  // Reset Score
  const handleResetScore = () => {
    setChallengeScore({ correct: 0, total: 0 });
    setStreak(0);
    setMathFeedback(null);
    setDrawOutcome(null);

    if (activePlayerName) {
      setPlayers((prev) => {
        const updated = prev.map((p) =>
          p.name.trim().toLowerCase() === activePlayerName.trim().toLowerCase()
            ? { ...p, score: 0, total: 0, updatedAt: Date.now() }
            : p
        );
        saveStoredPlayers(updated);
        return updated;
      });
    }
  };

  return (
    <section className="py-10 sm:py-16 bg-[#E0F2FE] relative overflow-hidden min-h-[calc(100vh-140px)]">
      {/* Background notebook ruled lines */}
      <div className="absolute inset-0 bg-notebook-ruled opacity-40 pointer-events-none" />

      {/* Floating corner doodles */}
      <div className="absolute top-8 left-8 hidden sm:block animate-doodle-bob pointer-events-none select-none opacity-50">
        <DoodleStar className="w-9 h-9" color="#F97316" />
      </div>
      <div className="absolute top-10 right-10 hidden sm:block animate-doodle-bob-delayed pointer-events-none select-none opacity-60">
        <DoodlePencil className="w-10 h-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border-2 border-orange-400 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-orange-600" />
            Slide 3: Mini Challenges & Scoreboard
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Challenge & Scoreboard
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-950 font-handwriting text-lg">
            Choose a challenge below: draw target digits for the AI, or test your maths skills!
          </p>
        </div>

        {/* "Who's playing?" Section */}
        <div className="max-w-3xl mx-auto mb-6 bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 border-2 border-orange-300 flex items-center justify-center text-xl shrink-0">
                🎮
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Who's playing?
                  </h3>
                  {currentPlayer && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                      Active: {currentPlayer.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {currentPlayer
                    ? `Scores are saved on this device. Type a name to switch or add another player!`
                    : 'Enter your name and tap Start to track your score!'}
                </p>
              </div>
            </div>

            {/* Player name input + Start button */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                id="player-name-input"
                type="text"
                value={playerNameInput}
                onChange={(e) => {
                  setPlayerNameError(null);
                  setPlayerNameInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleStartPlayer();
                  }
                }}
                maxLength={20}
                placeholder={currentPlayer ? "New player name..." : "Player name..."}
                className="w-full sm:w-52 px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-400 shadow-[2px_2px_0px_#0f172a] bg-white"
              />

              <button
                id="player-start-btn"
                onClick={() => handleStartPlayer()}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {playerNameError && (
            <div className="mt-2 text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-300 flex items-center gap-1.5 animate-doodle-pulse">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{playerNameError}</span>
            </div>
          )}
        </div>

        {/* Challenge Mode Tabs Bar */}
        <div className="max-w-4xl mx-auto mb-8 bg-white/90 backdrop-blur-xs p-2 sm:p-2.5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a]">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
            {CHALLENGE_TABS.map((tab, idx) => {
              const isActive = activeMode === tab.id;
              const isFifthOnMobile = idx === 4;
              return (
                <button
                  key={tab.id}
                  id={`challenge-tab-${tab.id}`}
                  onClick={() => handleSelectMode(tab.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-2.5 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isFifthOnMobile ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    isActive
                      ? 'bg-orange-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] scale-[1.02]'
                      : 'bg-sky-50/60 text-slate-700 hover:bg-orange-50 hover:text-orange-950 border border-transparent'
                  }`}
                >
                  <span className="text-base select-none">{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Live Score Pill Banner */}
        <div className="max-w-3xl mx-auto mb-8 bg-white rounded-2xl p-3 sm:p-4 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-600 font-bold text-base shadow-xs">
              <Trophy className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {currentPlayer ? `${currentPlayer.name}'s Score:` : 'Challenge Score:'}
                </span>
                <span
                  id="challenge-score-display"
                  className="font-mono font-bold text-base sm:text-lg text-slate-900 bg-orange-100 px-2.5 py-0.5 rounded-lg border border-orange-300"
                >
                  Score: {challengeScore.correct} / {challengeScore.total}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {challengeScore.total > 0
                  ? `Accuracy: ${Math.round((challengeScore.correct / challengeScore.total) * 100)}%`
                  : currentPlayer
                  ? `Ready to play! Solve questions to increase ${currentPlayer.name}'s score.`
                  : 'Start solving questions or enter your name above!'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {streak > 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 shadow-xs animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                {streak} in a row!
              </span>
            )}
            <button
              onClick={handleResetScore}
              className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all cursor-pointer active:scale-95"
              title="Reset score back to 0/0"
            >
              Reset Score
            </button>
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: THE GREEN CHALKBOARD-STYLE FRAME WITH WHITE SHEET / MATH BOARD */}
          <div className="lg:col-span-7">
            {/* Outer Green Chalkboard Frame (Same as Slide 2) */}
            <div className="rounded-3xl p-3.5 sm:p-6 md:p-7 bg-[#1B4D3E] border-4 sm:border-[6px] border-[#0E2F25] shadow-[6px_6px_0px_#0f172a] relative">
              
              {/* MODE 1: DRAW A DIGIT (0–9) */}
              {activeMode === 'draw' && (
                <>
                  {/* Drawing Toolbar Row 1: Pen vs Eraser + 5 Pen Sizes */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pb-3 sm:pb-4 border-b-2 border-[#2C6B56] mb-3.5 gap-3">
                    {/* Tool Selector: Pen vs Eraser */}
                    <div className="flex items-center gap-2 bg-[#0E2F25]/90 p-1.5 rounded-2xl border border-[#2C6B56]">
                      <button
                        id="challenge-tool-pen-btn"
                        onClick={() => setActiveTool('pen')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          activeTool === 'pen'
                            ? 'bg-orange-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                            : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                        }`}
                      >
                        <PenTool className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Pen</span>
                      </button>

                      <button
                        id="challenge-tool-eraser-btn"
                        onClick={() => setActiveTool('eraser')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          activeTool === 'eraser'
                            ? 'bg-rose-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                            : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                        }`}
                        title="Eraser removes strokes"
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

                  {/* Drawing Toolbar Row 2: Dark and Light Pen Colors */}
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
                              onClick={() => {
                                setSelectedColor(col.hex);
                                setActiveTool('pen');
                              }}
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
                              onClick={() => {
                                setSelectedColor(col.hex);
                                setActiveTool('pen');
                              }}
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

                  {/* Target Digit Banner on Chalkboard */}
                  <div className="mb-4 bg-[#0E2F25] rounded-2xl p-3 sm:p-4 border-2 border-[#2C6B56] flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                        Assigned Target:
                      </span>
                      <span
                        id="challenge-target-digit"
                        className="px-4 py-1 rounded-xl bg-orange-500 text-white font-heading font-bold text-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                      >
                        Draw: {challengeTarget}
                      </span>
                    </div>

                    <button
                      id="new-target-digit-btn"
                      onClick={handleNewTargetDigit}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-900 bg-orange-200 hover:bg-orange-300 border border-orange-400 transition-all cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-700" />
                      <span>New Target Digit</span>
                    </button>
                  </div>

                  {/* LARGE RECTANGULAR WHITE DRAWING SHEET (SAME AS SLIDE 2) */}
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
                            {challengeTarget}
                          </span>
                          <span className="font-handwriting text-base sm:text-lg font-bold text-slate-500 mt-2 select-none px-4 text-center">
                            ✏️ Draw target digit {challengeTarget} inside this sheet!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Error notice */}
                    {drawErrorMessage && (
                      <div className="mt-3 text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-300 flex items-center gap-1.5 animate-doodle-pulse">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {drawErrorMessage}
                      </div>
                    )}

                    {/* Instant Drawing Feedback Banner */}
                    {drawOutcome && (
                      <div
                        className={`mt-3.5 w-full max-w-[440px] text-xs sm:text-sm font-bold font-handwriting px-3.5 py-2 rounded-2xl border-2 shadow-xs ${
                          drawOutcome.matched
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                            : 'bg-orange-100 text-orange-950 border-orange-400'
                        }`}
                      >
                        {drawOutcome.matched
                          ? `🎉 You're correct! The AI clearly recognized digit ${drawOutcome.predictedDigit}!`
                          : `Almost! The AI saw digit ${drawOutcome.predictedDigit}. Try drawing digit ${challengeTarget} again! ✨`}
                      </div>
                    )}

                    {/* ACTION TOOLBAR: Clear Sheet + Grid Toggle + Recognize Button */}
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
                        <Grid className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
                        <span>Grid</span>
                      </button>

                      <button
                        id="recognize-digit-btn"
                        onClick={handleRecognizeChallenge}
                        disabled={isPredicting}
                        className="w-full sm:w-auto sm:flex-1 order-last sm:order-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>{isPredicting ? 'Testing...' : 'Recognize'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 28x28 Preprocessing Sensor Card */}
                  <div className="mt-6 pt-4 border-t-2 border-[#2C6B56] flex items-center justify-between bg-[#0E2F25]/80 p-3.5 sm:p-4 rounded-2xl border border-[#2C6B56]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center p-1 border-2 border-white/20 shadow-xs">
                        <canvas
                          ref={previewCanvasRef}
                          width={28}
                          height={28}
                          className="w-9 h-9 [image-rendering:pixelated]"
                        />
                      </div>
                      <div>
                        <h4 className="font-heading text-sm font-bold text-emerald-100">
                          What The AI Eyes See (28×28)
                        </h4>
                        <p className="text-xs text-emerald-300 font-handwriting">
                          Grayscale tensor fed to MNIST model
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white rounded-lg text-orange-600 border border-orange-300 shadow-xs">
                      28×28 MNIST
                    </span>
                  </div>
                </>
              )}

              {/* MODE 2, 3, 4, 5: MATHS CHALLENGES (Addition, Subtraction, Multiplication, Division) */}
              {activeMode !== 'draw' && (
                <div className="flex flex-col items-center justify-center py-2 sm:py-4">
                  {/* Chalkboard Banner */}
                  <div className="w-full mb-4 bg-[#0E2F25] rounded-2xl p-3 sm:p-4 border-2 border-[#2C6B56] flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-orange-500 text-white font-bold text-xs sm:text-sm border border-slate-900 shadow-xs">
                        {CHALLENGE_TABS.find((t) => t.id === activeMode)?.icon}{' '}
                        {CHALLENGE_TABS.find((t) => t.id === activeMode)?.badge}
                      </span>
                      <span className="text-xs text-emerald-200 hidden sm:inline">
                        Solve the question below:
                      </span>
                    </div>

                    <button
                      id="next-math-question-btn"
                      onClick={handleNextMathQuestion}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-950 bg-orange-200 hover:bg-orange-300 border border-orange-400 transition-all cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-700" />
                      <span>Next Question</span>
                    </button>
                  </div>

                  {/* Math Question Slate Sheet (Styled like the large white sheet) */}
                  <div className="w-full max-w-[460px] bg-white rounded-2xl p-4 sm:p-6 border-4 border-slate-900 shadow-2xl relative overflow-hidden">
                    {/* Math Question Header */}
                    <div className="text-center mb-3 sm:mb-4">
                      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                        Solve Beginner Challenge
                      </span>
                      {/* Big clear math question */}
                      <div className="mt-2 flex items-center justify-center gap-2.5 sm:gap-3.5 font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 select-none">
                        <span>{mathQuestion.num1}</span>
                        <span className="text-orange-500">{mathQuestion.operation}</span>
                        <span>{mathQuestion.num2}</span>
                        <span className="text-slate-400">=</span>
                        <span className="px-3 py-1 bg-orange-50 border-2 border-orange-400 rounded-xl text-orange-600 min-w-[56px] text-center font-mono">
                          {userMathAnswer ? userMathAnswer : '?'}
                        </span>
                      </div>
                    </div>

                    {/* Compact Phone-Calculator "Your Answer" Field */}
                    <div className="max-w-[280px] w-full mx-auto mb-2.5">
                      <div className="bg-slate-100 rounded-xl border-2 border-slate-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200/60 px-3 py-1.5 flex items-center justify-between shadow-inner transition-all">
                        <label
                          htmlFor="math-answer-input"
                          className="text-[11px] font-bold font-mono text-slate-500 uppercase tracking-wider select-none shrink-0"
                        >
                          Your Answer:
                        </label>
                        <input
                          id="math-answer-input"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={userMathAnswer}
                          onChange={(e) => {
                            setMathInputError(null);
                            const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                            setUserMathAnswer(cleaned);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCheckMathAnswer();
                            }
                          }}
                          placeholder="0"
                          className="w-full bg-transparent text-right font-mono text-xl sm:text-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                        />
                      </div>

                      {mathInputError && (
                        <p className="mt-1 text-center text-xs font-bold text-orange-700 bg-orange-100 py-1 px-2 rounded-lg border border-orange-300">
                          {mathInputError}
                        </p>
                      )}
                    </div>

                    {/* Interactive Touch Keypad (0–9, Answer, Backspace) */}
                    <div className="max-w-[280px] w-full mx-auto bg-slate-50 p-2.5 rounded-2xl border-2 border-slate-200">
                      <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                          <button
                            key={digit}
                            onClick={() => handleKeypadPress(digit)}
                            className="h-10 rounded-xl bg-white hover:bg-orange-50 text-slate-900 font-mono font-bold text-lg border border-slate-300 shadow-xs transition-all cursor-pointer active:scale-90"
                          >
                            {digit}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          id="keypad-answer-btn"
                          onClick={() => handleKeypadPress('answer')}
                          className="h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm border border-orange-600 shadow-xs transition-all cursor-pointer active:scale-90 flex items-center justify-center"
                          title="Check answer"
                        >
                          Answer
                        </button>
                        <button
                          onClick={() => handleKeypadPress('0')}
                          className="h-10 rounded-xl bg-white hover:bg-orange-50 text-slate-900 font-mono font-bold text-lg border border-slate-300 shadow-xs transition-all cursor-pointer active:scale-90"
                        >
                          0
                        </button>
                        <button
                          onClick={() => handleKeypadPress('backspace')}
                          className="h-10 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-all cursor-pointer active:scale-90"
                          title="Delete last digit"
                        >
                          ⌫ Back
                        </button>
                      </div>
                    </div>

                    {/* Outcome Feedback Message */}
                    {mathFeedback && (
                      <div
                        id="math-feedback-box"
                        className={`mt-3 max-w-[280px] w-full mx-auto p-3 rounded-2xl border-2 text-center transition-all ${
                          mathFeedback.isCorrect
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                            : 'bg-orange-50 text-orange-900 border-orange-400'
                        }`}
                      >
                        <div className="font-heading font-bold text-xs sm:text-sm">
                          {mathFeedback.message}
                        </div>
                        <button
                          onClick={handleNextMathQuestion}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
                        >
                          <span>Try Next Question</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: PREDICTION & SCORECARD / NEURAL NET READOUT */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* CARD 1: Outcome Card */}
            {activeMode === 'draw' ? (
              prediction ? (
                <div
                  ref={resultRef}
                  id="prediction-result-card"
                  className="bg-orange-500 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-[5px_5px_0px_#0f172a] relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b-2 border-orange-400/80 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-orange-700 text-xs font-bold uppercase tracking-wider shadow-xs">
                      AI Recognition Result
                    </span>
                    <span className="text-xs font-bold text-orange-100 font-mono">
                      Real MNIST Model
                    </span>
                  </div>

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

                  {/* Friendly feedback */}
                  <div className="mt-4 pt-3 border-t-2 border-orange-400/80 bg-white/15 p-3.5 rounded-2xl border border-white/20">
                    {drawOutcome?.matched ? (
                      <>
                        <div className="font-heading text-base font-bold text-white mb-0.5">
                          🎉 You're correct! Amazing!
                        </div>
                        <div className="font-handwriting text-lg text-orange-100 font-bold">
                          ✨ That's right! Target {challengeTarget} recognized with {prediction.confidence}% confidence!
                        </div>
                      </>
                    ) : (
                      <div className="font-handwriting text-lg text-orange-100 font-bold">
                        Almost! Target was {challengeTarget}, but the AI saw {prediction.predictedDigit}. Try again! ✨
                      </div>
                    )}
                  </div>

                  {/* Learning Fact callout inside result card */}
                  <div className="mt-3.5 pt-3 border-t border-orange-400/80 bg-white/20 p-2.5 rounded-2xl border border-white/25 flex items-start gap-2.5 text-left">
                    <span className="text-base select-none shrink-0" role="img" aria-label="lightbulb">💡</span>
                    <div className="text-xs sm:text-sm font-normal text-white leading-snug">
                      <span className="font-semibold text-amber-200">Did You Know? </span>
                      {currentFact.fact}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-heading text-2xl font-bold flex items-center justify-center border-2 border-slate-900 shadow-xs shrink-0">
                    {challengeTarget}
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-slate-900">
                      Challenge Target: Digit {challengeTarget}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Draw digit {challengeTarget} on the white sheet, then tap Recognize!
                    </p>
                  </div>
                </div>
              )
            ) : (
              /* Maths Mode Status Card */
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a]">
                <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                      {CHALLENGE_TABS.find((t) => t.id === activeMode)?.icon}
                    </span>
                    <h4 className="font-heading text-base font-bold text-slate-900">
                      {CHALLENGE_TABS.find((t) => t.id === activeMode)?.label} Challenge
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Active Mode
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4">
                  {CHALLENGE_TABS.find((t) => t.id === activeMode)?.description}
                </p>

                {/* Score Summary Box */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-sky-50 rounded-2xl p-3 border border-sky-200">
                    <div className="text-[11px] font-bold uppercase text-slate-500">Correct Answers</div>
                    <div className="font-heading text-2xl font-bold text-slate-900 mt-0.5">
                      {challengeScore.correct}
                    </div>
                  </div>
                  <div className="bg-sky-50 rounded-2xl p-3 border border-sky-200">
                    <div className="text-[11px] font-bold uppercase text-slate-500">Total Played</div>
                    <div className="font-heading text-2xl font-bold text-slate-900 mt-0.5">
                      {challengeScore.total}
                    </div>
                  </div>
                </div>

                {/* Quick switcher to other challenges */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    Switch Mini Challenge:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CHALLENGE_TABS.filter((t) => t.id !== activeMode).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleSelectMode(tab.id)}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-orange-100 text-slate-800 border border-slate-300 transition-all cursor-pointer"
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CARD: Simple Scoreboard (Player Name | Score) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-base shadow-xs">
                    🏆
                  </span>
                  <div>
                    <h4 className="font-heading text-base font-bold text-slate-900">
                      Scoreboard
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Saved on this device
                    </p>
                  </div>
                </div>
                {players.length > 0 && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {players.length} {players.length === 1 ? 'Player' : 'Players'}
                  </span>
                )}
              </div>

              {players.length === 0 ? (
                <div className="py-5 px-4 text-center rounded-2xl bg-sky-50/50 border border-sky-200/60">
                  <p className="text-xs font-bold text-slate-700">No players saved yet</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enter your name in "Who's playing?" above and tap Start!
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border-2 border-slate-900">
                  {/* Table Header: Player Name | Score */}
                  <div className="grid grid-cols-12 bg-slate-900 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider">
                    <div className="col-span-8">Player Name</div>
                    <div className="col-span-4 text-right">Score</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto bg-white">
                    {sortedPlayers.map((player, idx) => {
                      const isActive =
                        currentPlayer?.name.trim().toLowerCase() ===
                        player.name.trim().toLowerCase();
                      return (
                        <div
                          key={player.id || player.name}
                          onClick={() => handleSwitchPlayer(player)}
                          className={`grid grid-cols-12 items-center px-3.5 py-2.5 text-xs transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-orange-100/70 font-bold border-l-4 border-l-orange-500'
                              : 'hover:bg-orange-50/50'
                          }`}
                          title={`Tap to play as ${player.name}`}
                        >
                          <div className="col-span-8 flex items-center gap-2 truncate pr-2">
                            <span className="font-mono text-slate-400 w-4 text-[11px] select-none">
                              {idx === 0 ? '👑' : `${idx + 1}.`}
                            </span>
                            <span className="truncate text-slate-900 font-medium">
                              {player.name}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.5 rounded-md bg-orange-500 text-white text-[10px] font-bold uppercase tracking-tight shrink-0">
                                Playing
                              </span>
                            )}
                          </div>
                          <div className="col-span-4 text-right font-mono font-bold text-slate-900">
                            <span className="text-sm text-orange-600">{player.score}</span>
                            <span className="text-[11px] text-slate-400 ml-1 font-normal">
                              / {player.total}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {players.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Tap a name to switch player
                  </span>
                  <button
                    onClick={handleClearScoreboard}
                    className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Clear saved scoreboard from this device"
                  >
                    Clear Board
                  </button>
                </div>
              )}
            </div>

            {/* CARD 2: Neural Network Probabilities (0–9) Scoreboard (Shown for Draw Digit) */}
            {activeMode === 'draw' && (
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

                <div className="space-y-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
                    const prob = prediction ? prediction.probabilities[digit] : null;
                    const percent = prob !== null ? Math.round(prob * 100) : null;
                    const isTop = prediction ? prediction.predictedDigit === digit : false;
                    const isTarget = digit === challengeTarget;

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
                              : isTarget
                              ? 'bg-sky-200 border border-sky-400 text-slate-900 font-bold'
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
              </div>
            )}

            {/* Back to Writing Board Card */}
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center justify-between">
              <div>
                <span className="font-heading text-sm font-bold text-slate-900 block">
                  Free drawing practice?
                </span>
                <span className="text-xs text-slate-500">
                  Switch back to Slide 2 writing board anytime
                </span>
              </div>
              <button
                id="back-to-board-btn"
                onClick={onBackToBoard}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-orange-50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:shadow-[1px_1px_0px_#0f172a] transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <span>← Writing Board</span>
              </button>
            </div>
          </div>
        </div>

        {/* Slide 3: Did You Know? Learning Card with Cute Doodle Robot */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto w-full">
          <DoodleRobotWithBoard
            badge={currentFact.badge || 'Did You Know? 🎯'}
            factText={currentFact.fact}
            subText={currentFact.tip || 'Draw digits clearly or solve maths challenges to test your skills!'}
          />
        </div>
      </div>
    </section>
  );
};
