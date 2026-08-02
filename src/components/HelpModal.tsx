import React from 'react';
import { TranslationDictionary } from '../utils/translations';
import { Compass, X, BookOpen, Target, Layers, HardHat } from 'lucide-react';

interface HelpModalProps {
  t: TranslationDictionary;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ t, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#105b48] to-[#1BBF89] text-white shadow-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Kamyar Grid Calculator - Survey Engineering Guide
              </h2>
              <p className="text-xs text-slate-400">
                Mathematical Formulations & Field Leveling Manual
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-5 space-y-5 text-xs text-slate-300">
          {/* Section 1: Instrument Leveling Setup */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              1. Height of Instrument (HI) & Staff Readings
            </h3>
            <p className="text-slate-400">
              In optical optical or digital level surveying, the Height of Instrument (HI) establishes the absolute line of sight elevation.
            </p>
            <div className="rounded-lg bg-slate-900 p-3 font-mono text-emerald-300 space-y-1">
              <div>• Height of Instrument (HI) = Benchmark RL + Back Sight (BS)</div>
              <div>• Required Staff Reading = HI - Design RL</div>
            </div>
          </div>

          {/* Section 2: Earthwork Cut & Fill Formulas */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <HardHat className="h-4 w-4" />
              2. Earthwork Cut & Fill Volumetrics
            </h3>
            <p className="text-slate-400">
              The Grid Method (Prismoidal / Quarter Cell Sum) divides the site into rectangular cells ($S_x \times S_y$).
            </p>
            <div className="rounded-lg bg-slate-900 p-3 font-mono text-slate-200 space-y-1">
              <div>• Station Elevation Difference = Existing RL - Design RL</div>
              <div>• Cut = max(0, Existing RL - Design RL)</div>
              <div>• Fill = max(0, Design RL - Existing RL)</div>
              <div>• Grid Cell Volume = (Cell Area) × (Average Cut or Fill of 4 Corner Points)</div>
            </div>
          </div>

          {/* Section 3: Design Surface Modes */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <Layers className="h-4 w-4" />
              3. Design Surface Profiles
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong className="text-white">Flat Level:</strong> Uniform target elevation across all grid stations.</li>
              <li><strong className="text-white">One-Way Slope:</strong> Linear grade interpolation from start elevation to end elevation along selected compass heading.</li>
              <li><strong className="text-white">Two-Way Slope:</strong> Dual-axis cross slopes along X and Y axes.</li>
              <li><strong className="text-white">Four-Way Crown Slope:</strong> Center peak/crown sloping outwards to site perimeter.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-800 pt-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#105b48] px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-600"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
