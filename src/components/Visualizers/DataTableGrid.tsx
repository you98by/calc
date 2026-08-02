import React, { useState, useMemo } from 'react';
import { GridPoint } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import { Search, Filter, Edit2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableGridProps {
  points: GridPoint[];
  t: TranslationDictionary;
  onSelectPoint: (point: GridPoint) => void;
}

type SortField = 'station' | 'x' | 'y' | 'existingRL' | 'designRL' | 'difference' | 'cut' | 'fill' | 'staffReading';
type FilterMode = 'all' | 'cut' | 'fill' | 'balanced';

export const DataTableGrid: React.FC<DataTableGridProps> = ({ points, t, onSelectPoint }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [sortField, setSortField] = useState<SortField>('station');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Search & Filter
  const filteredPoints = useMemo(() => {
    return points.filter((p) => {
      // Search station name or coordinates
      const matchesSearch =
        p.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.x.toString().includes(searchTerm) ||
        p.y.toString().includes(searchTerm);

      if (!matchesSearch) return false;

      if (filterMode === 'cut') return p.cut > 0;
      if (filterMode === 'fill') return p.fill > 0;
      if (filterMode === 'balanced') return p.difference === 0;

      return true;
    });
  }, [points, searchTerm, filterMode]);

  // Sort
  const sortedPoints = useMemo(() => {
    return [...filteredPoints].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredPoints, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedPoints.length / pageSize) || 1;
  const paginatedPoints = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPoints.slice(start, start + pageSize);
  }, [sortedPoints, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="flex flex-col h-full w-full rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl">
      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 gap-3">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t.searchStation}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 flex-wrap text-xs">
          <button
            onClick={() => {
              setFilterMode('all');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-2.5 py-1 transition ${
              filterMode === 'all' ? 'bg-[#105b48] text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.filterAll} ({points.length})
          </button>
          <button
            onClick={() => {
              setFilterMode('cut');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-2.5 py-1 transition ${
              filterMode === 'cut' ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/30 font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.filterCutOnly}
          </button>
          <button
            onClick={() => {
              setFilterMode('fill');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-2.5 py-1 transition ${
              filterMode === 'fill' ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30 font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.filterFillOnly}
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left rtl:text-right border-collapse text-xs">
          <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-300 font-semibold z-10">
            <tr>
              <th onClick={() => handleSort('station')} className="px-4 py-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">
                  <span>{t.station}</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('x')} className="px-3 py-2.5 cursor-pointer hover:text-white font-mono">
                X (m)
              </th>
              <th onClick={() => handleSort('y')} className="px-3 py-2.5 cursor-pointer hover:text-white font-mono">
                Y (m)
              </th>
              <th onClick={() => handleSort('existingRL')} className="px-3 py-2.5 cursor-pointer hover:text-white">
                {t.existingElevation}
              </th>
              <th onClick={() => handleSort('designRL')} className="px-3 py-2.5 cursor-pointer hover:text-white">
                {t.designElevation}
              </th>
              <th onClick={() => handleSort('difference')} className="px-3 py-2.5 cursor-pointer hover:text-white">
                {t.difference}
              </th>
              <th onClick={() => handleSort('cut')} className="px-3 py-2.5 cursor-pointer hover:text-white text-red-400">
                {t.cut}
              </th>
              <th onClick={() => handleSort('fill')} className="px-3 py-2.5 cursor-pointer hover:text-white text-emerald-400">
                {t.fill}
              </th>
              <th onClick={() => handleSort('staffReading')} className="px-3 py-2.5 cursor-pointer hover:text-white text-amber-300">
                {t.staffReading}
              </th>
              <th className="px-3 py-2.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
            {paginatedPoints.map((p) => (
              <tr key={p.id} className="hover:bg-slate-900/80 transition">
                <td className="px-4 py-2 font-bold text-white flex items-center gap-1.5">
                  <span>{p.station}</span>
                  {p.isCustomOverride && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Custom Elevation Override" />
                  )}
                </td>
                <td className="px-3 py-2 text-slate-400">{p.x.toFixed(1)}</td>
                <td className="px-3 py-2 text-slate-400">{p.y.toFixed(1)}</td>
                <td className="px-3 py-2 text-slate-100 font-semibold">{p.existingRL.toFixed(3)}</td>
                <td className="px-3 py-2 text-slate-100 font-semibold">{p.designRL.toFixed(3)}</td>
                <td className="px-3 py-2">
                  <span
                    className={`font-bold ${
                      p.difference > 0 ? 'text-red-400' : p.difference < 0 ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {p.difference > 0 ? `+${p.difference.toFixed(3)}` : p.difference.toFixed(3)}
                  </span>
                </td>
                <td className="px-3 py-2 font-bold text-red-400">{p.cut > 0 ? p.cut.toFixed(3) : '-'}</td>
                <td className="px-3 py-2 font-bold text-emerald-400">{p.fill > 0 ? p.fill.toFixed(3) : '-'}</td>
                <td className="px-3 py-2 font-bold text-amber-300">{p.staffReading.toFixed(3)}</td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => onSelectPoint(p)}
                    className="rounded-lg bg-slate-800 p-1 text-slate-300 hover:bg-emerald-500 hover:text-slate-950 transition"
                    title={t.editPoint}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to Math.min({currentPage * pageSize}, {sortedPoints.length}) of {sortedPoints.length} stations
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg bg-slate-800 p-1 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg bg-slate-800 p-1 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
