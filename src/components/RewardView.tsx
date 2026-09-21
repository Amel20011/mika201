import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Lock,
  Download,
  Share2,
  Sparkles,
  GraduationCap,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Printer,
} from 'lucide-react';

export const RewardView: React.FC = () => {
  const {
    user,
    userSubjects,
    badges,
    isAllChaptersPassed,
    passedChaptersCount,
    totalChaptersCount,
    overallAverageScore,
    selectChapter,
  } = useApp();

  const certificateRef = useRef<HTMLDivElement>(null);

  // Determine predicate based on overall score
  const getPredicate = (avg: number) => {
    if (avg >= 95) return 'Dengan Pujian Tertinggi (Summa Cum Laude)';
    if (avg >= 90) return 'Dengan Pujian (Magna Cum Laude)';
    if (avg >= 85) return 'Sangat Memuaskan';
    return 'Memuaskan';
  };

  const predicate = getPredicate(overallAverageScore);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sertifikat & Penghargaan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Bukti kompetensi resmi akademik berstandar kelulusan 80%
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border self-start sm:self-auto bg-slate-50 border-slate-200">
          <Award className={`w-4 h-4 ${isAllChaptersPassed ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className={isAllChaptersPassed ? 'text-emerald-700' : 'text-slate-600'}>
            Status: {isAllChaptersPassed ? 'Reward Terbuka' : 'Masih Terkunci'}
          </span>
        </div>
      </div>

      {/* REWARD TERBUKA: CELEBRATION & CERTIFICATE */}
      {isAllChaptersPassed ? (
        <div className="space-y-8">
          {/* Unlocked Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 border border-emerald-500/30 text-white space-y-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Selamat! Semua Bab Telah Tuntas
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Kompetensi Paripurna Diraih!
                </h2>
                <p className="text-sm text-emerald-100/80 max-w-2xl font-normal leading-relaxed">
                  Kamu telah berhasil menyelesaikan seluruh 8 bab pembelajaran dengan nilai minimal 80%.
                  Sertifikat kelulusan resmi di bawah ini telah diterbitkan dengan nomor verifikasi unik.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                id="reward-print-btn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md transition"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>

          {/* OFFICIAL CERTIFICATE COMPONENT */}
          <div
            ref={certificateRef}
            id="official-certificate"
            className="bg-white border-8 border-slate-900 p-8 sm:p-14 rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-8 print:p-8 print:border-4"
          >
            {/* Background Guilloche Watermark Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <GraduationCap className="w-96 h-96 text-slate-900" />
            </div>

            {/* Certificate Top Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-wider uppercase">
                  AURELIA EDU
                </span>
              </div>
              <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                Lembaga Edukasi & Sertifikasi Digital Terpadu
              </p>
              <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full mt-2" />
            </div>

            {/* Certificate Title */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-wide">
                SERTIFIKAT KELULUSAN
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Nomor Sertifikat: AE-2026-{user.id.slice(-6).toUpperCase()}-VERIFIED
              </p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 max-w-2xl mx-auto text-slate-700 leading-relaxed">
              <p className="text-sm font-medium">Diberikan dengan bangga kepada:</p>
              <div className="border-b-2 border-slate-800 pb-2 inline-block px-12">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {user.name}
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Institusi: <strong className="text-slate-800">{user.school}</strong> • Jenjang: <strong className="text-slate-800">{user.educationLevel}</strong>
              </p>
              <p className="text-xs sm:text-sm font-normal text-slate-600 pt-2">
                Telah berhasil menyelesaikan seluruh silabus 8 Bab Pembelajaran secara komprehensif
                dengan rata-rata nilai akhir <strong className="text-indigo-600">{overallAverageScore}%</strong> dan memenuhi standar kelulusan minimal 80% pada setiap bab.
              </p>
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800">
                Predikat: {predicate}
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-8 grid grid-cols-2 gap-8 max-w-xl mx-auto border-t border-slate-200">
              <div className="space-y-1 text-center">
                <div className="h-12 flex items-end justify-center">
                  <span className="font-serif italic font-bold text-slate-700 text-lg">
                    Aurel S.Pd., M.Ed.
                  </span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-xs font-bold text-slate-800">Direktur Akademik</p>
                  <p className="text-[10px] text-slate-400">Aurelia Edu Indonesia</p>
                </div>
              </div>

              <div className="space-y-1 text-center">
                <div className="h-12 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-indigo-600 flex items-center justify-center text-indigo-700 text-[10px] font-bold">
                    VERIFIED
                  </div>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-xs font-bold text-slate-800">Tanggal Terbit</p>
                  <p className="text-[10px] text-slate-400">21 September 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* REWARD MASIH TERKUNCI: STRICT REQUIREMENTS VIEW */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Status: Masih Terkunci
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Selesaikan Seluruh Bab dengan Nilai Minimal 80%
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Sertifikat dan badge penghargaan resmi hanya dapat dibuka setelah kamu menyelesaikan semua bab dengan skor minimal 80%.
                  Perbaiki bab yang belum mencapai target kelulusan di bawah ini.
                </p>
              </div>
            </div>

            {/* Progress Bar towards Unlock */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Kelulusan Bab ({passedChaptersCount} dari {totalChaptersCount} Bab Lulus)</span>
                <span>{Math.round((passedChaptersCount / (totalChaptersCount || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(passedChaptersCount / (totalChaptersCount || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Per-Chapter Status Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Checklist Status Setiap Bab
            </h3>

            <div className="space-y-4">
              {userSubjects.map((sub) => (
                <div key={sub.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-sm text-slate-900">{sub.name}</h4>
                    <span className="text-xs font-semibold text-slate-500">
                      {sub.chapters.filter((c) => c.status === 'Lulus' && c.score >= 80).length} / 8 Lulus
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sub.chapters.map((ch) => {
                      const isPassed = ch.score >= 80 && ch.status === 'Lulus';
                      const isFailed = ch.score > 0 && ch.score < 80;

                      return (
                        <div
                          key={ch.id}
                          onClick={() => selectChapter(sub.id, ch.chapterNumber)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                            isPassed
                              ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100/50'
                              : isFailed
                              ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/70'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isPassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isFailed ? (
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                Bab {ch.chapterNumber}: {ch.title}
                              </p>
                              <p className="text-[10px] text-slate-500 font-medium">
                                {isPassed
                                  ? `Lulus (${ch.score}%)`
                                  : isFailed
                                  ? `Skor ${ch.score}% — Perlu diperbaiki`
                                  : 'Belum dikerjakan'}
                              </p>
                            </div>
                          </div>

                          <span className={`text-xs font-black shrink-0 ${isPassed ? 'text-emerald-700' : isFailed ? 'text-amber-700' : 'text-slate-400'}`}>
                            {ch.score}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Badges Collection Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
          Koleksi Lencana Keahlian
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition ${
                badge.isUnlocked
                  ? 'bg-indigo-50/40 border-indigo-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
                  badge.isUnlocked
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">{badge.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium">{badge.description}</p>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  badge.isUnlocked
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {badge.isUnlocked ? 'Terbuka' : 'Terkunci'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
