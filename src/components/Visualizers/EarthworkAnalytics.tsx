import React from 'react';
import { EarthworkSummary, EarthworkMethod } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import { HardHat, Calculator, TrendingUp, TrendingDown, Layers, Award, Scale } from 'lucide-react';

interface EarthworkAnalyticsProps {
  summary: EarthworkSummary;
  earthworkMethod: EarthworkMethod;
  onChangeMethod: (method: EarthworkMethod) => void;
  t: TranslationDictionary;
}

export const EarthworkAnalytics: React.FC<EarthworkAnalyticsProps> = ({
  summary,
  earthworkMethod,
  onChangeMethod,
  t,
}) => {
  const totalVolumeSum = summary.totalCutVolume + summary.totalFillVolume || 1;
  const cutPercent = Math.round((summary.totalCutVolume / totalVolumeSum) * 100);
  const fillPercent = Math.round((summary.totalFillVolume / totalVolumeSum) * 100);

  return (
    <div className="flex flex-col h-full w-full rounded-2xl border border-slate-800 bg-slate-950/90 p-5 overflow-y-auto space-y-6 shadow-2xl">
      {/* Header & Method Switcher */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HardHat className="h-5 w-5 text-emerald-400" />
            {t.earthworkVolume}
          </h2>
          <p className="text-xs text-slate-400">
            Computed site excavation & embankment quantities across {summary.totalPoints} grid stations ({summary.totalArea} m²).
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-slate-900 p-1 ring-1 ring-slate-800 text-xs">
          <button
            onClick={() => onChangeMethod('Grid Method')}
            className={`rounded-lg px-3 py-1.5 font-semibold transition ${
              earthworkMethod === 'Grid Method'
                ? 'bg-[#105b48] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.gridMethod}
          </button>
          <button
            onClick={() => onChangeMethod('Average End Area')}
            className={`rounded-lg px-3 py-1.5 font-semibold transition ${
              earthworkMethod === 'Average End Area'
                ? 'bg-[#105b48] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.averageEndArea}
          </button>
        </div>
      </div>

      {/* Primary KPI Volume Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Cut Volume */}
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/30 to-slate-900/80 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              {t.cutVolume}
            </span>
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-mono text-red-300">
              Cut Excavation
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {summary.totalCutVolume.toLocaleString()} <span className="text-sm font-normal text-red-300">m³</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Avg Cut Depth: <span className="font-mono text-white font-bold">{summary.averageCut} m</span>
          </div>
        </div>

        {/* Total Fill Volume */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-900/80 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4" />
              {t.fillVolume}
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
              Fill Embankment
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {summary.totalFillVolume.toLocaleString()} <span className="text-sm font-normal text-emerald-300">m³</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Avg Fill Height: <span className="font-mono text-white font-bold">{summary.averageFill} m</span>
          </div>
        </div>

        {/* Net Volume Balance */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-slate-900/80 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Scale className="h-4 w-4" />
              {t.netVolume}
            </span>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
              Balance Ratio
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {summary.netVolume >= 0 ? `+${summary.netVolume.toLocaleString()}` : summary.netVolume.toLocaleString()}{' '}
            <span className="text-sm font-normal text-amber-300">m³</span>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-amber-300">
            {summary.netVolume > 0 ? t.surplusCut : summary.netVolume < 0 ? t.deficitFill : t.balanced}
          </div>
        </div>
      </div>

      {/* Earthwork Distribution Ratio Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-red-400">Cut Ratio ({cutPercent}%)</span>
          <span className="text-emerald-400">Fill Ratio ({fillPercent}%)</span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800 p-0.5">
          <div style={{ width: `${cutPercent}%` }} className="h-full rounded-l-full bg-red-500 transition-all duration-500" />
          <div style={{ width: `${fillPercent}%` }} className="h-full rounded-r-full bg-emerald-500 transition-all duration-500" />
        </div>
      </div>

      {/* Detailed Elevation Statistics Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-emerald-400" />
          Site Topography & Design Statistics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">{t.highestExisting}</span>
            <span className="font-mono font-bold text-white text-sm">{summary.highestExistingRL} m</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">{t.lowestExisting}</span>
            <span className="font-mono font-bold text-white text-sm">{summary.lowestExistingRL} m</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">{t.maximumCut}</span>
            <span className="font-mono font-bold text-red-400 text-sm">{summary.maximumCut} m</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">{t.maximumFill}</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{summary.maximumFill} m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
