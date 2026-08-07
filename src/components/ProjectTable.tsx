import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { formatIDR, formatDateID, getStatusBadge, getDeadlineStatus } from '../utils/formatters';
import { Search, Filter, ArrowUpDown, Download, Plus, Eye, AlertCircle, FileSpreadsheet, Building2, UserCheck, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ProjectTableProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onAddProject?: (newProject: Omit<Project, 'id'>) => void;
  userRole: string;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onSelectProject,
  onAddProject,
  userRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ProjectStatus>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'contractValue' | 'targetEndDate' | 'name'>('contractValue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.picName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesRegion = selectedRegion === 'all' || p.region === selectedRegion;

    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Sort logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comp = 0;
    if (sortBy === 'contractValue') {
      comp = a.contractValue - b.contractValue;
    } else if (sortBy === 'targetEndDate') {
      comp = new Date(a.targetEndDate).getTime() - new Date(b.targetEndDate).getTime();
    } else if (sortBy === 'name') {
      comp = a.name.localeCompare(b.name);
    }
    return sortOrder === 'desc' ? -comp : comp;
  });

  const handleSortToggle = (field: 'contractValue' | 'targetEndDate' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Export to Excel function using XLSX
  const handleExportExcel = () => {
    const exportData = sortedProjects.map((p, index) => ({
      No: index + 1,
      'Nama Proyek': p.name,
      'Klien / Owner': p.clientName,
      'Kontak Klien': p.clientContact,
      Lokasi: p.location,
      Wilayah: p.region,
      Status: p.status.toUpperCase(),
      'Nilai Pekerjaan (IDR)': p.contractValue,
      'Format Nilai': formatIDR(p.contractValue),
      'Tanggal Mulai': p.startDate,
      'Target Selesai': p.targetEndDate,
      'Tanggal BAST': p.bastDate || '-',
      'Project PIC': p.picName,
      'Progres (%)': `${p.progressPercent}%`
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Proyek 3Plus');
    
    // Save file
    XLSX.writeFile(workbook, `3Plus_Laporan_Proyek_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
            <Building2 className="w-4 h-4" /> Portofolio Pekerjaan PT 3Plus Indonesia
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Proyek Terpadu</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola, filter, dan pantau seluruh data prospek, proyek berjalan, serta hasil penyerahan BAST.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-sm flex items-center gap-2 transition-all hover:scale-105"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Ekspor Laporan (.XLSX)
          </button>

          {(userRole === 'direktur' || userRole === 'project_manager') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Tambah Proyek Baru
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama proyek, klien, lokasi, atau PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-4 flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedStatus('prospek')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedStatus === 'prospek'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-800 hover:bg-amber-100/50'
              }`}
            >
              Prospek
            </button>
            <button
              onClick={() => setSelectedStatus('on_going')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedStatus === 'on_going'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-800 hover:bg-blue-100/50'
              }`}
            >
              On Going
            </button>
            <button
              onClick={() => setSelectedStatus('bast')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedStatus === 'bast'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-800 hover:bg-emerald-100/50'
              }`}
            >
              BAST
            </button>
          </div>

          {/* Region Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="all">Semua Wilayah</option>
              <option value="Jawa">Jawa</option>
              <option value="Sumatra">Sumatra</option>
              <option value="Kalimantan">Kalimantan</option>
              <option value="Sulawesi">Sulawesi</option>
              <option value="Bali-Nusa Tenggara">Bali-Nusa Tenggara</option>
              <option value="Papua-Maluku">Papua-Maluku</option>
            </select>
          </div>
        </div>

        {/* Sorting Quick Controls */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Urutkan Berdasarkan:</span>
            <button
              onClick={() => handleSortToggle('contractValue')}
              className={`px-3 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                sortBy === 'contractValue'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Nilai Pekerjaan <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleSortToggle('targetEndDate')}
              className={`px-3 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                sortBy === 'targetEndDate'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tenggat Waktu <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleSortToggle('name')}
              className={`px-3 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                sortBy === 'name'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Nama Proyek <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>

          <div>
            Menampilkan <span className="font-bold text-slate-800">{sortedProjects.length}</span> dari{' '}
            <span className="font-bold text-slate-800">{projects.length}</span> Total Proyek
          </div>
        </div>
      </div>

      {/* Main Datatable */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-extrabold">
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4 cursor-pointer hover:text-blue-300" onClick={() => handleSortToggle('name')}>
                  Nama Proyek & Lokasi
                </th>
                <th className="p-4">Klien / Pemilik</th>
                <th className="p-4">Status</th>
                <th className="p-4 cursor-pointer hover:text-blue-300" onClick={() => handleSortToggle('contractValue')}>
                  Nilai Pekerjaan (IDR)
                </th>
                <th className="p-4 cursor-pointer hover:text-blue-300" onClick={() => handleSortToggle('targetEndDate')}>
                  Timeline & Progres
                </th>
                <th className="p-4">Project PIC</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {sortedProjects.map((project, idx) => {
                const badge = getStatusBadge(project.status);
                const deadline = getDeadlineStatus(project.targetEndDate, project.status);

                return (
                  <tr
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-bold text-slate-400 text-center">{idx + 1}</td>

                    <td className="p-4 max-w-xs">
                      <div className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                        {project.name}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        📍 {project.location} ({project.region})
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-800">{project.clientName}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{project.clientContact}</div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${badge.bgColor}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                        {badge.label}
                      </span>
                    </td>

                    <td className="p-4 font-black text-slate-900 text-sm whitespace-nowrap">
                      {formatIDR(project.contractValue)}
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-700">{formatDateID(project.startDate)} — {formatDateID(project.targetEndDate)}</span>
                        <span className="font-black text-blue-700">{project.progressPercent}%</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${deadline.badgeColor}`}>
                        {deadline.label}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        {project.picName}
                      </div>
                      <div className="text-[11px] text-slate-400">{project.picPhone}</div>
                    </td>

                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectProject(project)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 transition-all flex items-center gap-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sortedProjects.length === 0 && (
          <div className="p-12 text-center bg-slate-50/50">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada proyek ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Coba sesuaikan kata kunci pencarian atau filter status yang Anda gunakan.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedRegion('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl shadow hover:bg-blue-800 transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Add Project Modal Placeholder */}
      {isAddModalOpen && (
        <AddProjectModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(data) => {
            if (onAddProject) onAddProject(data);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

interface AddProjectModalProps {
  onClose: () => void;
  onAdd: (newProject: Omit<Project, 'id'>) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    clientContact: '',
    location: '',
    province: 'DKI Jakarta',
    region: 'Jawa' as const,
    latitude: -6.2088,
    longitude: 106.8456,
    status: 'prospek' as ProjectStatus,
    contractValue: 5000000000,
    startDate: new Date().toISOString().split('T')[0],
    targetEndDate: '2027-01-01',
    picId: 2,
    picName: 'Hendrik Wijaya, S.T., IAI',
    picEmail: 'pm@3plus.co.id',
    picPhone: '+62 812-9876-5432',
    progressPercent: 10,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      stages: [
        { id: Date.now() + 1, projectId: 0, stageName: 'desain', startDate: formData.startDate, endDate: '2026-06-01', status: 'in_progress' },
        { id: Date.now() + 2, projectId: 0, stageName: 'konstruksi', startDate: '2026-06-02', endDate: formData.targetEndDate, status: 'pending' },
        { id: Date.now() + 3, projectId: 0, stageName: 'bast', startDate: formData.targetEndDate, endDate: formData.targetEndDate, status: 'pending' }
      ],
      payments: [
        { id: Date.now() + 4, projectId: 0, stage: 'DP 20%', amount: formData.contractValue * 0.2, dueDate: formData.startDate, status: 'belum_lunas' }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 my-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900">Tambah Proyek Baru PT 3Plus</h2>
            <p className="text-xs text-slate-500">Masukkan rincian proyek prospek atau pekerjaan berjalan baru.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Proyek *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Design & Build Interior HQ Bank Mandiri"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Klien / Pemilik *</label>
              <input
                type="text"
                required
                placeholder="Nama Perusahaan / Perorangan"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kontak Klien</label>
              <input
                type="text"
                placeholder="No HP / Email Klien"
                value={formData.clientContact}
                onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah *</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Jawa">Jawa</option>
                <option value="Sumatra">Sumatra</option>
                <option value="Kalimantan">Kalimantan</option>
                <option value="Sulawesi">Sulawesi</option>
                <option value="Bali-Nusa Tenggara">Bali-Nusa Tenggara</option>
                <option value="Papua-Maluku">Papua-Maluku</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Proyek *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="prospek">Prospek</option>
                <option value="on_going">On Going</option>
                <option value="bast">BAST</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nilai Pekerjaan (IDR) *</label>
              <input
                type="number"
                required
                value={formData.contractValue}
                onChange={(e) => setFormData({ ...formData, contractValue: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Detail</label>
              <input
                type="text"
                placeholder="Alamat / Kota"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project PIC *</label>
              <input
                type="text"
                required
                value={formData.picName}
                onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Selesai</label>
              <input
                type="date"
                required
                value={formData.targetEndDate}
                onChange={(e) => setFormData({ ...formData, targetEndDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
            >
              Simpan Proyek
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
