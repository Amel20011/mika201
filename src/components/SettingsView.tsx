import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  RotateCcw,
  ShieldCheck,
  Heart,
  Target,
  Clock,
  Info,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    settings,
    updateSettings,
    resetAllProgress,
    refillLives,
    setActiveView,
  } = useApp();

  const handleResetConfirm = () => {
    const confirmed = window.confirm(
      'Apakah kamu yakin ingin mereset seluruh progres pembelajaran, skor bab, dan riwayat pengerjaan? Tindakan ini tidak dapat dibatalkan.'
    );
    if (confirmed) {
      resetAllProgress();
      alert('Progres belajar telah berhasil direset ke awal.');
      setActiveView('dashboard');
    }
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Pengaturan Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Konfigurasi alur belajar, sistem nyawa, dan preferensi pembelajaran
        </p>
      </div>

      {/* Alur Belajar Settings */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Aturan & Alur Pembelajaran
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Sesuaikan cara pembukaan bab dalam silabus
            </p>
          </div>
        </div>

        {/* Sequential Toggle */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <span className="font-bold text-sm text-slate-900 block">
              Buka Bab Secara Berurutan
            </span>
            <p className="text-xs text-slate-500 font-medium max-w-lg">
              Jika aktif, pengguna wajib lulus Bab N (nilai minimal 80%) sebelum Bab N+1 terbuka.
              Jika dinonaktifkan, semua bab dapat diakses bebas.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.strictSequentialChapters}
            onClick={() =>
              updateSettings({ strictSequentialChapters: !settings.strictSequentialChapters })
            }
            className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
              settings.strictSequentialChapters ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform transform ${
                settings.strictSequentialChapters ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* System Rules Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wider">
              Standar Kelulusan 80%
            </h4>
            <p className="text-xs text-indigo-800 leading-relaxed font-normal">
              Setiap bab memiliki syarat kelulusan minimal 80% untuk diakui tuntas dan membuka reward.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <h4 className="font-bold text-xs text-rose-950 uppercase tracking-wider">
              Maksimal 5 Nyawa
            </h4>
            <p className="text-xs text-rose-800 leading-relaxed font-normal">
              Jawaban yang salah mengurangi 1 nyawa. Jika 0, soal baru tidak dapat dibuka hingga regenerasi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider">
              Regenerasi 1 Menit
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed font-normal">
              Nyawa pulih 1 poin setiap 60 detik berbasis timestamp, tetap berjalan meski browser ditutup.
            </p>
          </div>
        </div>
      </div>

      {/* Development & Demo Utilities */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-slate-700" />
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Alat Uji & Pemulihan Data
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Fitur bantu untuk pengujian sistem secara langsung
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">
              Isi Penuh Nyawa (Instant Refill)
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Pulihkan nyawa menjadi 5/5 seketika untuk kemudahan pengujian fitur evaluasi.
            </p>
          </div>

          <button
            onClick={refillLives}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition shrink-0"
          >
            Isi Nyawa 5/5
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/40 border border-rose-200">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-rose-950">
              Reset Seluruh Progres Belajar
            </h4>
            <p className="text-xs text-rose-800/80 font-medium">
              Mengembalikan semua bab ke status belum dikerjakan dan membersihkan riwayat pengerjaan.
            </p>
          </div>

          <button
            onClick={handleResetConfirm}
            id="settings-reset-progress-btn"
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shrink-0 shadow-xs"
          >
            Reset Progres
          </button>
        </div>
      </div>
    </div>
  );
};
