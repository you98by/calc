import React, { useState, useEffect, useMemo } from 'react';
import {
  SurveyProject,
  Language,
  ThemeMode,
  GridPoint,
  EarthworkMethod,
  DesignSurfaceConfig,
} from './types/survey';
import { translations } from './utils/translations';
import {
  computeGridAndVolumes,
  createDefaultProject,
  generateExistingRL,
} from './utils/calculatorEngine';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { ProjectInfoForm } from './components/ControlPanels/ProjectInfoForm';
import { InstrumentForm } from './components/ControlPanels/InstrumentForm';
import { SiteSetupForm } from './components/ControlPanels/SiteSetupForm';
import { GroundSetupForm } from './components/ControlPanels/GroundSetupForm';
import { DesignSurfaceForm } from './components/ControlPanels/DesignSurfaceForm';
import { Grid2DView } from './components/Visualizers/Grid2DView';
import { Surface3DView } from './components/Visualizers/Surface3DView';
import { ContourMapView } from './components/Visualizers/ContourMapView';
import { DataTableGrid } from './components/Visualizers/DataTableGrid';
import { EarthworkAnalytics } from './components/Visualizers/EarthworkAnalytics';
import { PointEditModal } from './components/PointEditModal';
import { ImportModal } from './components/ImportModal';
import { HelpModal } from './components/HelpModal';
import {
  Layers,
  Box,
  Sliders,
  Table,
  BarChart3,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'calculator'>('calculator');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activeVisualizer, setActiveVisualizer] = useState<'2d' | '3d' | 'contour' | 'table' | 'analytics'>('2d');

  // Custom station elevations map (Station ID -> Existing RL)
  const [customElevationsMap, setCustomElevationsMap] = useState<Map<string, number>>(new Map());

  // Current Active Project State
  const [project, setProject] = useState<SurveyProject>(() => createDefaultProject());

  // Local storage recent projects
  const [recentProjects, setRecentProjects] = useState<SurveyProject[]>(() => {
    try {
      const saved = localStorage.getItem('kamyar_grid_projects');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [createDefaultProject('Building Pad'), createDefaultProject('Parking Lot')];
  });

  // Active Modals
  const [selectedPoint, setSelectedPoint] = useState<GridPoint | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Translation Object
  const t = translations[language] || translations.en;
  const isRTL = language === 'ck' || language === 'ar';

  // Recalculate Grid Points & Volumetrics instantly on state changes
  const { points: calculatedPoints, summary: earthworkSummary } = useMemo(() => {
    return computeGridAndVolumes(
      project.site,
      project.instrument,
      project.existingGroundOption,
      project.flatGroundRL,
      project.designSurface,
      customElevationsMap
    );
  }, [
    project.site,
    project.instrument,
    project.existingGroundOption,
    project.flatGroundRL,
    project.designSurface,
    customElevationsMap,
  ]);

  // Keep project gridPoints synced
  const activeProject = useMemo(() => {
    return {
      ...project,
      gridPoints: calculatedPoints,
    };
  }, [project, calculatedPoints]);

  // Autosave to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kamyar_grid_projects', JSON.stringify(recentProjects));
    } catch (e) {
      console.error(e);
    }
  }, [recentProjects]);

  const handleSaveProject = () => {
    setRecentProjects((prev) => {
      const existingIdx = prev.findIndex((p) => p.id === activeProject.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = activeProject;
        return updated;
      }
      return [activeProject, ...prev];
    });
  };

  const handleCreateNewProject = (presetName?: string) => {
    const newProj = createDefaultProject(presetName);
    setCustomElevationsMap(new Map());
    setProject(newProj);
    setCurrentTab('calculator');
  };

  const handleDeleteProject = (id: string) => {
    setRecentProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSelectProject = (proj: SurveyProject) => {
    setProject(proj);
    setCustomElevationsMap(new Map());
    setCurrentTab('calculator');
  };

  const handleStationElevationEdit = (station: string, newExistingRL: number, newDesignRL?: number) => {
    setCustomElevationsMap((prev) => {
      const next = new Map(prev);
      next.set(station, newExistingRL);
      return next;
    });
  };

  const handleImportLevels = (levelMap: Map<string, number>) => {
    setCustomElevationsMap((prev) => {
      const next = new Map(prev);
      levelMap.forEach((val, key) => {
        next.set(key, val);
      });
      return next;
    });
    setProject((prev) => ({
      ...prev,
      existingGroundOption: 'Manual Grid Levels',
    }));
  };

  const handleRegenerateTerrain = () => {
    setCustomElevationsMap(new Map());
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-100 text-slate-900'
      } flex flex-col font-sans antialiased`}
    >
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        project={activeProject}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        t={t}
        onNewProject={() => handleCreateNewProject()}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Main View Router */}
      {currentTab === 'home' ? (
        <HomeDashboard
          recentProjects={recentProjects}
          onSelectProject={handleSelectProject}
          onNewProject={handleCreateNewProject}
          onDeleteProject={handleDeleteProject}
          onImportJSON={() => setIsImportModalOpen(true)}
          t={t}
        />
      ) : (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto p-3 sm:p-5 gap-4">
          {/* Left Control Center Panel (Inputs) */}
          <div className="w-full lg:w-[380px] shrink-0 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto pr-1">
            {/* 1. Project Info */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 sm:p-4 shadow-xl">
              <ProjectInfoForm
                info={project.info}
                onChange={(info) => setProject((p) => ({ ...p, info }))}
                t={t}
              />
            </div>

            {/* 2. Instrument Setup */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 sm:p-4 shadow-xl">
              <InstrumentForm
                instrument={project.instrument}
                onChange={(instrument) => setProject((p) => ({ ...p, instrument }))}
                t={t}
              />
            </div>

            {/* 3. Site Dimensions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 sm:p-4 shadow-xl">
              <SiteSetupForm
                site={project.site}
                onChange={(site) => setProject((p) => ({ ...p, site }))}
                t={t}
              />
            </div>

            {/* 4. Existing Ground Elevation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 sm:p-4 shadow-xl">
              <GroundSetupForm
                groundOption={project.existingGroundOption}
                flatGroundRL={project.flatGroundRL}
                onChangeOption={(existingGroundOption) => setProject((p) => ({ ...p, existingGroundOption }))}
                onChangeFlatRL={(flatGroundRL) => setProject((p) => ({ ...p, flatGroundRL }))}
                onOpenImportModal={() => setIsImportModalOpen(true)}
                onRegenerateTerrain={handleRegenerateTerrain}
                t={t}
              />
            </div>

            {/* 5. Target Design Surface */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 sm:p-4 shadow-xl">
              <DesignSurfaceForm
                config={project.designSurface}
                site={project.site}
                onChange={(designSurface) => setProject((p) => ({ ...p, designSurface }))}
                t={t}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProject}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#105b48] py-3 text-xs font-bold text-white shadow-lg transition hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.saveProject}</span>
            </button>
          </div>

          {/* Right Visualizer Center */}
          <div className="flex-1 flex flex-col h-[520px] xs:h-[600px] sm:h-[680px] lg:h-[85vh] space-y-2.5">
            {/* Visualizer Mode Tabs (Scrollable Bar for Mobile) */}
            <div className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-slate-800 p-1 shadow-md overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 text-xs shrink-0">
                <button
                  onClick={() => setActiveVisualizer('2d')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 font-semibold transition shrink-0 ${
                    activeVisualizer === '2d'
                      ? 'bg-[#105b48] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{t.view2DGrid}</span>
                </button>

                <button
                  onClick={() => setActiveVisualizer('3d')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 font-semibold transition shrink-0 ${
                    activeVisualizer === '3d'
                      ? 'bg-[#105b48] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Box className="h-3.5 w-3.5" />
                  <span>{t.view3DSurface}</span>
                </button>

                <button
                  onClick={() => setActiveVisualizer('contour')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 font-semibold transition shrink-0 ${
                    activeVisualizer === 'contour'
                      ? 'bg-[#105b48] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>{t.viewContourMap}</span>
                </button>

                <button
                  onClick={() => setActiveVisualizer('table')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 font-semibold transition shrink-0 ${
                    activeVisualizer === 'table'
                      ? 'bg-[#105b48] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Table className="h-3.5 w-3.5" />
                  <span>{t.viewDataTable}</span>
                </button>

                <button
                  onClick={() => setActiveVisualizer('analytics')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 font-semibold transition shrink-0 ${
                    activeVisualizer === 'analytics'
                      ? 'bg-[#105b48] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>{t.viewAnalytics}</span>
                </button>
              </div>

              <div className="text-[11px] font-mono font-bold text-emerald-400 px-3 hidden lg:block">
                {earthworkSummary.totalCutVolume.toLocaleString()} m³ Cut | {earthworkSummary.totalFillVolume.toLocaleString()} m³ Fill
              </div>
            </div>

            {/* Tab View Display */}
            <div className="flex-1 relative overflow-hidden rounded-2xl">
              {activeVisualizer === '2d' && (
                <Grid2DView
                  points={calculatedPoints}
                  site={project.site}
                  t={t}
                  onSelectPoint={setSelectedPoint}
                />
              )}

              {activeVisualizer === '3d' && (
                <Surface3DView
                  points={calculatedPoints}
                  site={project.site}
                  t={t}
                />
              )}

              {activeVisualizer === 'contour' && (
                <ContourMapView
                  points={calculatedPoints}
                  site={project.site}
                  interval={project.contourInterval || 0.5}
                  onChangeInterval={(contourInterval) =>
                    setProject((p) => ({ ...p, contourInterval }))
                  }
                  t={t}
                />
              )}

              {activeVisualizer === 'table' && (
                <DataTableGrid
                  points={calculatedPoints}
                  t={t}
                  onSelectPoint={setSelectedPoint}
                />
              )}

              {activeVisualizer === 'analytics' && (
                <EarthworkAnalytics
                  summary={earthworkSummary}
                  earthworkMethod={project.earthworkMethod}
                  onChangeMethod={(earthworkMethod) =>
                    setProject((p) => ({ ...p, earthworkMethod }))
                  }
                  t={t}
                />
              )}
            </div>
          </div>
        </main>
      )}

      {/* Point Details & Edit Modal */}
      {selectedPoint && (
        <PointEditModal
          point={selectedPoint}
          instrument={project.instrument}
          t={t}
          onSave={handleStationElevationEdit}
          onClose={() => setSelectedPoint(null)}
        />
      )}

      {/* CSV / Excel Import Modal */}
      {isImportModalOpen && (
        <ImportModal
          t={t}
          onImport={handleImportLevels}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}

      {/* Surveying Manual & Help Modal */}
      {isHelpModalOpen && (
        <HelpModal
          t={t}
          onClose={() => setIsHelpModalOpen(false)}
        />
      )}
    </div>
  );
}

