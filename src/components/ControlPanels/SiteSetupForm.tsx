import React from 'react';
import { SiteDimensions } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import { Grid, Maximize2, Layers } from 'lucide-react';

interface SiteSetupFormProps {
  site: SiteDimensions;
  onChange: (site: SiteDimensions) => void;
  t: TranslationDictionary;
}

const PRESET_SPACINGS = [1, 2, 5, 10, 20, 25, 50];

export const SiteSetupForm: React.FC<SiteSetupFormProps> = ({ site, onChange, t }) => {
  const handleDimensionChange = (field: 'length' | 'width', value: number) => {
    const val = Math.max(1, isNaN(value) ? 10 : value);
    onChange({
      ...site,
      [field]: val,
    });
  };

  const handlePresetSelect = (spacing: number) => {
    onChange({
      ...site,
      gridSpacingX: spacing,
      gridSpacingY: spacing,
    });
  };

  const totalArea = site.length * site.width;
  const cols = Math.floor(site.length / (site.gridSpacingX || 5)) + 1;
  const rows = Math.floor(site.width / (site.gridSpacingY || 5)) + 1;
  const totalPoints = cols * rows;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Grid className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.siteDimensions}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Length (X) */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            {t.length}
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            step="1"
            value={site.length}
            onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value))}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Width (Y) */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            {t.width}
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            step="1"
            value={site.width}
            onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value))}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Grid Spacing Presets */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          {t.gridSpacing}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_SPACINGS.map((spacing) => {
            const isActive = site.gridSpacingX === spacing && site.gridSpacingY === spacing;
            return (
              <button
                key={spacing}
                type="button"
                onClick={() => handlePresetSelect(spacing)}
                className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition ${
                  isActive
                    ? 'bg-[#105b48] text-white ring-1 ring-emerald-400'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {spacing}m
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Spacing X & Y */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Spacing X (m)</label>
          <input
            type="number"
            min="0.5"
            max="100"
            step="0.5"
            value={site.gridSpacingX}
            onChange={(e) =>
              onChange({
                ...site,
                gridSpacingX: Math.max(0.5, parseFloat(e.target.value) || 1),
              })
            }
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Spacing Y (m)</label>
          <input
            type="number"
            min="0.5"
            max="100"
            step="0.5"
            value={site.gridSpacingY}
            onChange={(e) =>
              onChange({
                ...site,
                gridSpacingY: Math.max(0.5, parseFloat(e.target.value) || 1),
              })
            }
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Stats Summary Pill */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900/90 p-3 border border-slate-800 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">{t.totalArea}</span>
          <span className="font-mono font-bold text-white">{totalArea.toLocaleString()} m²</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">{t.gridPointsCount}</span>
          <span className="font-mono font-bold text-emerald-400">{totalPoints} ({rows}x{cols})</span>
        </div>
      </div>
    </div>
  );
};
