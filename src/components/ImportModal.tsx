import React, { useState } from 'react';
import { TranslationDictionary } from '../utils/translations';
import { parseCSVLevels } from '../utils/exportHelpers';
import { Upload, X, Check, FileText, AlertCircle } from 'lucide-react';

interface ImportModalProps {
  t: TranslationDictionary;
  onImport: (levelMap: Map<string, number>) => void;
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ t, onImport, onClose }) => {
  const [pastedText, setPastedText] = useState('');
  const [parsedCount, setParsedCount] = useState<number | null>(null);

  const handleTextChange = (text: string) => {
    setPastedText(text);
    const map = parseCSVLevels(text);
    setParsedCount(map.size);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleTextChange(content);
      }
    };
    reader.readAsText(file);
  };

  const handleApply = () => {
    const map = parseCSVLevels(pastedText);
    if (map.size > 0) {
      onImport(map);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#105b48] text-white">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t.importCSVExcel}</h3>
              <p className="text-[11px] text-slate-400">
                Format: Station, ExistingRL (e.g., A1, 100.450)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-4 space-y-4">
          {/* Dropzone File Input */}
          <div className="relative rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4 text-center hover:border-emerald-500 transition">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="mx-auto h-6 w-6 text-emerald-400 mb-1" />
            <span className="text-xs font-semibold text-slate-300 block">
              Click to choose CSV file or drag & drop here
            </span>
            <span className="text-[10px] text-slate-500">Supports comma, semicolon, or tab delimited text</span>
          </div>

          {/* Direct Text Area Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Or Paste CSV Data Directly:
            </label>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={`# Station, Elevation\nA1, 100.250\nA2, 100.310\nB1, 100.180\nB2, 100.400`}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

          {parsedCount !== null && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2.5 text-xs text-emerald-300 border border-emerald-500/20">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Successfully parsed {parsedCount} station level records.</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleApply}
            disabled={!parsedCount || parsedCount === 0}
            className="flex items-center gap-1.5 rounded-lg bg-[#1BBF89] px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-40"
          >
            <Check className="h-4 w-4" />
            <span>Apply Import</span>
          </button>
        </div>
      </div>
    </div>
  );
};
