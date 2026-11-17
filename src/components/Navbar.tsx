import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Logo } from './Logo';
import { Map, Table, Calendar, LogOut, ShieldCheck, UserCheck, ChevronDown, Settings } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'table' | 'timeline' | 'admin';
  onTabChange: (tab: 'map' | 'table' | 'timeline' | 'admin') => void;
  currentUser: User;
  onLogout: () => void;
}


export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
}) => {

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
            {currentUser.role === 'direktur' && (
            <button
              onClick={() => onTabChange('admin')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4 text-orange-400" />
              CMS Admin
            </button>
            )}
          </nav>

        </div>

        {/* Right User & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Signed-in user */}
          <div className="flex items-center gap-2.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <div className="text-left hidden sm:block">
              <div className="font-extrabold text-slate-100">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400">{roleLabels[currentUser.role]?.title || currentUser.role}</div>
            </div>
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
        {currentUser.role === 'direktur' && (
        <button
          onClick={() => onTabChange('admin')}
          className={`px-3.5 py-1.5 rounded-md flex items-center gap-1 ${
            activeTab === 'admin' ? 'bg-orange-500 text-white' : 'text-slate-400'
          }`}
        >
          <Settings className="w-3.5 h-3.5" /> Admin
        </button>
        )}
      </div>

    </header>
  );
};
