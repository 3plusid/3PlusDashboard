import React, { useState, useEffect } from 'react';
import { Project, User, UserRole, ProjectStatus, CompanySettings } from './types';
import { MOCK_PROJECTS, MOCK_USERS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { ProjectTable } from './components/ProjectTable';
import { ProjectTimeline } from './components/ProjectTimeline';
import { AdminCMS } from './components/AdminCMS';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { LoginScreen } from './components/LoginScreen';
import { formatIDR } from './utils/formatters';
import { Building2, TrendingUp, CheckCircle, Clock, ShieldCheck, Megaphone, Cloud, CloudCheck } from 'lucide-react';
import { firestoreSync, seedInitialDataIfEmpty } from './lib/firebase';

const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'PT 3Plus Indonesia',
  tagline: 'Architecture • Interior • Construction Management',
  headOffice: 'Sudirman Central Business District (SCBD) Lot 28, Jakarta Selatan',
  contactEmail: 'info@3plus.co.id',
  contactPhone: '+62 21-555-3300',
  announcementBanner: 'Sistem Pengawasan Portofolio Q3 2026 — Terhubung langsung dengan Firebase Cloud Database.',
  showAnnouncement: true,
  currencySymbol: 'Rp',
  defaultRegionFocus: 'Semua Wilayah'
};

