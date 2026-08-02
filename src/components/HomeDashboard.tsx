import React from 'react';
import { SurveyProject } from '../types/survey';
import { TranslationDictionary } from '../utils/translations';
import { createDefaultProject } from '../utils/calculatorEngine';
import {
  Compass,
  PlusCircle,
  FolderOpen,
  Layers,
  Building,
  Car,
  Mountain,
  Navigation,
  Trash2,
  ArrowRight,
  HardHat,
} from 'lucide-react';

interface HomeDashboardProps {
  recentProjects: SurveyProject[];
  onSelectProject: (proj: SurveyProject) => void;
  onNewProject: (presetName?: string) => void;
  onDeleteProject: (id: string) => void;
  onImportJSON: () => void;
  t: TranslationDictionary;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  recentProjects,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onImportJSON,
  t,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-[#105b48]/30 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
            <Compass className="h-3.5 w-3.5" />
            <span>Professional Survey Engineering Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Precision Grid Leveling & Earthwork Volumetrics
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Calculate grid elevations, height of instrument (HI), staff readings, cut & fill volumes, 
            2D heatmaps, 3D surface models, and contour maps for construction sites.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNewProject()}
              className="flex items-center gap-2 rounded-xl bg-[#1BBF89] px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.newProject}</span>
            </button>

            <button
              onClick={onImportJSON}
              className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              <FolderOpen className="h-4 w-4 text-emerald-400" />
              <span>{t.openProject}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Site Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            Quick Site Presets
          </h2>
          <span className="text-xs text-slate-400">Select a pre-configured engineering site setup</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Preset 1: Building Pad */}
          <button
            onClick={() => onNewProject('Building Pad')}
            className="group text-left rtl:text-right rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-emerald-500/50 hover:bg-slate-900 shadow-xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 group-hover:scale-110 transition">
              <Building className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
              {t.presetBuildingPad}
            </h3>
            <p className="mt-1 text-xs text-slate-400">50m x 30m rectangular pad, 5m grid, flat design elevation.</p>
          </button>

          {/* Preset 2: Parking Lot */}
          <button
            onClick={() => onNewProject('Parking Lot')}
            className="group text-left rtl:text-right rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-emerald-500/50 hover:bg-slate-900 shadow-xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 group-hover:scale-110 transition">
              <Car className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
              {t.presetParkingLot}
            </h3>
            <p className="mt-1 text-xs text-slate-400">100m x 60m parking site, 10m grid, one-way drainage slope.</p>
          </button>

          {/* Preset 3: Road Section */}
          <button
            onClick={() => onNewProject('Road Section')}
            className="group text-left rtl:text-right rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-emerald-500/50 hover:bg-slate-900 shadow-xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 group-hover:scale-110 transition">
              <Navigation className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
              {t.presetRoadSection}
            </h3>
            <p className="mt-1 text-xs text-slate-400">80m x 20m subgrade corridor, 2-way cross slope.</p>
          </button>

          {/* Preset 4: Terraced Site */}
          <button
            onClick={() => onNewProject('Terraced Site')}
            className="group text-left rtl:text-right rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-emerald-500/50 hover:bg-slate-900 shadow-xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 group-hover:scale-110 transition">
              <Mountain className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
              {t.presetTerracedSite}
            </h3>
            <p className="mt-1 text-xs text-slate-400">40m x 40m terraced site, 5m grid, undulating ground profile.</p>
          </button>
        </div>
      </div>

      {/* Recent Projects List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-emerald-400" />
          {t.recentProjects}
        </h2>

        {recentProjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-500">
            No saved projects found. Create a new project or select a preset to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((proj) => (
              <div
                key={proj.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition hover:border-slate-700 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
                      {proj.info.projectName || 'Untitled Site'}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-red-400"
                      title="Delete saved project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">Client: {proj.info.client || 'N/A'}</p>
                  <p className="text-xs text-slate-400">Surveyor: {proj.info.surveyor || 'N/A'}</p>

                  <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                      {proj.site.length}m x {proj.site.width}m
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">
                      Grid {proj.site.gridSpacingX}m
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProject(proj)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-[#105b48] hover:text-white transition"
                >
                  <span>Open Calculator</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
