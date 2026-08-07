import React, { useState } from 'react';
import { Project, User, CompanySettings, ProjectStage, PaymentTerm, ProjectStatus } from '../types';
import { formatIDR } from '../utils/formatters';
import {
  Settings,
  FolderKanban,
  Users,
  Building2,
  Database,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Search,
  DollarSign,
  Calendar,
  Layers,
  MapPin,
  Megaphone
} from 'lucide-react';

interface AdminCMSProps {
  projects: Project[];
  users: User[];
  companySettings: CompanySettings;
  onUpdateProjects: (updatedProjects: Project[]) => void;
  onUpdateUsers: (updatedUsers: User[]) => void;
  onUpdateCompanySettings: (updatedSettings: CompanySettings) => void;
  onResetData: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  projects,
  users,
  companySettings,
  onUpdateProjects,
  onUpdateUsers,
  onUpdateCompanySettings,
  onResetData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'users' | 'company' | 'database'>('projects');
  
  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // -------------------------------------------------------------
  // TAB 1: PROJECTS & CONTENT MANAGEMENT STATE
  // -------------------------------------------------------------
  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Filter projects by search
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchProjectQuery.toLowerCase())
  );

  // Start Editing or Creating Project
  const handleStartEditProject = (proj: Project) => {
    setEditingProject(JSON.parse(JSON.stringify(proj)));
    setIsCreatingProject(false);
  };

  const handleStartNewProject = () => {
    const newProj: Project = {
      id: Date.now(),
      name: 'Proyek Baru PT 3Plus',
      clientName: 'PT Nama Klien',
      clientContact: 'Kontak Klien (+62...)',
      location: 'Lokasi Proyek',
      province: 'DKI Jakarta',
      region: 'Jawa',
      latitude: -6.2,
      longitude: 106.81,
      status: 'prospek',
      contractValue: 1000000000,
      startDate: new Date().toISOString().split('T')[0],
      targetEndDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      picId: users[0]?.id || 1,
      picName: users[0]?.name || 'Admin',
      picEmail: users[0]?.email || 'admin@3plus.co.id',
      picPhone: users[0]?.phone || '+62 811-0000-1111',
      progressPercent: 0,
      description: 'Deskripsi proyek baru...',
      stages: [
        {
          id: Date.now() + 1,
          projectId: Date.now(),
          stageName: 'desain',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          status: 'in_progress'
        }
      ],
      payments: [
        {
          id: Date.now() + 2,
          projectId: Date.now(),
          stage: 'Termin 1 - DP Uang Muka',
          amount: 300000000,
          dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          status: 'belum_lunas'
        }
      ]
    };
    setEditingProject(newProj);
    setIsCreatingProject(true);
  };

  const handleSaveProject = () => {
    if (!editingProject) return;

    if (isCreatingProject) {
      onUpdateProjects([editingProject, ...projects]);
      showToast('Proyek baru berhasil ditambahkan ke database!');
    } else {
      const updated = projects.map((p) => (p.id === editingProject.id ? editingProject : p));
      onUpdateProjects(updated);
      showToast(`Konten proyek "${editingProject.name}" berhasil diperbarui!`);
    }
    setEditingProject(null);
    setIsCreatingProject(false);
  };

  const handleDeleteProject = (projectId: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus proyek ini dari CMS?')) {
      const updated = projects.filter((p) => p.id !== projectId);
      onUpdateProjects(updated);
      if (editingProject?.id === projectId) {
        setEditingProject(null);
      }
      showToast('Proyek berhasil dihapus.');
    }
  };

  // Helper Stage Manager for Editing Project
  const handleAddStage = () => {
    if (!editingProject) return;
    const newStage: ProjectStage = {
      id: Date.now(),
      projectId: editingProject.id,
      stageName: 'Tahapan Tambahan',
      startDate: editingProject.startDate,
      endDate: editingProject.targetEndDate,
      status: 'pending'
    };
    setEditingProject({
      ...editingProject,
      stages: [...editingProject.stages, newStage]
    });
  };

  const handleRemoveStage = (stageId: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      stages: editingProject.stages.filter((s) => s.id !== stageId)
    });
  };

  // Helper Payment Manager for Editing Project
  const handleAddPayment = () => {
    if (!editingProject) return;
    const newPayment: PaymentTerm = {
      id: Date.now(),
      projectId: editingProject.id,
      stage: 'Termin Baru',
      amount: 100000000,
      dueDate: editingProject.targetEndDate,
      status: 'belum_lunas'
    };
    setEditingProject({
      ...editingProject,
      payments: [...editingProject.payments, newPayment]
    });
  };

  const handleRemovePayment = (payId: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      payments: editingProject.payments.filter((p) => p.id !== payId)
    });
  };

  // -------------------------------------------------------------
  // TAB 2: USER & TEAM PIC MANAGEMENT STATE
  // -------------------------------------------------------------
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleStartNewUser = () => {
    const newUser: User = {
      id: Date.now(),
      name: 'Anggota Tim Baru',
      email: 'tim@3plus.co.id',
      role: 'project_manager',
      title: 'Project Lead',
      phone: '+62 812-0000-0000',
      regionAssigned: 'Jawa'
    };
    setEditingUser(newUser);
    setIsCreatingUser(true);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    if (isCreatingUser) {
      onUpdateUsers([...users, editingUser]);
      showToast('Anggota tim baru berhasil ditambahkan!');
    } else {
      onUpdateUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      showToast(`Data pengguna "${editingUser.name}" berhasil diperbarui!`);
    }
    setEditingUser(null);
    setIsCreatingUser(false);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      onUpdateUsers(users.filter((u) => u.id !== userId));
      showToast('Pengguna berhasil dihapus.');
    }
  };

  // -------------------------------------------------------------
  // TAB 3: COMPANY & DASHBOARD SETTINGS STATE
  // -------------------------------------------------------------
  const [tempSettings, setTempSettings] = useState<CompanySettings>({ ...companySettings });

  const handleSaveCompanySettings = () => {
    onUpdateCompanySettings(tempSettings);
    showToast('Pengaturan informasi perusahaan & dashboard berhasil disimpan!');
  };

  // -------------------------------------------------------------
  // TAB 4: DATABASE EXPORT & IMPORT STATE
  // -------------------------------------------------------------
  const handleExportJSON = () => {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      projects,
      users,
      companySettings
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `3Plus_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup database JSON berhasil diunduh!');
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (parsed.projects && Array.isArray(parsed.projects)) {
            onUpdateProjects(parsed.projects);
          }
          if (parsed.users && Array.isArray(parsed.users)) {
            onUpdateUsers(parsed.users);
          }
          if (parsed.companySettings) {
            onUpdateCompanySettings(parsed.companySettings);
          }
          showToast('Database berhasil dipulihkan dari file JSON!');
        } catch (err) {
          alert('Format file JSON tidak valid!');
        }
      };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-orange-500/40 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-5 h-5 text-orange-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin CMS Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Content Management System (CMS)</h1>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-extrabold rounded border border-orange-200 uppercase">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pusat Pengelolaan Fitur, Konten Portofolio, Jadwal Termin, Akses Tim, & Metadata Perusahaan
            </p>
          </div>
        </div>

        {/* Quick Database Backup CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-orange-400" />
            Ekspor JSON Backup
          </button>
        </div>
      </div>

      {/* Main Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 mb-6 pb-2">
        <button
          onClick={() => setActiveSubTab('projects')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'projects'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          Konten Proyek ({projects.length})
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'users'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Tim & PIC ({users.length})
        </button>

        <button
          onClick={() => setActiveSubTab('company')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'company'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Pengaturan Perusahaan & Dashboard
        </button>

        <button
          onClick={() => setActiveSubTab('database')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'database'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          Database & Riset Reset
        </button>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: PROJECT CONTENT MANAGEMENT */}
      {/* ==================================================================== */}
      {activeSubTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Project Selector List */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Daftar Proyek Portofolio</h3>
              <button
                onClick={handleStartNewProject}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Baru
              </button>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchProjectQuery}
                onChange={(e) => setSearchProjectQuery(e.target.value)}
                placeholder="Cari nama proyek / klien..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* Scrollable Project Cards List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredProjects.map((p) => {
                const isSelected = editingProject?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleStartEditProject(p)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-orange-50/80 border-orange-500 ring-1 ring-orange-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          p.status === 'on_going'
                            ? 'bg-orange-100 text-orange-800'
                            : p.status === 'prospek'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {p.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">ID: #{p.id}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{p.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{p.clientName}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-600">
                      <span>Progres: {p.progressPercent}%</span>
                      <span className="text-orange-600 font-bold">{formatIDR(p.contractValue, true)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Content Editor Form */}
          <div className="lg:col-span-8">
            {editingProject ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {isCreatingProject ? 'Form Tambah Proyek Baru' : `Edit Konten Proyek #${editingProject.id}`}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Perbarui detail spesifikasi, nilai kontrak, tahapan progres, dan jadwal termin pembayaran.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isCreatingProject && (
                      <button
                        onClick={() => handleDeleteProject(editingProject.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1 border border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    )}
                    <button
                      onClick={handleSaveProject}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-200"
                    >
                      <Save className="w-4 h-4" /> Simpan Perubahan
                    </button>
                  </div>
                </div>

                {/* Grid 1: Basic General Metadata */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FolderKanban className="w-4 h-4 text-orange-500" /> Informasi Utama Proyek
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Proyek Pekerjaan</label>
                      <input
                        type="text"
                        value={editingProject.name}
                        onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan Klien</label>
                      <input
                        type="text"
                        value={editingProject.clientName}
                        onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kontak Person Klien</label>
                      <input
                        type="text"
                        value={editingProject.clientContact}
                        onChange={(e) => setEditingProject({ ...editingProject, clientContact: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Status Proyek</label>
                      <select
                        value={editingProject.status}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="prospek">PROSPEK (Pre-Deal)</option>
                        <option value="on_going">ON GOING (Konstruksi Aktif)</option>
                        <option value="bast">BAST (Selesai Diserahterimakan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nilai Kontrak Pekerjaan (IDR)</label>
                      <input
                        type="number"
                        value={editingProject.contractValue}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, contractValue: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-orange-600 focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Persentase Progres (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={editingProject.progressPercent}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, progressPercent: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">PIC Project Manager</label>
                      <select
                        value={editingProject.picId}
                        onChange={(e) => {
                          const selectedPic = users.find((u) => u.id === Number(e.target.value));
                          if (selectedPic) {
                            setEditingProject({
                              ...editingProject,
                              picId: selectedPic.id,
                              picName: selectedPic.name,
                              picEmail: selectedPic.email,
                              picPhone: selectedPic.phone
                            });
                          }
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                      >
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.title})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Grid 2: Location & Coordinates for Map */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-500" /> Lokasi Geografis & Peta
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lokasi Proyek</label>
                      <input
                        type="text"
                        value={editingProject.location}
                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah Regional</label>
                      <select
                        value={editingProject.region}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            region: e.target.value as Project['region']
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-orange-500"
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Provinsi</label>
                      <input
                        type="text"
                        value={editingProject.province}
                        onChange={(e) => setEditingProject({ ...editingProject, province: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Latitude Coordinate</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={editingProject.latitude}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, latitude: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Longitude Coordinate</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={editingProject.longitude}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, longitude: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Grid 3: Project Stages Manager */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-orange-500" /> Tahapan Progress Proyek (Timeline Stages)
                    </h4>
                    <button
                      onClick={handleAddStage}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Tahapan
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingProject.stages.map((stg, idx) => (
                      <div key={stg.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center text-xs">
                        <div className="md:col-span-3">
                          <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Nama Tahapan</label>
                          <input
                            type="text"
                            value={stg.stageName}
                            onChange={(e) => {
                              const updated = [...editingProject.stages];
                              updated[idx].stageName = e.target.value;
                              setEditingProject({ ...editingProject, stages: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-bold"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Tanggal Mulai</label>
                          <input
                            type="date"
                            value={stg.startDate}
                            onChange={(e) => {
                              const updated = [...editingProject.stages];
                              updated[idx].startDate = e.target.value;
                              setEditingProject({ ...editingProject, stages: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Tanggal Selesai</label>
                          <input
                            type="date"
                            value={stg.endDate}
                            onChange={(e) => {
                              const updated = [...editingProject.stages];
                              updated[idx].endDate = e.target.value;
                              setEditingProject({ ...editingProject, stages: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Status</label>
                          <select
                            value={stg.status}
                            onChange={(e) => {
                              const updated = [...editingProject.stages];
                              updated[idx].status = e.target.value as any;
                              setEditingProject({ ...editingProject, stages: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-bold"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <div className="md:col-span-1 text-center pt-3 md:pt-0">
                          <button
                            onClick={() => handleRemoveStage(stg.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded"
                            title="Hapus Tahapan"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid 4: Payment Terms Manager */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-orange-500" /> Termin Pembayaran (Payment Schedule)
                    </h4>
                    <button
                      onClick={handleAddPayment}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Termin
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingProject.payments.map((pay, idx) => (
                      <div key={pay.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center text-xs">
                        <div className="md:col-span-3">
                          <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Deskripsi Termin</label>
                          <input
                            type="text"
                            value={pay.stage}
                            onChange={(e) => {
                              const updated = [...editingProject.payments];
                              updated[idx].stage = e.target.value;
                              setEditingProject({ ...editingProject, payments: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-bold"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Jumlah Nominal (IDR)</label>
                          <input
                            type="number"
                            value={pay.amount}
                            onChange={(e) => {
                              const updated = [...editingProject.payments];
                              updated[idx].amount = Number(e.target.value);
                              setEditingProject({ ...editingProject, payments: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-bold text-orange-600"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Jatuh Tempo</label>
                          <input
                            type="date"
                            value={pay.dueDate}
                            onChange={(e) => {
                              const updated = [...editingProject.payments];
                              updated[idx].dueDate = e.target.value;
                              setEditingProject({ ...editingProject, payments: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Status Pembayaran</label>
                          <select
                            value={pay.status}
                            onChange={(e) => {
                              const updated = [...editingProject.payments];
                              updated[idx].status = e.target.value as any;
                              setEditingProject({ ...editingProject, payments: updated });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-bold"
                          >
                            <option value="lunas">Lunas</option>
                            <option value="belum_lunas">Belum Lunas</option>
                            <option value="terlambat">Terlambat</option>
                          </select>
                        </div>

                        <div className="md:col-span-1 text-center pt-3 md:pt-0">
                          <button
                            onClick={() => handleRemovePayment(pay.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded"
                            title="Hapus Termin"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Lingkup Pekerjaan</label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Pilih Proyek dari Daftar di Sebelah Kiri</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Klik pada salah satu proyek untuk mengedit spesifikasi, lokasi, tahapan, dan termin pembayaran, atau klik "Tambah Baru" untuk membuat item baru.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: TEAM & USER MANAGEMENT */}
      {/* ==================================================================== */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Manajemen Pengguna & PIC Proyek</h3>
              <p className="text-xs text-slate-500">
                Kelola data personel, penugasan wilayah regional, dan peran otorisasi akses dashboard.
              </p>
            </div>
            <button
              onClick={handleStartNewUser}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-200"
            >
              <Plus className="w-4 h-4" /> Tambah Personel Baru
            </button>
          </div>

          {/* Form Create/Edit User if active */}
          {editingUser && (
            <div className="p-5 bg-orange-50/50 border border-orange-200 rounded-2xl space-y-4">
              <h4 className="font-bold text-xs text-orange-900 uppercase tracking-wider">
                {isCreatingUser ? 'Tambah Pengguna Baru' : `Edit User #${editingUser.id}`}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Perusahaan</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Peran Otorisasi (Role)</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="direktur">Direktur (BOD - Full Access)</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="representative_associate">Representative Associate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan Resmi (Title)</label>
                  <input
                    type="text"
                    value={editingUser.title}
                    onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp / Telepon</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tugas Wilayah Regional</label>
                  <input
                    type="text"
                    value={editingUser.regionAssigned || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, regionAssigned: e.target.value })}
                    placeholder="Contoh: Jawa & Bali"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-orange-600"
                >
                  Simpan User
                </button>
              </div>
            </div>
          )}

          {/* User Table List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="p-3">Pengguna & Jabatan</th>
                  <th className="p-3">Email & Telepon</th>
                  <th className="p-3">Peran Akses</th>
                  <th className="p-3">Wilayah Tugas</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.title}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-700">{u.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.phone}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          u.role === 'direktur'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'project_manager'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">
                      {u.regionAssigned || 'Semua Wilayah'}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setIsCreatingUser(false);
                        }}
                        className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Hapus User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: COMPANY & DASHBOARD SETTINGS */}
      {/* ==================================================================== */}
      {activeSubTab === 'company' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pengaturan Identitas Perusahaan & Portal Dashboard</h3>
              <p className="text-xs text-slate-500">
                Atur pengumuman sistem, nama perusahaan, kontak pusat, dan preferensi tampilan.
              </p>
            </div>
            <button
              onClick={handleSaveCompanySettings}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-200"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan
            </button>
          </div>

          <div className="space-y-6">
            {/* Announcement Banner Controls */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-orange-500" /> Teks Pengumuman Berjalan Dashboard
                </h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.showAnnouncement}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, showAnnouncement: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  <span className="ml-2 text-xs font-bold text-slate-700">Tampilkan Pengumuman</span>
                </label>
              </div>

              <input
                type="text"
                value={tempSettings.announcementBanner}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, announcementBanner: e.target.value })
                }
                placeholder="Pesan pengumuman internal..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* General Identity Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan / Entitas</label>
                <input
                  type="text"
                  value={tempSettings.companyName}
                  onChange={(e) => setTempSettings({ ...tempSettings, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Slogan / Tagline Resmi</label>
                <input
                  type="text"
                  value={tempSettings.tagline}
                  onChange={(e) => setTempSettings({ ...tempSettings, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Kantor Pusat</label>
                <input
                  type="text"
                  value={tempSettings.headOffice}
                  onChange={(e) => setTempSettings({ ...tempSettings, headOffice: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi Kontak Utama</label>
                <input
                  type="email"
                  value={tempSettings.contactEmail}
                  onChange={(e) => setTempSettings({ ...tempSettings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telepon Kantor Pusat</label>
                <input
                  type="text"
                  value={tempSettings.contactPhone}
                  onChange={(e) => setTempSettings({ ...tempSettings, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: DATABASE BACKUP & RESTORE */}
      {/* ==================================================================== */}
      {activeSubTab === 'database' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Export Backup JSON */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Cadangan Database JSON (Export)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Unduh seluruh rekaman data proyek, tahapan progres, termin pembayaran, dan data pengguna dalam format file JSON standar untuk pengarsipan aman.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-orange-400" /> Unduh File Database Backup
            </button>
          </div>

          {/* Box 2: Import Backup JSON */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-3">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Pemulihan Data Dari JSON (Import)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Unggah file cadangan JSON yang sebelumnya diunduh untuk memperbarui atau memulihkan data sistem ke kondisi tersebut.
              </p>
            </div>
            <label className="mt-6 w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-orange-600" />
              <span>Unggah File JSON Backup</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>

          {/* Box 3: Reset Factory Data */}
          <div className="md:col-span-2 bg-red-50/40 border border-red-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-red-900 text-sm">Reset ke Data Bawaan Pabrik (Factory Reset)</h4>
                <p className="text-xs text-red-700/80 mt-0.5">
                  Kembalikan seluruh daftar proyek dan akun pengguna ke data sampel awal PT 3Plus Indonesia.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm('Apakah Anda benar-benar yakin ingin mengembalikan data ke sampel bawaan awal?')) {
                  onResetData();
                  showToast('Database berhasil dikembalikan ke data awal!');
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs"
            >
              Reset Database Ke Awal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