export default function App() {
  // Cloud Connection Indicator
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Show login screen at initial launch
    return null;
  });

  // Users state
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('3plus_users');
    if (savedUsers) {
      try { return JSON.parse(savedUsers); } catch { return MOCK_USERS; }
    }
    return MOCK_USERS;
  });

  // Company Settings state
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const savedSettings = localStorage.getItem('3plus_settings');
    if (savedSettings) {
      try { return JSON.parse(savedSettings); } catch { return DEFAULT_COMPANY_SETTINGS; }
    }
    return DEFAULT_COMPANY_SETTINGS;
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('3plus_projects');
    if (savedProjects) {
      try { return JSON.parse(savedProjects); } catch { return MOCK_PROJECTS; }
    }
    return MOCK_PROJECTS;
  });

  // Active view tab & modals
  const [activeTab, setActiveTab] = useState<'map' | 'table' | 'timeline' | 'admin'>('map');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mapStatusFilter, setMapStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [mapRegionFilter, setMapRegionFilter] = useState<string>('Semua Wilayah');

  // Firebase Firestore Real-time Subscriptions
  useEffect(() => {
    let isMounted = true;
    
    // Seed initial database if Firestore is fresh/empty
    seedInitialDataIfEmpty(DEFAULT_COMPANY_SETTINGS).then(() => {
      if (isMounted) setIsCloudConnected(true);
    });

    const unsubProjects = firestoreSync.subscribeProjects((cloudProjects) => {
      if (cloudProjects && cloudProjects.length > 0) {
        setProjects(cloudProjects);
      }
    });

    const unsubUsers = firestoreSync.subscribeUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setUsers(cloudUsers);
      }
    });

    const unsubSettings = firestoreSync.subscribeCompanySettings((cloudSettings) => {
      if (cloudSettings) {
        setCompanySettings(cloudSettings);
      }
    });

    return () => {
      isMounted = false;
      unsubProjects();
      unsubUsers();
      unsubSettings();
    };
  }, []);

  // Backup sync to local storage for offline resilience
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('3plus_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('3plus_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('3plus_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('3plus_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('3plus_settings', JSON.stringify(companySettings));
  }, [companySettings]);

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    const targetUser = users.find((u) => u.role === newRole) || {
      ...currentUser!,
      role: newRole
    };
    setCurrentUser(targetUser);
  };

  // Data Update Handlers (with Firebase Cloud sync)
  const handleAddProject = (newProjectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...newProjectData,
      id: Date.now()
    };
    handleUpdateProjectsList([newProject, ...projects]);
  };

  const handleUpdateProjectsList = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    // Find deleted projects to remove from firestore
    const currentIds = new Set(updatedProjects.map((p) => p.id));
    projects.forEach((p) => {
      if (!currentIds.has(p.id)) {
        firestoreSync.deleteProject(p.id);
      }
    });
    // Save updated or new items
    updatedProjects.forEach((proj) => {
      firestoreSync.saveProject(proj);
    });
  };

  const handleUpdateUsersList = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    const currentIds = new Set(updatedUsers.map((u) => u.id));
    users.forEach((u) => {
      if (!currentIds.has(u.id)) {
        firestoreSync.deleteUser(u.id);
      }
    });
    updatedUsers.forEach((u) => {
      firestoreSync.saveUser(u);
    });
  };

  const handleUpdateCompanySettings = (updatedSettings: CompanySettings) => {
    setCompanySettings(updatedSettings);
    firestoreSync.saveCompanySettings(updatedSettings);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    setSelectedProject(updatedProject);
    firestoreSync.saveProject(updatedProject);
  };

  const handleResetData = () => {
    setProjects(MOCK_PROJECTS);
    setUsers(MOCK_USERS);
    setCompanySettings(DEFAULT_COMPANY_SETTINGS);
    localStorage.removeItem('3plus_projects');
    localStorage.removeItem('3plus_users');
    localStorage.removeItem('3plus_settings');
    // Re-seed to cloud
    MOCK_PROJECTS.forEach((p) => firestoreSync.saveProject(p));
    MOCK_USERS.forEach((u) => firestoreSync.saveUser(u));
    firestoreSync.saveCompanySettings(DEFAULT_COMPANY_SETTINGS);
  };

  // Filter projects by role permissions if applicable
  const displayProjects = projects.filter((p) => {
    if (!currentUser) return true;
    if (currentUser.role === 'direktur') return true; // BOD sees everything
    if (currentUser.role === 'project_manager') {
      return true;
    }
    if (currentUser.role === 'representative_associate') {
      return true;
    }
    return true;
  });

  // Calculate executive KPI summary statistics
  const totalValue = displayProjects.reduce((sum, p) => sum + p.contractValue, 0);
  const totalCount = displayProjects.length;
  const ongoingCount = displayProjects.filter((p) => p.status === 'on_going').length;
  const prospekCount = displayProjects.filter((p) => p.status === 'prospek').length;
  const bastCount = displayProjects.filter((p) => p.status === 'bast').length;

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans flex flex-col">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onRoleSwitch={handleRoleSwitch}
        onLogout={handleLogout}
      />

      {/* Dynamic Announcement Banner if enabled */}
      {companySettings.showAnnouncement && companySettings.announcementBanner && (
        <div className="bg-orange-500 text-white px-4 py-2 border-b border-orange-600 text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
          <Megaphone className="w-4 h-4 shrink-0 animate-bounce" />
          <span className="truncate">{companySettings.announcementBanner}</span>
        </div>
      )}

      {/* Top Header Overview Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
            {companySettings.companyName} Management System
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {companySettings.tagline} • Update Real-time Portofolio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-md border border-emerald-200 font-bold">
            <CloudCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Firebase Cloud Live</span>
          </div>
          <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md border border-slate-200 font-medium">
            Total Nilai: <strong className="text-orange-600 font-black ml-1">{formatIDR(totalValue, true)}</strong>
          </div>
          <div className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-md font-bold uppercase tracking-wider">
            Peran: {currentUser.role.replace('_', ' ')}
          </div>
        </div>
      </header>

      {/* Executive Metric Cards Banner (Shown on Dashboard Views) */}
      {activeTab !== 'admin' && (
        <div className="bg-[#f1f5f9] px-6 pt-5 pb-4 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Proyek</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl lg:text-3xl font-black text-slate-900">{totalCount}</span>
                <span className="text-xs text-slate-500 font-bold mb-1">Proyek</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Prospek (Pre-Deal)</p>
              <div className="text-2xl lg:text-3xl font-black text-slate-900">{prospekCount}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">On Going (Konstruksi)</p>
              <div className="text-2xl lg:text-3xl font-black text-slate-900">{ongoingCount}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-green-500">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">BAST (Selesai)</p>
              <div className="text-2xl lg:text-3xl font-black text-slate-900">{bastCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'map' && (
          <InteractiveMap
            projects={displayProjects}
            onSelectProject={(p) => setSelectedProject(p)}
            selectedStatus={mapStatusFilter}
            selectedRegion={mapRegionFilter}
            onStatusChange={setMapStatusFilter}
            onRegionChange={setMapRegionFilter}
          />
        )}

        {activeTab === 'table' && (
          <ProjectTable
            projects={displayProjects}
            onSelectProject={(p) => setSelectedProject(p)}
            onAddProject={handleAddProject}
            userRole={currentUser.role}
          />
        )}

        {activeTab === 'timeline' && (
          <ProjectTimeline
            projects={displayProjects}
            onSelectProject={(p) => setSelectedProject(p)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminCMS
            projects={projects}
            users={users}
            companySettings={companySettings}
            onUpdateProjects={handleUpdateProjectsList}
            onUpdateUsers={handleUpdateUsersList}
            onUpdateCompanySettings={handleUpdateCompanySettings}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-10 bg-[#0f172a] text-slate-400 px-6 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold border-t border-slate-800">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Server Operational
          </span>
          <span className="hidden sm:inline-block">User Sesi: {currentUser.name} ({currentUser.email})</span>
        </div>
        <div>
          © {new Date().getFullYear()} {companySettings.companyName.toUpperCase()} DATA CENTER
        </div>
      </footer>

      {/* Single Project Detail View Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdateProject={handleUpdateProject}
          userRole={currentUser.role}
        />
      )}
    </div>
  );
}

