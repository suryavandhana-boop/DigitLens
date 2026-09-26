import React from 'react';
import { Pencil, Sparkles, Heart } from 'lucide-react';
import { DoodleStar } from './Doodles';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#BAE6FD]/40 border-t-2 border-sky-300 py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 border-2 border-slate-900 flex items-center justify-center text-white shadow-[2px_2px_0px_#0f172a]">
              <Pencil className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-slate-900">
                Digit<span className="text-orange-500">Lens</span>
              </div>
              <div className="text-xs text-sky-950 font-handwriting font-bold">
                Write it. Let AI recognize it.
              </div>
            </div>
          </div>

          <div className="text-xs font-handwriting font-bold text-sky-950 text-center sm:text-right">
            ✏️ Draw numbers. Explore patterns. Have fun!
          </div>
        </div>
      </div>
    </footer>
  );
};
