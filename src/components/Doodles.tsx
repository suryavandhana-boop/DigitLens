import React from 'react';

// Cute hand-drawn star
export const DoodleStar: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#F97316',
}) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 4 C21 13, 24 16, 34 18 C25 21, 22 25, 20 36 C18 26, 15 22, 5 19 C14 17, 18 13, 20 4 Z"
      fill={color}
      stroke="#1E293B"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

// Cute hand-drawn pencil
export const DoodlePencil: React.FC<{ className?: string }> = ({
  className = 'w-10 h-10',
}) => (
  <svg
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Pencil body */}
    <path
      d="M12 48 L44 16 L52 24 L20 56 L8 58 L12 48 Z"
      fill="#F97316"
      stroke="#1E293B"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Lead tip */}
    <path
      d="M8 58 L14 52 L10 48 Z"
      fill="#1E293B"
    />
    {/* Stripes on pencil */}
    <path d="M22 26 L46 50" stroke="#FDBA74" strokeWidth="2" strokeDasharray="3 3" />
    {/* Eraser */}
    <path
      d="M44 16 L49 11 C51 9, 55 9, 57 11 C59 13, 59 17, 57 19 L52 24 Z"
      fill="#FB7185"
      stroke="#1E293B"
      strokeWidth="2.5"
    />
    {/* Metal ferrule */}
    <path
      d="M42 18 L50 26"
      stroke="#E2E8F0"
      strokeWidth="4"
    />
  </svg>
);

// Cute hand-drawn light bulb
export const DoodleLightBulb: React.FC<{ className?: string }> = ({
  className = 'w-8 h-8',
}) => (
  <svg
    viewBox="0 0 50 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Glow rays */}
    <path d="M25 4 L25 10" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 12 L15 16" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M40 12 L35 16" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
    {/* Bulb glass */}
    <path
      d="M25 12 C16 12, 11 18, 11 27 C11 33, 16 38, 18 42 L32 42 C34 38, 39 33, 39 27 C39 18, 34 12, 25 12 Z"
      fill="#FEF08A"
      stroke="#1E293B"
      strokeWidth="2.5"
    />
    {/* Filament smile */}
    <path
      d="M21 28 Q25 32 29 28"
      stroke="#F97316"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Eyes */}
    <circle cx="20" cy="24" r="1.5" fill="#1E293B" />
    <circle cx="30" cy="24" r="1.5" fill="#1E293B" />
    {/* Bulb base */}
    <path
      d="M19 44 L31 44 M20 48 L30 48 M22 52 L28 52"
      stroke="#64748B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// Cute hand-drawn notebook
export const DoodleNotebook: React.FC<{ className?: string }> = ({
  className = 'w-9 h-9',
}) => (
  <svg
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Notebook cover */}
    <rect
      x="12"
      y="8"
      width="32"
      height="36"
      rx="4"
      fill="#38BDF8"
      stroke="#1E293B"
      strokeWidth="2.5"
    />
    {/* Pages line */}
    <rect
      x="16"
      y="12"
      width="24"
      height="28"
      rx="2"
      fill="#FFFFFF"
      stroke="#1E293B"
      strokeWidth="1.5"
    />
    {/* Lines on page */}
    <line x1="20" y1="18" x2="36" y2="18" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="24" x2="36" y2="24" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="30" x2="32" y2="30" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
    {/* Wire spirals */}
    <circle cx="12" cy="14" r="2.5" fill="#F97316" stroke="#1E293B" strokeWidth="1.5" />
    <circle cx="12" cy="22" r="2.5" fill="#F97316" stroke="#1E293B" strokeWidth="1.5" />
    <circle cx="12" cy="30" r="2.5" fill="#F97316" stroke="#1E293B" strokeWidth="1.5" />
    <circle cx="12" cy="38" r="2.5" fill="#F97316" stroke="#1E293B" strokeWidth="1.5" />
  </svg>
);

