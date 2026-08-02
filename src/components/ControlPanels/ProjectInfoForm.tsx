import React from 'react';
import { ProjectInfo } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import { FileText, User, Calendar, StickyNote, Building } from 'lucide-react';

interface ProjectInfoFormProps {
  info: ProjectInfo;
  onChange: (info: ProjectInfo) => void;
  t: TranslationDictionary;
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({ info, onChange, t }) => {
  const handleChange = (field: keyof ProjectInfo, value: string) => {
    onChange({
      ...info,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <FileText className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.projectInfo}</h3>
      </div>
      <p className="text-xs text-slate-400">{t.projectInfoDesc}</p>

      <div className="space-y-3">
        {/* Project Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-slate-400" />
            {t.projectName}
          </label>
          <input
            type="text"
            value={info.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            placeholder="e.g. Commercial Plaza Leveling Grid"
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Client */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" />
            {t.client}
          </label>
          <input
            type="text"
            value={info.client}
            onChange={(e) => handleChange('client', e.target.value)}
            placeholder="e.g. Kamyar Development Corp."
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Surveyor / Engineer */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-emerald-400" />
            {t.surveyor}
          </label>
          <input
            type="text"
            value={info.surveyor}
            onChange={(e) => handleChange('surveyor', e.target.value)}
            placeholder="e.g. Eng. Kamyar Surveying"
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {t.date}
          </label>
          <input
            type="date"
            value={info.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <StickyNote className="h-3.5 w-3.5 text-slate-400" />
            {t.notes}
          </label>
          <textarea
            rows={2}
            value={info.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add survey field notes or site conditions..."
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
