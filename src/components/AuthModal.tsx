import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, LogIn, ArrowRight, UserCheck } from 'lucide-react';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { login } = useApp();
  const [nameOrEmail, setNameOrEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(nameOrEmail || 'Farhan Ardiansyah');
    onClose();
  };

  const handleQuickDemo = (demoName: string) => {
    login(demoName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 relative space-y-6 animate-scaleIn">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
            <LogIn className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Masuk ke Aurelia Edu</h3>
          <p className="text-xs text-slate-500 font-medium">
            Lanjutkan progres pembelajaran dan evaluasi bab kamu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nama Lengkap atau Akun
            </label>
            <input
              type="text"
              required
              value={nameOrEmail}
              onChange={(e) => setNameOrEmail(e.target.value)}
              placeholder="Masukkan nama akun kamu..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden font-medium text-slate-900 text-sm transition"
            />
          </div>

          <button
            type="submit"
            id="auth-submit-login-btn"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
            Pilihan Akun Cepat (Demo Preview)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('Farhan Ardiansyah')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">Farhan (SMA)</p>
                <p className="text-[10px] text-slate-500 truncate">Siswa SMA</p>
              </div>
            </button>
            <button
              onClick={() => handleQuickDemo('Kezia Putri')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">Kezia (SMP)</p>
                <p className="text-[10px] text-slate-500 truncate">Siswa SMP</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