// Green Board Card Component
export const GreenBoardCard: React.FC<{
  badge?: string;
  fact: string;
  tip?: string;
  className?: string;
  onNextFact?: () => void;
  nextFactLabel?: string;
}> = ({
  badge = 'Did You Know?',
  fact,
  tip,
  className = '',
  onNextFact,
  nextFactLabel = 'Next 💡',
}) => {
  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 border-4 border-[#8B5E3C] shadow-lg bg-[#1B382B] text-white overflow-hidden ${className}`}
      style={{
        boxShadow: '0 8px 20px -4px rgba(27, 56, 43, 0.4), inset 0 0 16px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Chalkboard texture lines / corners */}
      <div className="absolute top-2 left-2 text-[#4ade80]/40 text-[10px] select-none pointer-events-none font-chalk">
        ✎ 123...
      </div>
      <div className="absolute top-2 right-2 text-[#fde047]/40 text-xs select-none pointer-events-none">
        ★
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#27533E] text-[#86EFAC] text-xs font-bold border border-[#3b7a5c] tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                {badge}
              </div>
            )}
            {onNextFact && (
              <button
                type="button"
                onClick={onNextFact}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#27533E] hover:bg-[#346d52] text-[#86EFAC] text-[11px] font-bold border border-[#3b7a5c] transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Shuffle / see another fact"
              >
                <span>{nextFactLabel}</span>
              </button>
            )}
          </div>
          <p className="font-chalk text-base sm:text-lg leading-snug tracking-wide text-emerald-50">
            "{fact}"
          </p>
        </div>

        {tip && (
          <div className="mt-3 pt-2.5 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200/90 font-handwriting">
            <span>{tip}</span>
            <span className="text-orange-400">✨</span>
          </div>
        )}
      </div>

      {/* Little chalk eraser resting on wooden frame ledge */}
      <div className="absolute -bottom-1 right-6 w-8 h-2.5 bg-[#D97706] rounded-xs border border-[#92400E] shadow-xs" />
    </div>
  );
};

// Cute cartoon student holding a green blackboard card
export const DoodleStudentWithBoard: React.FC<{
  factText?: string;
  badge?: string;
  subText?: string;
  className?: string;
  onNextFact?: () => void;
  nextFactLabel?: string;
}> = ({
  factText = 'AI learns from examples just like you learn your ABCs!',
  badge = 'Did you know?',
  subText = 'Every digit has its own pattern!',
  className = '',
  onNextFact,
  nextFactLabel = 'Next 💡',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      {/* Cute Student Character Illustration (Hand-drawn Vector) */}
      <div className="shrink-0 relative group">
        <svg
          viewBox="0 0 120 140"
          className="w-28 h-32 drop-shadow-md select-none transition-transform group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Backpack straps */}
          <path d="M35 75 Q20 95 28 120" stroke="#F97316" strokeWidth="6" strokeLinecap="round" />
          <path d="M85 75 Q100 95 92 120" stroke="#F97316" strokeWidth="6" strokeLinecap="round" />

          {/* Student Body (Striped blue t-shirt) */}
          <path
            d="M32 75 C32 68, 88 68, 88 75 L92 130 C92 135, 28 135, 28 130 Z"
            fill="#38BDF8"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Shirt stripes */}
          <path d="M30 92 L90 92" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M29 110 L91 110" stroke="#FFFFFF" strokeWidth="4" />

          {/* Head & Neck */}
          <rect x="52" y="58" width="16" height="14" fill="#FDBA74" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="60" cy="40" r="24" fill="#FED7AA" stroke="#0F172A" strokeWidth="3" />

          {/* Hair (cute cartoon mop) */}
          <path
            d="M36 36 C36 20, 50 14, 60 14 C75 14, 84 22, 84 36 C80 32, 70 30, 60 32 C50 30, 42 33, 36 36 Z"
            fill="#78350F"
            stroke="#0F172A"
            strokeWidth="3"
          />
          {/* Cute Orange Cap */}
          <path
            d="M38 32 C40 18, 55 12, 72 16 L88 24 C94 26, 90 32, 80 32 Z"
            fill="#F97316"
            stroke="#0F172A"
            strokeWidth="3"
          />
          <ellipse cx="80" cy="28" rx="10" ry="3" fill="#EA580C" />

          {/* Cute Round Glasses */}
          <circle cx="50" cy="40" r="7" fill="#E0F2FE" fillOpacity="0.7" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="70" cy="40" r="7" fill="#E0F2FE" fillOpacity="0.7" stroke="#0F172A" strokeWidth="2.5" />
          <line x1="57" y1="40" x2="63" y2="40" stroke="#0F172A" strokeWidth="2.5" />

          {/* Smiling eyes & pupils */}
          <circle cx="51" cy="40" r="2.5" fill="#0F172A" />
          <circle cx="71" cy="40" r="2.5" fill="#0F172A" />
          <circle cx="52" cy="38.5" r="1" fill="#FFFFFF" />
          <circle cx="72" cy="38.5" r="1" fill="#FFFFFF" />

          {/* Rosy cheeks */}
          <ellipse cx="44" cy="46" rx="3" ry="2" fill="#F43F5E" fillOpacity="0.4" />
          <ellipse cx="76" cy="46" rx="3" ry="2" fill="#F43F5E" fillOpacity="0.4" />

          {/* Big happy smile */}
          <path d="M54 48 Q60 54 66 48" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Cute hands holding board */}
          <circle cx="22" cy="80" r="7" fill="#FED7AA" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="98" cy="80" r="7" fill="#FED7AA" stroke="#0F172A" strokeWidth="2.5" />
        </svg>

        {/* Small floating pencil accessory */}
        <div className="absolute -top-2 -right-1 animate-doodle-bob">
          <DoodlePencil className="w-8 h-8" />
        </div>
      </div>

      {/* The Chalkboard / Green Board */}
      <div className="flex-1 max-w-md w-full">
        <GreenBoardCard
          badge={badge}
          fact={factText}
          tip={subText}
          onNextFact={onNextFact}
          nextFactLabel={nextFactLabel}
        />
      </div>
    </div>
  );
};

