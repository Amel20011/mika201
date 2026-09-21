import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EditProfileModal } from './EditProfileModal';
import {
  User,
  School,
  Calendar,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  Edit3,
  LogOut,
  TrendingUp,
  Target,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    user,
    history,
    badges,
    passedChaptersCount,
    totalChaptersCount,
    overallAverageScore,
    logout,
    setActiveView,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const totalQuestionsAnswered = history.reduce((sum, h) => sum + h.totalQuestions, 0);
  const correctAnswersCount = history.reduce((sum, h) => sum + h.correct, 0);
  const incorrectAnswersCount = history.reduce((sum, h) => sum + h.incorrect, 0);

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Profil & Statistik Belajar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Informasi akun siswa dan ringkasan portofolio pencapaian
          </p>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          id="account-edit-profile-btn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition border border-indigo-200 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profil</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative mx-auto sm:mx-0">
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/10 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black border-2 border-white shadow-xs">
              {user.educationLevel}
            </span>
          </div>

          <div className="space-y-3 flex-1 text-center sm:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {user.name}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Aktif
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {user.school} • Umur {user.age} Tahun
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                Jenjang Terdaftar: {user.educationLevel}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                {user.points} Poin Akumulasi
              </span>
            </div>
          </div>
        </div>

        {/* Learning Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 mt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Bab Selesai
            </span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">
              {passedChaptersCount} / {totalChaptersCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Total Soal
            </span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">
              {totalQuestionsAnswered}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Jawaban Benar
            </span>
            <span className="text-xl font-black text-emerald-600 mt-0.5 block">
              {correctAnswersCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Jawaban Salah
            </span>
            <span className="text-xl font-black text-rose-600 mt-0.5 block">
              {incorrectAnswersCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Rata-rata Nilai
            </span>
            <span className="text-xl font-black text-indigo-600 mt-0.5 block">
              {overallAverageScore}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Total Poin
            </span>
            <span className="text-xl font-black text-amber-600 mt-0.5 block">
              {user.points}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Earned Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Lencana Penghargaan
          </h3>
          <button
            onClick={() => setActiveView('rewards')}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Lihat Sertifikat
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border flex items-center gap-3 ${
                badge.isUnlocked
                  ? 'bg-indigo-50/50 border-indigo-200'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  badge.isUnlocked ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{badge.title}</h4>
                <p className="text-[10px] text-slate-500 truncate">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Settings & Logout */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveView('settings')}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          Buka Pengaturan Sistem
        </button>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition border border-rose-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};
