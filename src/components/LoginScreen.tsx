import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { Logo } from './Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('direktur@3plus.co.id');
  const [password, setPassword] = useState('3plus123');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Find user by email
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      setErrorMessage('Email tidak terdaftar dalam sistem PT 3Plus Indonesia.');
      return;
    }

    if (!password) {
      setErrorMessage('Kata sandi tidak boleh kosong.');
      return;
    }

    // Success login
    onLoginSuccess(foundUser);
  };

  const handleQuickLogin = (userRole: UserRole) => {
    const foundUser = MOCK_USERS.find((u) => u.role === userRole) || MOCK_USERS[0];
    onLoginSuccess(foundUser);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Orange Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-8 z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" lightText={false} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Management System</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Portal Informasi & Pemantauan Portofolio Indonesia
          </p>
        </div>

        {/* Login Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Perusahaan</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@3plus.co.id"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
          >
            Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Presets Quick Login for Demonstration */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
            Pilih Peran untuk Akses Cepat (Demo):
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('direktur')}
              className="w-full p-2.5 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-900 rounded-lg border border-slate-200 hover:border-orange-300 text-xs font-bold flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>Masuk sebagai Direktur (BOD)</span>
              </div>
              <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-black">FULL ACCESS</span>
            </button>

            <button
              onClick={() => handleQuickLogin('project_manager')}
              className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-900 rounded-lg border border-slate-200 hover:border-blue-300 text-xs font-bold flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Masuk sebagai Project Manager</span>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-black">PROJECT EDIT</span>
            </button>

            <button
              onClick={() => handleQuickLogin('representative_associate')}
              className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 rounded-lg border border-slate-200 hover:border-emerald-300 text-xs font-bold flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Masuk sebagai Representative Associate</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">PROSPECT VIEW</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          PT 3PLUS INDONESIA DATA CENTER © {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
};
