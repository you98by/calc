import React from 'react';
import { ExistingGroundOption } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import { Mountain, Upload, Sliders, RefreshCw } from 'lucide-react';

interface GroundSetupFormProps {
  groundOption: ExistingGroundOption;
  flatGroundRL: number;
  onChangeOption: (opt: ExistingGroundOption) => void;
  onChangeFlatRL: (rl: number) => void;
  onOpenImportModal: () => void;
  onRegenerateTerrain: () => void;
  t: TranslationDictionary;
}

export const GroundSetupForm: React.FC<GroundSetupFormProps> = ({
  groundOption,
  flatGroundRL,
  onChangeOption,
  onChangeFlatRL,
  onOpenImportModal,
  onRegenerateTerrain,
  t,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Mountain className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.existingGround}</h3>
      </div>

      {/* Selector Options */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChangeOption('Flat Ground')}
          className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-semibold text-left rtl:text-right border transition ${
            groundOption === 'Flat Ground'
              ? 'bg-[#105b48]/30 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sliders className="h-4 w-4 shrink-0" />
          <span>{t.flatGround}</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeOption('Sloped Ground')}
          className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-semibold text-left rtl:text-right border transition ${
            groundOption === 'Sloped Ground'
              ? 'bg-[#105b48]/30 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Mountain className="h-4 w-4 shrink-0" />
          <span>{t.slopedGround}</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeOption('Manual Grid Levels')}
          className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-semibold text-left rtl:text-right border transition ${
            groundOption === 'Manual Grid Levels'
              ? 'bg-[#105b48]/30 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sliders className="h-4 w-4 shrink-0" />
          <span>{t.manualGridLevels}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onChangeOption('Import File');
            onOpenImportModal();
          }}
          className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-semibold text-left rtl:text-right border transition ${
            groundOption === 'Import File'
              ? 'bg-[#105b48]/30 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Upload className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{t.importFile}</span>
        </button>
      </div>

      {/* Flat Ground RL Input */}
      {groundOption === 'Flat Ground' && (
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            {t.flatGroundRL}
          </label>
          <input
            type="number"
            step="0.001"
            value={flatGroundRL}
            onChange={(e) => onChangeFlatRL(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )}

      {/* Sloped Ground Terrain Controller */}
      {groundOption === 'Sloped Ground' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Base Reference Elevation (m)
            </label>
            <input
              type="number"
              step="0.1"
              value={flatGroundRL}
              onChange={(e) => onChangeFlatRL(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onRegenerateTerrain}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            <span>{t.generateTerrain}</span>
          </button>
        </div>
      )}

      {/* Import File Banner */}
      {groundOption === 'Import File' && (
        <button
          type="button"
          onClick={onOpenImportModal}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
        >
          <Upload className="h-5 w-5 text-emerald-400" />
          <span>{t.importCSVExcel}</span>
        </button>
      )}
    </div>
  );
};
