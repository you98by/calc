import React, { useState, useEffect } from 'react';
import { GridPoint, InstrumentData } from '../types/survey';
import { TranslationDictionary } from '../utils/translations';
import { Edit3, X, Check, Ruler, Eye, Plus, Minus } from 'lucide-react';

interface PointEditModalProps {
  point: GridPoint;
  instrument: InstrumentData;
  t: TranslationDictionary;
  onSave: (station: string, existingRL: number, designRL?: number) => void;
  onClose: () => void;
}

export const PointEditModal: React.FC<PointEditModalProps> = ({
  point,
  instrument,
  t,
  onSave,
  onClose,
}) => {
  const [existingRL, setExistingRL] = useState(point.existingRL);
  const [designRL, setDesignRL] = useState(point.designRL);

  useEffect(() => {
    setExistingRL(point.existingRL);
    setDesignRL(point.designRL);
  }, [point]);

  const diff = Number((existingRL - designRL).toFixed(3));
  const cut = diff > 0 ? diff : 0;
  const fill = diff < 0 ? Math.abs(diff) : 0;
  const staffReading = Number((instrument.heightOfInstrument - designRL).toFixed(3));

  const handleApply = () => {
    onSave(point.station, existingRL, designRL);
    onClose();
  };

  const adjustElevation = (delta: number) => {
    setExistingRL((prev) => Number((prev + delta).toFixed(3)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 p-0 sm:p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Mobile Swipe Handle Indicator */}
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#105b48] to-[#1BBF89] text-white shadow-md">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t.pointDetails}</span>
                <span className="font-mono text-emerald-400 font-extrabold">{point.station}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Grid Coords: X={point.x}m, Y={point.y}m
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="my-4 space-y-4">
          {/* Existing Ground RL Input & Touch Adjusters */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                {t.existingElevation} (m)
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => adjustElevation(-0.1)}
                  className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
                >
                  -0.10m
                </button>
                <button
                  type="button"
                  onClick={() => adjustElevation(-0.01)}
                  className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
                >
                  -0.01m
                </button>
                <button
                  type="button"
                  onClick={() => adjustElevation(0.01)}
                  className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
                >
                  +0.01m
                </button>
                <button
                  type="button"
                  onClick={() => adjustElevation(0.1)}
                  className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
                >
                  +0.10m
                </button>
              </div>
            </div>
            <input
              type="number"
              step="0.001"
              value={existingRL}
              onChange={(e) => setExistingRL(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm font-mono font-bold text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Design Target RL Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.designElevation} (m)
            </label>
            <input
              type="number"
              step="0.001"
              value={designRL}
              onChange={(e) => setDesignRL(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Field Computations Output Grid */}
          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 font-mono space-y-2 text-xs shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{t.difference}:</span>
              <span className={`font-bold ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                {diff > 0 ? `+${diff.toFixed(3)}` : diff.toFixed(3)} m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Earthwork Action:</span>
              <span className="font-bold text-white">
                {cut > 0 ? (
                  <span className="text-red-400 font-extrabold">CUT {cut.toFixed(3)} m</span>
                ) : fill > 0 ? (
                  <span className="text-emerald-400 font-extrabold">FILL {fill.toFixed(3)} m</span>
                ) : (
                  <span className="text-slate-400">ON GRADE</span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-amber-300 font-sans font-semibold">{t.staffReading}:</span>
              <span className="font-bold text-amber-300">{staffReading.toFixed(3)} m</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 rounded-xl bg-[#1BBF89] px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md transition"
          >
            <Check className="h-4 w-4" />
            <span>{t.apply}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
