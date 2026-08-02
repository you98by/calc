import React, { useState } from 'react';
import {
  Compass,
  Globe,
  Sun,
  Moon,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  PlusCircle,
  HelpCircle,
  Download,
  Printer,
  Home as HomeIcon,
  Calculator as CalcIcon,
  Menu,
  X,
  Share2,
} from 'lucide-react';
import { Language, ThemeMode, SurveyProject } from '../types/survey';
import { TranslationDictionary } from '../utils/translations';
import { exportToPDF, exportToExcel, exportToJSON } from '../utils/exportHelpers';

interface NavbarProps {
  currentTab: 'home' | 'calculator';
  setCurrentTab: (tab: 'home' | 'calculator') => void;
  project: SurveyProject;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  t: TranslationDictionary;
  onNewProject: () => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  project,
  language,
  setLanguage,
  theme,
  setTheme,
  t,
  onNewProject,
  onOpenHelp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand & Main Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 transition hover:opacity-90 focus:outline-none shrink-0"
            title="Go to Home"
          >
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#105b48] to-[#1BBF89] shadow-lg shadow-[#105b48]/30 ring-1 ring-emerald-400/30">
              <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-100 animate-pulse" />
            </div>
            <div className="text-left rtl:text-right">
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span className="truncate max-w-[120px] sm:max-w-none">{t.appTitle}</span>
                <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                  PRO
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden md:block">{t.subtitle}</p>
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 ring-1 ring-slate-800 text-xs shrink-0">
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 font-semibold transition ${
                currentTab === 'home'
                  ? 'bg-[#105b48] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <HomeIcon className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">{t.home}</span>
            </button>
            <button
              onClick={() => setCurrentTab('calculator')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 font-semibold transition ${
                currentTab === 'calculator'
                  ? 'bg-[#105b48] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CalcIcon className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">{t.calculator}</span>
            </button>
          </nav>
        </div>

        {/* Action Controls - Desktop & Compact Mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Icon Actions (Calculator mode) */}
          {currentTab === 'calculator' && (
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => exportToPDF(project, t)}
                className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/30 transition hover:bg-rose-500/20"
                title={t.exportPDF}
              >
                <FileText className="h-3.5 w-3.5 text-rose-400" />
                <span>PDF Report</span>
              </button>

              <button
                onClick={() => exportToExcel(project, t)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/20"
                title={t.exportExcel}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                <span>Excel</span>
              </button>

              <button
                onClick={() => exportToJSON(project)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                title={t.exportJSON}
              >
                <Download className="h-3.5 w-3.5 text-slate-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 p-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 no-print"
                title={t.printReport}
              >
                <Printer className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          )}

          {/* New Project Icon Button */}
          <button
            onClick={onNewProject}
            className="flex items-center gap-1 rounded-lg bg-[#1BBF89] px-2.5 py-1.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-emerald-400 shrink-0"
            title={t.newProject}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.newProject}</span>
          </button>

          {/* Language Selector */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-slate-800 hover:bg-slate-800">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span className="uppercase">{language}</span>
            </button>
            <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-1 hidden w-36 rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-xl group-hover:block z-50">
              <button
                onClick={() => setLanguage('en')}
                className={`w-full rounded-lg px-3 py-1.5 text-left rtl:text-right text-xs transition ${
                  language === 'en' ? 'bg-[#105b48] text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                English (EN)
              </button>
              <button
                onClick={() => setLanguage('ck')}
                className={`w-full rounded-lg px-3 py-1.5 text-left rtl:text-right text-xs transition ${
                  language === 'ck' ? 'bg-[#105b48] text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                کوردیی سۆرانی (CK)
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`w-full rounded-lg px-3 py-1.5 text-left rtl:text-right text-xs transition ${
                  language === 'ar' ? 'bg-[#105b48] text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                العربية (AR)
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden sm:flex rounded-lg bg-slate-900 p-2 text-slate-300 ring-1 ring-slate-800 hover:bg-slate-800 hover:text-white"
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
          </button>

          {/* Help Trigger */}
          <button
            onClick={onOpenHelp}
            className="hidden sm:flex rounded-lg bg-slate-900 p-2 text-slate-400 ring-1 ring-slate-800 hover:bg-slate-800 hover:text-white"
            title="Help & Manual"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden rounded-lg bg-slate-900 p-2 text-slate-300 ring-1 ring-slate-800 hover:bg-slate-800"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3 animate-fadeIn">
          {/* Export Actions (if in Calculator) */}
          {currentTab === 'calculator' && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Export Options & Reports
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    exportToPDF(project, t);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs font-semibold text-rose-300"
                >
                  <FileText className="h-4 w-4 text-rose-400" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => {
                    exportToExcel(project, t);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs font-semibold text-emerald-300"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => {
                    exportToJSON(project);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs font-semibold text-slate-300"
                >
                  <Download className="h-4 w-4 text-slate-400" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs font-semibold text-slate-300"
                >
                  <Printer className="h-4 w-4 text-slate-400" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>
          )}

          {/* Language Selector on Mobile */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Language / 🚀 Select
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLanguage('en');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 rounded-xl p-2 text-center text-xs font-semibold ${
                  language === 'en' ? 'bg-[#105b48] text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage('ck');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 rounded-xl p-2 text-center text-xs font-semibold ${
                  language === 'ck' ? 'bg-[#105b48] text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                کوردی
              </button>
              <button
                onClick={() => {
                  setLanguage('ar');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 rounded-xl p-2 text-center text-xs font-semibold ${
                  language === 'ar' ? 'bg-[#105b48] text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={() => {
                onOpenHelp();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300"
            >
              <HelpCircle className="h-4 w-4 text-emerald-400" />
              <span>Help & Manual</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

