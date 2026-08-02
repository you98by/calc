import React from 'react';
import { DesignSurfaceConfig, DesignSurfaceType, SlopeDirection, SiteDimensions } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import { Layers, ArrowUpRight, Compass, TrendingUp, SlidersHorizontal } from 'lucide-react';

interface DesignSurfaceFormProps {
  config: DesignSurfaceConfig;
  site?: SiteDimensions;
  onChange: (config: DesignSurfaceConfig) => void;
  t: TranslationDictionary;
}

const DIRECTIONS: SlopeDirection[] = [
  'North',
  'South',
  'East',
  'West',
  'North East',
  'North West',
  'South East',
  'South West',
];

export const DesignSurfaceForm: React.FC<DesignSurfaceFormProps> = ({ config, site, onChange, t }) => {
  const siteLength = site?.length || 40;
  const siteWidth = site?.width || 30;

  const getMaxDistance = (direction: SlopeDirection) => {
    if (direction === 'North' || direction === 'South') return siteWidth;
    if (direction === 'East' || direction === 'West') return siteLength;
    return (siteLength + siteWidth) / Math.SQRT2;
  };

  const currentMode = config.oneWaySlope.mode || 'startEnd';
  const currentMaxDist = getMaxDistance(config.oneWaySlope.direction);

  const calculatedEndRL = Number(
    (
      config.oneWaySlope.startElevation +
      ((config.oneWaySlope.slopePercent || 0) / 100) * currentMaxDist
    ).toFixed(3)
  );

  const calculatedSlopePct = Number(
    (
      ((config.oneWaySlope.endElevation - config.oneWaySlope.startElevation) / (currentMaxDist || 1)) *
      100
    ).toFixed(2)
  );

  const handleTypeChange = (type: DesignSurfaceType) => {
    onChange({
      ...config,
      type,
    });
  };

  const handleFlatElevationChange = (val: number) => {
    onChange({
      ...config,
      flatElevation: isNaN(val) ? 0 : val,
    });
  };

  const handleOneWayChange = (field: keyof DesignSurfaceConfig['oneWaySlope'], val: any) => {
    onChange({
      ...config,
      oneWaySlope: {
        ...config.oneWaySlope,
        [field]: val,
      },
    });
  };

  const handleSwitchOneWayMode = (newMode: 'startEnd' | 'startSlope') => {
    if (newMode === 'startSlope') {
      // Sync slopePercent from current startEnd
      const syncSlope = calculatedSlopePct;
      onChange({
        ...config,
        oneWaySlope: {
          ...config.oneWaySlope,
          mode: newMode,
          slopePercent: syncSlope,
        },
      });
    } else {
      // Sync endElevation from current startSlope
      const syncEnd = calculatedEndRL;
      onChange({
        ...config,
        oneWaySlope: {
          ...config.oneWaySlope,
          mode: newMode,
          endElevation: syncEnd,
        },
      });
    }
  };

  const handleTwoWayChange = (field: keyof DesignSurfaceConfig['twoWaySlope'], val: number) => {
    onChange({
      ...config,
      twoWaySlope: {
        ...config.twoWaySlope,
        [field]: isNaN(val) ? 0 : val,
      },
    });
  };

  const handleFourWayChange = (field: keyof DesignSurfaceConfig['fourWaySlope'], val: number) => {
    onChange({
      ...config,
      fourWaySlope: {
        ...config.fourWaySlope,
        [field]: isNaN(val) ? 0 : val,
      },
    });
  };

  const getDirectionLabel = (dir: SlopeDirection): string => {
    switch (dir) {
      case 'North': return t.north;
      case 'South': return t.south;
      case 'East': return t.east;
      case 'West': return t.west;
      case 'North East': return t.northEast;
      case 'North West': return t.northWest;
      case 'South East': return t.southEast;
      case 'South West': return t.southWest;
      default: return dir;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Layers className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.designSurface}</h3>
      </div>

      {/* Surface Type Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {(['Flat', 'One-way Slope', 'Two-way Slope', 'Four-way Slope'] as DesignSurfaceType[]).map((st) => {
          const isActive = config.type === st;
          let label = t.flatSurface;
          if (st === 'One-way Slope') label = t.oneWaySlope;
          if (st === 'Two-way Slope') label = t.twoWaySlope;
          if (st === 'Four-way Slope') label = t.fourWaySlope;

          return (
            <button
              key={st}
              type="button"
              onClick={() => handleTypeChange(st)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#105b48] text-white ring-1 ring-emerald-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 1. Flat Surface Inputs */}
      {config.type === 'Flat' && (
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Target Design Elevation RL (m)
          </label>
          <input
            type="number"
            step="0.001"
            value={config.flatElevation}
            onChange={(e) => handleFlatElevationChange(parseFloat(e.target.value))}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )}

      {/* 2. One-Way Slope Inputs */}
      {config.type === 'One-way Slope' && (
        <div className="space-y-3">
          {/* Sub-mode selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3 text-emerald-400" />
              {t.oneWayMode}
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleSwitchOneWayMode('startEnd')}
                className={`rounded-lg px-2 py-1.5 text-[11px] font-bold transition ${
                  currentMode === 'startEnd'
                    ? 'bg-[#105b48] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.startEndElevations}
              </button>
              <button
                type="button"
                onClick={() => handleSwitchOneWayMode('startSlope')}
                className={`rounded-lg px-2 py-1.5 text-[11px] font-bold transition ${
                  currentMode === 'startSlope'
                    ? 'bg-[#105b48] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.startElevationWithSlope}
              </button>
            </div>
          </div>

          {/* Mode 1: Start & End Elevation */}
          {currentMode === 'startEnd' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.startElevation}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.oneWaySlope.startElevation}
                    onChange={(e) => handleOneWayChange('startElevation', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.endElevation}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.oneWaySlope.endElevation}
                    onChange={(e) => handleOneWayChange('endElevation', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Computed Slope Percentage Info Badge */}
              <div className="flex items-center justify-between rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800/80 text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  Calculated Grade:
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {calculatedSlopePct > 0 ? `+${calculatedSlopePct}%` : `${calculatedSlopePct}%`}
                </span>
              </div>
            </div>
          )}

          {/* Mode 2: Start Elevation + Slope % */}
          {currentMode === 'startSlope' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.startElevation}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.oneWaySlope.startElevation}
                    onChange={(e) => handleOneWayChange('startElevation', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.slopePercent}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.oneWaySlope.slopePercent ?? 0}
                    onChange={(e) => handleOneWayChange('slopePercent', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. 10 or -5"
                  />
                </div>
              </div>

              {/* Computed End RL Info Badge */}
              <div className="flex items-center justify-between rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800/80 text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-amber-400" />
                  {t.calculatedEndElevation}:
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {calculatedEndRL.toFixed(3)} m
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-slate-400" />
              {t.slopeDirection}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {DIRECTIONS.map((dir) => {
                const isActive = config.oneWaySlope.direction === dir;
                return (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => handleOneWayChange('direction', dir)}
                    className={`rounded-lg px-2 py-1.5 text-[11px] font-medium text-left rtl:text-right border transition ${
                      isActive
                        ? 'bg-[#105b48]/40 border-emerald-500 text-emerald-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {getDirectionLabel(dir)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Two-Way Cross Slope Inputs */}
      {config.type === 'Two-way Slope' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Base Reference Elevation (m)
            </label>
            <input
              type="number"
              step="0.01"
              value={config.twoWaySlope.baseElevation}
              onChange={(e) => handleTwoWayChange('baseElevation', parseFloat(e.target.value))}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.slopeX}
              </label>
              <input
                type="number"
                step="0.1"
                value={config.twoWaySlope.slopeXPercent}
                onChange={(e) => handleTwoWayChange('slopeXPercent', parseFloat(e.target.value))}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.slopeY}
              </label>
              <input
                type="number"
                step="0.1"
                value={config.twoWaySlope.slopeYPercent}
                onChange={(e) => handleTwoWayChange('slopeYPercent', parseFloat(e.target.value))}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Four-Way Crown Slope Inputs */}
      {config.type === 'Four-way Slope' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t.centerElevation}
            </label>
            <input
              type="number"
              step="0.01"
              value={config.fourWaySlope.centerElevation}
              onChange={(e) => handleFourWayChange('centerElevation', parseFloat(e.target.value))}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-300 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t.perimeterElevation}
            </label>
            <input
              type="number"
              step="0.01"
              value={config.fourWaySlope.perimeterElevation}
              onChange={(e) => handleFourWayChange('perimeterElevation', parseFloat(e.target.value))}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-300 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
