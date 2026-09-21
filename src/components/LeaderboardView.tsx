import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Star,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { soundManager } from '../utils/audio';

export const LeaderboardView: React.FC = () => {
  const {
    user,
    userSubjects,
    passedChaptersCount,
    totalChaptersCount,
    overallAverageScore,
    selectChapter,
    openMaterial,
    startQuiz,
    setActiveView,
    history,
    openScoreAudit,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    userSubjects[0]?.id || ''
  );

  const activeSubject = userSubjects.find((s) => s.id === selectedSubjectId) || userSubjects[0];

  // Calculate mastery level
  const completionPercentage = totalChaptersCount > 0 
    ? Math.round((passedChaptersCount / totalChaptersCount) * 100) 
    : 0;

  const getMasteryLevel = (pct: number) => {
    if (pct === 100) return { title: 'Master Silabus Mandiri', badge: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (pct >= 75) return { title: 'Pembelajar Ahli', badge: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
    if (pct >= 50) return { title: 'Pembelajar Lanjut', badge: 'bg-blue-100 text-blue-900 border-blue-300' };
    if (pct >= 25) return { title: 'Pembelajar Berkembang', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    return { title: 'Pembelajar Pemula', badge: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  const mastery = getMasteryLevel(completionPercentage);

  // Perfect chapters count (100% score)
  const perfectChaptersCount = userSubjects.reduce((acc, sub) => {
    return acc + sub.chapters.filter((ch) => ch.score === 100 && ch.status === 'Lulus').length;
  }, 0);

  // Total questions answered from user's history
  const totalQuestionsAnswered = history.reduce((sum, h) => sum + h.totalQuestions, 0);
  const totalCorrectAnswered = history.reduce((sum, h) => sum + h.correct, 0);
  const accuracyPercent = totalQuestionsAnswered > 0
    ? Math.round((totalCorrectAnswered / totalQuestionsAnswered) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Halaman Prestasi Mandiri */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Prestasi Belajar Mandiri
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Pantau capaian penguasaan materi, ketuntasan Bab 1 hingga Bab 8, dan rekor evaluasi mandiri kamu.
          </p>
        </div>

        {/* Tingkat Kemandirian User & Tombol Cek Poin */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              openScoreAudit();
            }}
            id="leaderboard-check-score-points-btn"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cek Skor Poin</span>
          </button>

          <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2.5 shadow-xs ${mastery.badge}`}>
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
                Status Kemandirian
              </span>
              <span className="font-extrabold text-xs sm:text-sm block">
                {mastery.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Kartu Metrik Statistik Utama Pribadi dengan Efek Suara Counter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Bab Tuntas */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Bab Tuntas (≥80%)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="pt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              <AnimatedCounter value={passedChaptersCount} />
            </span>
            <span className="text-xs font-bold text-slate-400">
              / {totalChaptersCount} Bab
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-medium block pt-1">
            {completionPercentage}% Silabus Tercapai
          </span>
        </div>

        {/* Rata-Rata Nilai Kelulusan */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Rata-Rata Skor Bab
            </span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="pt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">
              <AnimatedCounter value={overallAverageScore} suffix="%" />
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-indigo-600 h-full transition-all duration-700"
              style={{ width: `${Math.min(overallAverageScore, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-medium block pt-1">
            Standar Minimal Kelulusan 80%
          </span>
        </div>

        {/* Nilai Sempurna 100 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Bab Skor 100 (Sempurna)
            </span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="pt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-500">
              <AnimatedCounter value={perfectChaptersCount} />
            </span>
            <span className="text-xs font-bold text-slate-400">Bab</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium pt-3">
            Dikerjakan dengan akurasi 100% tanpa kesalahan
          </p>
        </div>

        {/* Akumulasi Poin Pribadi */}
        <div 
          onClick={() => {
            soundManager.playClick();
            openScoreAudit();
          }}
          id="leaderboard-metric-points-card"
          className="p-4 sm:p-5 rounded-3xl bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-300 shadow-xs space-y-1 cursor-pointer transition group"
          title="Klik untuk mengecek skor poin dan evaluasi semua bab"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-amber-700 transition">
              Akumulasi Poin
            </span>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 group-hover:bg-amber-100 px-1.5 py-0.5 rounded-md transition">
              Cek &rarr;
            </span>
          </div>
          <div className="pt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-600">
              <AnimatedCounter value={user.points} />
            </span>
            <span className="text-xs font-bold text-slate-400">Poin</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium pt-3">
            {totalQuestionsAnswered} soal dijawab ({accuracyPercent}% akurasi)
          </p>
        </div>
      </div>

      {/* Banner Progres Menuju Sertifikat Kelulusan */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-indigo-800 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/20">
                Target Pembelajaran Individu
              </span>
              <span className="text-xs text-indigo-200">
                Jenjang {user.educationLevel}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              {completionPercentage === 100
                ? 'Selamat! Seluruh Bab Telah Berhasil Kamu Selesaikan!'
                : `Luluskan Semua Bab untuk Menerbitkan Sertifikat Resmi`}
            </h3>
            <p className="text-xs text-indigo-200 leading-relaxed font-normal">
              {completionPercentage === 100
                ? 'Kamu telah menuntaskan seluruh 8 bab di setiap mata pelajaran dengan nilai kelulusan minimal 80%. Sertifikat resmi siap dicetak.'
                : `Masih ada ${totalChaptersCount - passedChaptersCount} bab lagi yang perlu dituntaskan dengan nilai minimal 80% untuk membuka sertifikat resmi atas nama kamu.`}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveView('rewards');
            }}
            id="achievements-view-certificate-btn"
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-indigo-900 font-extrabold text-xs shadow-md transition shrink-0 flex items-center gap-2 self-start md:self-auto"
          >
            <span>{completionPercentage === 100 ? 'Lihat Sertifikat Kelulusan' : 'Cek Status Sertifikat'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pilihan Mata Pelajaran untuk Memantau Bab */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Peta Prestasi Bab per Mata Pelajaran
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Pilih mata pelajaran untuk memeriksa nilai tertinggi dan status kelulusan tiap bab (Bab 1 - 8)
            </p>
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {userSubjects.map((subject) => {
              const isSelected = subject.id === selectedSubjectId;
              const subjectPassed = subject.chapters.filter((c) => c.status === 'Lulus').length;

              return (
                <button
                  key={subject.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedSubjectId(subject.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{subject.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {subjectPassed}/8
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabel / Grid 8 Bab dari Mata Pelajaran Terpilih */}
        {activeSubject && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Subject Sub-header */}
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base text-slate-900">
                    {activeSubject.name}
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {activeSubject.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {activeSubject.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Ketuntasan Mapel:
                </span>
                <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeSubject.chapters.filter((c) => c.status === 'Lulus').length} dari 8 Bab Lulus
                </span>
              </div>
            </div>

            {/* List 8 Bab */}
            <div className="divide-y divide-slate-100">
              {activeSubject.chapters.map((chapter) => {
                const isPassed = chapter.status === 'Lulus';
                const isPerfect = isPassed && chapter.score === 100;
                const isFailed = chapter.status === 'Belum Lulus';
                const isUnattempted = chapter.status === 'Belum Dikerjakan';

                return (
                  <div
                    key={chapter.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                  >
                    {/* Chapter Info */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm ${
                          isPerfect
                            ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : isFailed
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {chapter.chapterNumber}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-bold text-sm text-slate-900 truncate">
                            Bab {chapter.chapterNumber}: {chapter.title}
                          </h5>

                          {/* Status Badge */}
                          {isPerfect && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              Sempurna (100)
                            </span>
                          )}
                          {isPassed && !isPerfect && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              Lulus ({chapter.score}%)
                            </span>
                          )}
                          {isFailed && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              <AlertCircle className="w-3 h-3" />
                              Belum Lulus ({chapter.score}%)
                            </span>
                          )}
                          {isUnattempted && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              <Clock className="w-3 h-3 text-slate-400" />
                              Belum Dikerjakan
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
                          {chapter.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions & Score */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Skor Bab
                        </span>
                        <span
                          className={`text-base font-black ${
                            isPassed
                              ? 'text-emerald-600'
                              : isFailed
                              ? 'text-rose-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {isUnattempted ? '-' : `${chapter.score}%`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            openMaterial(activeSubject.id, chapter.chapterNumber);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5"
                          title="Buka ringkasan materi bab ini"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Materi</span>
                        </button>

                        <button
                          onClick={() => {
                            soundManager.playClick();
                            startQuiz(activeSubject.id, chapter.chapterNumber);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                            isPassed
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {isPassed ? (
                            <>
                              <RotateCcw className="w-3 h-3" />
                              <span>Latih Lagi</span>
                            </>
                          ) : (
                            <>
                              <span>Evaluasi</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
