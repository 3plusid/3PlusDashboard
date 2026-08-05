import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { formatDateID, getStatusBadge, getDeadlineStatus } from '../utils/formatters';
import { Calendar, Filter, Clock, AlertTriangle, AlertCircle, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';

interface ProjectTimelineProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projects,
  onSelectProject
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ProjectStatus>('all');
  const [dateStartFilter, setDateStartFilter] = useState<string>('');
  const [dateEndFilter, setDateEndFilter] = useState<string>('');

  // Filter projects by status, year, or custom date range
  const filteredProjects = projects.filter((p) => {
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    
    let matchYear = true;
    if (selectedYear !== 'all') {
      const yearStr = selectedYear;
      matchYear = p.startDate.startsWith(yearStr) || p.targetEndDate.startsWith(yearStr);
    }

    let matchRange = true;
    if (dateStartFilter) {
      matchRange = matchRange && new Date(p.targetEndDate) >= new Date(dateStartFilter);
    }
    if (dateEndFilter) {
      matchRange = matchRange && new Date(p.startDate) <= new Date(dateEndFilter);
    }

    return matchStatus && matchYear && matchRange;
  });

  // Timeline bounds calculation
  const minDateYear = 2025;
  const maxDateYear = 2027;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  // Helper to convert date string to percentage left position (2025-01-01 to 2027-12-31 = 36 months = 100%)
  const getTimelinePos = (dateStr: string) => {
    const date = new Date(dateStr);
    const startOverall = new Date('2025-01-01').getTime();
    const endOverall = new Date('2027-12-31').getTime();
    const totalDuration = endOverall - startOverall;

    const current = date.getTime();
    const clamped = Math.max(startOverall, Math.min(endOverall, current));
    const percent = ((clamped - startOverall) / totalDuration) * 100;
    return percent;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
            <Calendar className="w-4 h-4" /> Manajemen Jadwal Terpadu
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Linimasa Proyek (Gantt Chart)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau pergerakan jadwal, tahapan pekerjaan (Desain, Konstruksi, BAST), dan penanda keterlambatan proyek.
          </p>
        </div>

        {/* Quick Year Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Periode:</span>
          {['all', '2025', '2026', '2027'].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedYear === yr
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {yr === 'all' ? 'Semua Tahun (2025-2027)' : yr}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls & Legend Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Custom Date Filter controls */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-700" /> Filter Rentang Waktu:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateStartFilter}
                onChange={(e) => setDateStartFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              />
              <span className="text-slate-400 text-xs">—</span>
              <input
                type="date"
                value={dateEndFilter}
                onChange={(e) => setDateEndFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              />
            </div>
            {(dateStartFilter || dateEndFilter) && (
              <button
                onClick={() => {
                  setDateStartFilter('');
                  setDateEndFilter('');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Tanggal
              </button>
            )}
          </div>

          {/* Status filter toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-lg ${selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              Semua Status
            </button>
            <button
              onClick={() => setSelectedStatus('prospek')}
              className={`px-3 py-1 rounded-lg ${selectedStatus === 'prospek' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-800'}`}
            >
              Prospek
            </button>
            <button
              onClick={() => setSelectedStatus('on_going')}
              className={`px-3 py-1 rounded-lg ${selectedStatus === 'on_going' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-800'}`}
            >
              On Going
            </button>
            <button
              onClick={() => setSelectedStatus('bast')}
              className={`px-3 py-1 rounded-lg ${selectedStatus === 'bast' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-800'}`}
            >
              BAST
            </button>
          </div>

        </div>

        {/* Timeline Penanda / Legenda Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-700">Legenda Status:</span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Prospek
            </span>
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> On Going
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> BAST Handover
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700">Penanda Keterlambatan:</span>
            <span className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
              <AlertCircle className="w-3.5 h-3.5" /> Terlambat (Lewat Target)
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Clock className="w-3.5 h-3.5" /> Mendekati Tenggat (&lt;30 Hari)
            </span>
          </div>
        </div>
      </div>

      {/* Main Gantt Matrix Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="min-w-[900px]">
          
          {/* Timeline Header (Months & Years Axis) */}
          <div className="flex border-b border-slate-200 bg-slate-900 text-white text-xs font-extrabold sticky top-0 z-20">
            {/* Left Title Column */}
            <div className="w-72 p-4 shrink-0 border-r border-slate-800">
              NAMA PROYEK & KLIEN
            </div>
            
            {/* Timeline Scale 2025 - 2027 */}
            <div className="flex-1 flex flex-col">
              {/* Years Row */}
              <div className="flex border-b border-slate-800 text-center font-black text-blue-400">
                <div className="w-1/3 py-2 border-r border-slate-800">2025</div>
                <div className="w-1/3 py-2 border-r border-slate-800">2026</div>
                <div className="w-1/3 py-2">2027</div>
              </div>

              {/* Months Row */}
              <div className="flex text-center text-[10px] text-slate-300">
                {[2025, 2026, 2027].map((yr) => (
                  <div key={yr} className="w-1/3 flex">
                    {months.map((m, idx) => (
                      <div
                        key={`${yr}-${idx}`}
                        className="flex-1 py-1.5 border-r border-slate-800 text-slate-400"
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Rows */}
          <div className="divide-y divide-slate-100">
            {filteredProjects.map((project) => {
              const startPos = getTimelinePos(project.startDate);
              const endPos = getTimelinePos(project.targetEndDate);
              const durationWidth = Math.max(4, endPos - startPos);
              const badge = getStatusBadge(project.status);
              const deadline = getDeadlineStatus(project.targetEndDate, project.status);

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="flex items-center hover:bg-blue-50/50 transition-colors cursor-pointer group py-3"
                >
                  {/* Left Column: Project Name & Status */}
                  <div className="w-72 p-4 shrink-0 border-r border-slate-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
                      <span className="text-[11px] font-extrabold uppercase text-slate-500">
                        {project.status} • {project.region}
                      </span>
                    </div>

                    <h4 className="font-black text-slate-900 text-xs group-hover:text-blue-700 transition-colors leading-snug line-clamp-1">
                      {project.name}
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {project.clientName}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-bold text-slate-400">
                        {formatDateID(project.startDate)} - {formatDateID(project.targetEndDate)}
                      </span>
                      {deadline.type === 'overdue' && (
                        <span className="text-[10px] font-black text-red-600 bg-red-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                      {deadline.type === 'approaching' && (
                        <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> &lt;30 Hari
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Timeline Grid Canvas */}
                  <div className="flex-1 relative h-16 flex items-center px-2">
                    {/* Background Grid Lines for Months */}
                    <div className="absolute inset-0 flex pointer-events-none opacity-25">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-slate-300 h-full" />
                      ))}
                    </div>

                    {/* Gantt Bar for Project */}
                    <div
                      className="absolute h-9 rounded-xl shadow-md border flex items-center px-3 transition-all hover:scale-[1.01] hover:shadow-lg overflow-hidden group/bar"
                      style={{
                        left: `${startPos}%`,
                        width: `${durationWidth}%`,
                        backgroundColor:
                          project.status === 'prospek'
                            ? '#FEF3C7'
                            : project.status === 'on_going'
                            ? '#DBEAFE'
                            : '#D1FAE5',
                        borderColor:
                          project.status === 'prospek'
                            ? '#F59E0B'
                            : project.status === 'on_going'
                            ? '#2563EB'
                            : '#10B981',
                      }}
                    >
                      {/* Inner Stage Segments */}
                      <div className="flex items-center justify-between w-full gap-2 text-[10px] font-extrabold text-slate-900 truncate">
                        <span className="truncate flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: badge.markerHex }}
                          />
                          {project.name} ({project.progressPercent}%)
                        </span>

                        <span className="shrink-0 text-[9px] bg-white/80 px-1.5 py-0.5 rounded shadow-xs font-bold">
                          {project.stages.filter((s) => s.status === 'completed').length}/
                          {project.stages.length} Stage Selesai
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold">Tidak ada linimasa proyek yang cocok dengan filter</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
