import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BannerCarousel } from './BannerCarousel';
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronRight,
  BookOpen,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    userSubjects,
    history,
    continueLearning,
    selectSubject,
    selectChapter,
    openMaterial,
    setActiveView,
    isChapterUnlocked,
    totalChaptersCount,
    passedChaptersCount,
    overallAverageScore,
    isAllChaptersPassed,
  } = useApp();

  // Active subject selected in the Pembelajaran tab
  const [selectedSubjId, setSelectedSubjId] = useState<string>(() => {
    return userSubjects.length > 0 ? userSubjects[0].id : '';
  });

  const activeSubject = userSubjects.find((s) => s.id === selectedSubjId) || userSubjects[0];

  const recentHistory = history.slice(0, 4);

  return (
    <div className="space-y-8 pb-20 lg:pb-10 max-w-6xl mx-auto">
      {/* 1. TOP CALL TO ACTION & OVERALL SUMMARY BANNER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Kelulusan Setiap Bab: Minimal 80%</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang Kembali, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-sm text-slate-600 font-normal max-w-xl">
              Tuntaskan seluruh 8 bab pembelajaran dengan nilai minimal 80% untuk membuka sertifikasi kelulusan resmi.
            </p>
          </div>

          {/* Quick Action Button: Lanjutkan Belajar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={continueLearning}
              id="dashboard-continue-learning-btn"
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/25 transition transform active:scale-98"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Lanjutkan Belajar</span>
            </button>

            <button
              onClick={() => setActiveView('rewards')}
              id="dashboard-check-rewards-btn"
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition"
            >
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Status Reward</span>
            </button>
          </div>
        </div>

        {/* Learning Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Bab Tuntas</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{passedChaptersCount}</span>
              <span className="text-xs font-semibold text-slate-500">/ {totalChaptersCount}</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Nilai &ge; 80%</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Rata-Rata</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{overallAverageScore}%</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Akumulasi nilai bab</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Total Poin</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{user.points}</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Peringkat siswa aktif</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Sertifikasi</span>
              <Award className={`w-4 h-4 ${isAllChaptersPassed ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-base font-extrabold ${isAllChaptersPassed ? 'text-emerald-700' : 'text-slate-600'}`}>
                {isAllChaptersPassed ? 'Terbuka' : 'Terkunci'}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-1">
              {isAllChaptersPassed ? 'Siap diklaim' : 'Perlu semua bab &ge; 80%'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. PROMOTIONAL CAROUSEL BANNER */}
      <BannerCarousel />

      {/* 3. SECTION PEMBELAJARAN (BAB 1 - BAB 8) */}
      <section className="space-y-6" id="dashboard-pembelajaran-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pembelajaran
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Struktur materi berjenjang untuk kurikulum {user.educationLevel}
            </p>
          </div>

          <button
            onClick={() => setActiveView('subjects')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition self-start sm:self-auto"
          >
            <span>Lihat Semua Mata Pelajaran</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subject Selector Tabs */}
        {userSubjects.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {userSubjects.map((sub) => {
              const isActive = sub.id === (activeSubject?.id || '');
              const passedCount = sub.chapters.filter((c) => c.status === 'Lulus' && c.score >= 80).length;

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjId(sub.id)}
                  id={`subject-tab-${sub.id}`}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{sub.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {passedCount}/8 Bab
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 8 Chapters List */}
        {activeSubject && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{activeSubject.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{activeSubject.description}</p>
                </div>
              </div>
              <button
                onClick={() => selectSubject(activeSubject.id)}
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
              >
                <span>Detail Silabus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeSubject.chapters.map((ch) => {
                const unlocked = isChapterUnlocked(activeSubject.id, ch.chapterNumber);
                const isPassed = ch.score >= 80 && ch.status === 'Lulus';
                const isUnderTarget = ch.score > 0 && ch.score < 80;

                return (
                  <div
                    key={ch.id}
                    id={`chapter-card-${ch.id}`}
                    onClick={() => {
                      if (unlocked) {
                        selectChapter(activeSubject.id, ch.chapterNumber);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      !unlocked
                        ? 'bg-slate-50/70 border-slate-200 opacity-60 cursor-not-allowed'
                        : isPassed
                        ? 'bg-emerald-50/20 border-emerald-200 hover:border-emerald-300 hover:shadow-sm cursor-pointer'
                        : isUnderTarget
                        ? 'bg-amber-50/20 border-amber-200 hover:border-amber-300 hover:shadow-sm cursor-pointer'
                        : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wider">
                            BAB {ch.chapterNumber}
                          </span>

                          {/* Status Badge */}
                          {isPassed ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Lulus ({ch.score}%)</span>
                            </span>
                          ) : isUnderTarget ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                              <AlertCircle className="w-3 h-3" />
                              <span>Belum Lulus ({ch.score}%)</span>
                            </span>
                          ) : !unlocked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-600">
                              <Lock className="w-3 h-3" />
                              <span>Terkunci</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                              Belum Dikerjakan
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {ch.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                          {ch.description}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    </div>

                    {/* Progress Bar & Quick Action */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>Nilai Penguasaan</span>
                        <span className={`font-bold ${isPassed ? 'text-emerald-700' : isUnderTarget ? 'text-amber-700' : 'text-slate-600'}`}>
                          {ch.score}% (Target &ge; 80%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isPassed ? 'bg-emerald-500' : isUnderTarget ? 'bg-amber-500' : 'bg-slate-300'
                          }`}
                          style={{ width: `${ch.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 4. SECTION RIWAYAT TERAKHIR */}
      <section className="space-y-4" id="dashboard-riwayat-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Riwayat Terakhir
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Hasil evaluasi pengerjaan soal terbaru
            </p>
          </div>
          <button
            onClick={() => setActiveView('history')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            <span>Semua Riwayat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentHistory.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Belum Ada Riwayat Pengerjaan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              Mulai pelajari materi dan kerjakan latihan soal untuk mencatat pencapaian dan nilai kamu.
            </p>
            <button
              onClick={continueLearning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 transition"
            >
              <span>Mulai Belajar Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {recentHistory.map((item) => {
              const isPassed = item.status === 'Lulus';
              return (
                <div
                  key={item.id}
                  onClick={() => selectChapter(item.subjectId, item.chapterNumber)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isPassed ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.subjectName} — BAB {item.chapterNumber}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            isPassed
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {item.chapterTitle} • {item.date} pukul {item.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-lg font-black ${isPassed ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {item.score}%
                    </span>
                    <p className="text-[10px] font-semibold text-slate-400">
                      {item.correct} benar / {item.totalQuestions} soal
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
