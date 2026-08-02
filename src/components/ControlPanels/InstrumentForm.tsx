import React from 'react';
import { InstrumentData } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import { Target, Eye, Ruler, Info } from 'lucide-react';

interface InstrumentFormProps {
  instrument: InstrumentData;
  onChange: (instrument: InstrumentData) => void;
  t: TranslationDictionary;
}

export const InstrumentForm: React.FC<InstrumentFormProps> = ({ instrument, onChange, t }) => {
  const handleBenchmarkChange = (val: number) => {
    const bm = isNaN(val) ? 0 : val;
    onChange({
      benchmarkRL: bm,
      backSight: instrument.backSight,
      heightOfInstrument: Number((bm + instrument.backSight).toFixed(3)),
    });
  };

  const handleBackSightChange = (val: number) => {
    const bs = isNaN(val) ? 0 : val;
    onChange({
      benchmarkRL: instrument.benchmarkRL,
      backSight: bs,
      heightOfInstrument: Number((instrument.benchmarkRL + bs).toFixed(3)),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Target className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.instrumentLeveling}</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Benchmark RL */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5 text-slate-400" />
              {t.benchmarkRL}
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.001"
              value={instrument.benchmarkRL}
              onChange={(e) => handleBenchmarkChange(parseFloat(e.target.value))}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-semibold text-emerald-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
            <Info className="h-3 w-3 text-slate-500" />
            {t.benchmarkRLTooltip}
          </p>
        </div>

        {/* Back Sight (BS) */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              {t.backSight}
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.001"
              value={instrument.backSight}
              onChange={(e) => handleBackSightChange(parseFloat(e.target.value))}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-semibold text-emerald-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
            <Info className="h-3 w-3 text-slate-500" />
            {t.backSightTooltip}
          </p>
        </div>
      </div>

      {/* Auto HI Display Card */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-slate-900/80 p-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              {t.heightOfInstrument}
            </span>
            <span className="text-xl font-extrabold font-mono text-white tracking-tight">
              {instrument.heightOfInstrument.toFixed(3)} <span className="text-xs font-normal text-emerald-300">m</span>
            </span>
          </div>
          <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-right text-[10px] font-mono text-emerald-300 border border-emerald-500/20">
            {t.hiFormula}
          </div>
        </div>
      </div>
    </div>
  );
};