// Cute cartoon friendly robot holding a chalkboard
export const DoodleRobotWithBoard: React.FC<{
  factText?: string;
  badge?: string;
  subText?: string;
  className?: string;
  onNextFact?: () => void;
  nextFactLabel?: string;
}> = ({
  factText = 'Quick Tip: Every digit has its own pattern!',
  badge = 'AI Quick Tip',
  subText = 'Draw bold and clear in the middle!',
  className = '',
  onNextFact,
  nextFactLabel = 'Next 💡',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      {/* Cute Robot Character */}
      <div className="shrink-0 relative group">
        <svg
          viewBox="0 0 120 130"
          className="w-28 h-30 drop-shadow-md select-none transition-transform group-hover:rotate-2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <line x1="60" y1="24" x2="60" y2="8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="7" r="5" fill="#F97316" stroke="#0F172A" strokeWidth="2.5" />
          {/* Antenna pulse */}
          <circle cx="60" cy="7" r="8" stroke="#FDBA74" strokeWidth="1.5" strokeDasharray="2 2" />

          {/* Robot Head */}
          <rect
            x="34"
            y="24"
            width="52"
            height="44"
            rx="12"
            fill="#BAE6FD"
            stroke="#0F172A"
            strokeWidth="3"
          />
          {/* Ear bolts */}
          <rect x="28" y="38" width="6" height="14" rx="2" fill="#F97316" stroke="#0F172A" strokeWidth="2" />
          <rect x="86" y="38" width="6" height="14" rx="2" fill="#F97316" stroke="#0F172A" strokeWidth="2" />

          {/* Face screen */}
          <rect
            x="42"
            y="32"
            width="36"
            height="26"
            rx="6"
            fill="#0F172A"
          />
          {/* Glowing teal eyes */}
          <circle cx="50" cy="43" r="4" fill="#38BDF8" />
          <circle cx="70" cy="43" r="4" fill="#38BDF8" />
          <circle cx="51" cy="42" r="1.5" fill="#FFFFFF" />
          <circle cx="71" cy="42" r="1.5" fill="#FFFFFF" />
          {/* Digital smile */}
          <path d="M56 49 Q60 52 64 49" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />

          {/* Body */}
          <rect
            x="38"
            y="72"
            width="44"
            height="42"
            rx="8"
            fill="#E0F2FE"
            stroke="#0F172A"
            strokeWidth="3"
          />
          {/* Heart / meter gauge on chest */}
          <circle cx="60" cy="90" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <path d="M57 90 L63 90" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 87 L60 93" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />

          {/* Hands holding the board */}
          <circle cx="30" cy="92" r="6" fill="#F97316" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="90" cy="92" r="6" fill="#F97316" stroke="#0F172A" strokeWidth="2.5" />
        </svg>

        {/* Small floating lightbulb */}
        <div className="absolute -top-2 -left-2 animate-doodle-bob-delayed">
          <DoodleLightBulb className="w-8 h-8" />
        </div>
      </div>

      {/* The Chalkboard Card */}
      <div className="flex-1 max-w-md w-full">
        <GreenBoardCard
          badge={badge}
          fact={factText}
          tip={subText}
          onNextFact={onNextFact}
          nextFactLabel={nextFactLabel}
        />
      </div>
    </div>
  );
};
