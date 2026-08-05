import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Logo } from './Logo';
import { Map, Table, Calendar, LogOut, ShieldCheck, UserCheck, ChevronDown, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'table' | 'timeline';
  onTabChange: (tab: 'map' | 'table' | 'timeline') => void;
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onRoleSwitch,
  onLogout,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badgeColor: string }> = {
    direktur: {
      title: 'Direktur (BOD)',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    project_manager: {
      title: 'Project Manager',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    representative_associate: {
      title: 'Representative Associate',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  };

  return (
    <header className="bg-[#0f172a] text-white sticky top-0 z-[500] border-b border-slate-700/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left Brand Logo */}
        <div className="flex items-center gap-6">
          <Logo size="sm" className="cursor-pointer" lightText={true} />

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-md border border-slate-700/50">
            <button
              onClick={() => onTabChange('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'map'
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Map className="w-4 h-4" />
              Peta Indonesia
            </button>
            <button
              onClick={() => onTabChange('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'table'
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Table className="w-4 h-4" />
              Daftar Proyek
            </button>
            <button
              onClick={() => onTabChange('timeline')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'timeline'
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Linimasa Proyek
            </button>
          </nav>
        </div>

        {/* Right User & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Active User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <div className="text-left hidden sm:block">
                <div className="font-extrabold text-slate-100">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400">{roleLabels[currentUser.role].title}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-2 z-[600] animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Ganti Peran Pengguna (Demo Access)
                </div>

                <div className="space-y-1 my-1">
                  <button
                    onClick={() => {
                      onRoleSwitch('direktur');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                      currentUser.role === 'direktur' ? 'bg-orange-50 text-orange-900 border border-orange-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold">Direktur (BOD)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Akses penuh seluruh portofolio & keuangan</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleSwitch('project_manager');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                      currentUser.role === 'project_manager' ? 'bg-blue-50 text-blue-900 border border-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold">Project Manager</div>
                      <div className="text-[10px] text-slate-500 font-normal">Kelola jadwal & progres stage proyek</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleSwitch('representative_associate');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                      currentUser.role === 'representative_associate' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold">Representative Associate</div>
                      <div className="text-[10px] text-slate-500 font-normal">Pantau prospek regional & kontak klien</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Keluar dari akun"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile Tab Navigation bar */}
      <div className="md:hidden flex items-center justify-around bg-[#0f172a] border-t border-slate-800 px-2 py-1.5 text-xs font-bold">
        <button
          onClick={() => onTabChange('map')}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${
            activeTab === 'map' ? 'bg-orange-500 text-white' : 'text-slate-400'
          }`}
        >
          <Map className="w-3.5 h-3.5" /> Peta
        </button>
        <button
          onClick={() => onTabChange('table')}
          className={`px-3.5 py-1.5 rounded-md flex items-center gap-1 ${
            activeTab === 'table' ? 'bg-orange-500 text-white' : 'text-slate-400'
          }`}
        >
          <Table className="w-3.5 h-3.5" /> Daftar
        </button>
        <button
          onClick={() => onTabChange('timeline')}
          className={`px-3.5 py-1.5 rounded-md flex items-center gap-1 ${
            activeTab === 'timeline' ? 'bg-orange-500 text-white' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Linimasa
        </button>
      </div>
    </header>
  );
};
