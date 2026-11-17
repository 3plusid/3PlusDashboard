import React, { useState } from 'react';
import { Logo } from './Logo';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '../lib/firebase';

type Mode = 'login' | 'signup' | 'reset';

const errorText = (code: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'Email atau kata sandi salah.';
    case 'auth/email-already-in-use':
      return 'Email ini sudah punya akun. Silakan masuk, atau pakai "Lupa kata sandi".';
    case 'auth/weak-password':
      return 'Kata sandi minimal 6 karakter.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.';
    case 'auth/operation-not-allowed':
      return 'Login email belum diaktifkan di Firebase (Authentication > Sign-in method > Email/Password).';
    case 'auth/network-request-failed':
      return 'Koneksi internet bermasalah. Coba lagi.';
    default:
      return 'Terjadi kesalahan (' + code + '). Coba lagi.';
  }
};

export const LoginScreen: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrorMessage('');
    setInfoMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await authApi.signIn(email, password);
      } else if (mode === 'signup') {
        await authApi.signUp(email, password);
      } else {
        await authApi.resetPassword(email);
        setInfoMessage('Jika email terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Cek inbox/spam.');
      }
    } catch (err: any) {
      if (mode === 'reset' && err?.code === 'auth/user-not-found') {
        setInfoMessage('Jika email terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Cek inbox/spam.');
      } else {
        setErrorMessage(errorText(err?.code || 'unknown'));
      }
    } finally {
      setBusy(false);
    }
  };

  const titles: Record<Mode, { title: string; button: string }> = {
    login: { title: 'Masuk ke Dashboard', button: 'Masuk ke Dashboard' },
    signup: { title: 'Buat Akun Tim', button: 'Buat Akun' },
    reset: { title: 'Lupa Kata Sandi', button: 'Kirim Tautan Reset' }
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

        <h2 className="text-sm font-extrabold text-slate-800 text-center mb-4">{titles[mode].title}</h2>

        {infoMessage && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Login Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {mode !== 'reset' && (
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
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm shadow-orange-500/30 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
          >
            {busy ? 'Memproses...' : titles[mode].button} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 flex flex-col items-center gap-2 text-xs font-semibold">
          {mode !== 'login' && (
            <button type="button" onClick={() => switchMode('login')} className="text-orange-600 hover:underline">
              Kembali ke halaman masuk
            </button>
          )}
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => switchMode('reset')} className="text-orange-600 hover:underline">
                Lupa kata sandi?
              </button>
              <button type="button" onClick={() => switchMode('signup')} className="text-slate-500 hover:text-slate-800">
                Belum punya akun? <span className="text-orange-600 hover:underline">Buat akun</span>
              </button>
            </>
          )}
          {mode === 'signup' && (
            <p className="text-[11px] text-slate-500 text-center font-medium">
              Akun hanya bisa membuka dashboard jika email Anda sudah didaftarkan Direktur di menu Tim &amp; PIC.
            </p>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          PT 3PLUS INDONESIA DATA CENTER © {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
};

/** Shown after sign-in when the email is not verified yet, or has no dashboard access. */
export const AccessScreen: React.FC<{
  kind: 'loading' | 'verify' | 'denied';
  email?: string;
  onRecheck?: () => Promise<void>;
  onLogout?: () => void;
}> = ({ kind, email, onRecheck, onLogout }) => {
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>, okMsg?: string) => {
    setBusy(true);
    setMsg('');
    try {
      await fn();
      if (okMsg) setMsg(okMsg);
    } catch (err: any) {
      setMsg(errorText(err?.code || 'unknown'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-8 text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" lightText={false} />
        </div>

        {kind === 'loading' && <p className="text-xs font-semibold text-slate-500">Memuat...</p>}

        {kind === 'verify' && (
          <>
            <h2 className="text-sm font-extrabold text-slate-800 mb-2">Verifikasi email Anda</h2>
            <p className="text-xs text-slate-600 mb-5">
              Kami sudah mengirim tautan verifikasi ke <strong>{email}</strong>. Buka email itu (cek juga folder spam),
              klik tautannya, lalu tekan tombol di bawah.
            </p>
            <button
              disabled={busy}
              onClick={() => run(async () => { await onRecheck?.(); }, 'Email belum terverifikasi. Klik tautan di email dulu, lalu coba lagi.')}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-xs rounded-lg mb-2"
            >
              Saya sudah verifikasi
            </button>
            <button
              disabled={busy}
              onClick={() => run(() => authApi.resendVerification(), 'Email verifikasi dikirim ulang.')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
            >
              Kirim ulang email verifikasi
            </button>
          </>
        )}

        {kind === 'denied' && (
          <>
            <h2 className="text-sm font-extrabold text-slate-800 mb-2">Akun belum punya akses</h2>
            <p className="text-xs text-slate-600 mb-5">
              Email <strong>{email}</strong> belum didaftarkan sebagai tim. Minta Direktur menambahkan email ini di
              CMS Admin &gt; Tim &amp; PIC, lalu tekan "Cek lagi".
            </p>
            <button
              disabled={busy}
              onClick={() => run(async () => { await onRecheck?.(); }, 'Akses belum ditemukan untuk email ini.')}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-xs rounded-lg"
            >
              Cek lagi
            </button>
          </>
        )}

        {msg && <p className="mt-4 text-xs font-bold text-slate-600">{msg}</p>}

        {kind !== 'loading' && (
          <button onClick={onLogout} className="mt-6 text-xs font-semibold text-slate-500 hover:text-slate-800 underline">
            Keluar / ganti akun
          </button>
        )}
      </div>
    </div>
  );
};
