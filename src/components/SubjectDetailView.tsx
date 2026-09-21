import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const SubjectDetailView: React.FC = () => {
  const {
    subjects,
    selectedSubjectId,
    selectChapter,
    openMaterial,
    setActiveView,
    isChapterUnlocked,
    user,
  } = useApp();

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  if (!currentSubject) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-xl mx-auto my-12">
        <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Mata Pelajaran Tidak Ditemukan</h3>
        <button
          onClick={() => setActiveView('subjects')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  const passedCount = currentSubject.chapters.filter((c) => c.status === 'Lulus' && c.score >= 80).length;
  const isSubjectFullyMastered = passedCount === currentSubject.chapters.length;

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveView('subjects')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Mata Pelajaran</span>
        </button>
      </div>

      {/* Subject Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {currentSubject.category}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Jenjang {currentSubject.level}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentSubject.name}
              </h1>
              <p className="text-sm text-slate-600 font-medium max-w-2xl">
                {currentSubject.description}
              </p>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Ketuntasan 8 Bab
            </span>
            <span className="text-3xl font-black text-indigo-600">
              {passedCount} <span className="text-base text-slate-400 font-semibold">/ 8</span>
            </span>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              {isSubjectFullyMastered ? 'Seluruh Bab Tuntas &ge; 80%' : 'Luluskan semua bab untuk reward'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Kemajuan Silabus Mata Pelajaran</span>
            <span>{Math.round((passedCount / 8) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(passedCount / 8) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chapters 1 to 8 List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Daftar Bab Pembelajaran
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Wajib tersedia 8 bab lengkap dengan materi dan evaluasi interaktif
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {currentSubject.chapters.map((ch) => {
            const unlocked = isChapterUnlocked(currentSubject.id, ch.chapterNumber);
            const isPassed = ch.score >= 80 && ch.status === 'Lulus';
            const isUnderTarget = ch.score > 0 && ch.score < 80;

            return (
              <div
                key={ch.id}
                id={`subject-chapter-item-${ch.id}`}
                onClick={() => {
                  if (unlocked) {
                    selectChapter(currentSubject.id, ch.chapterNumber);
                  }
                }}
                className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !unlocked
                    ? 'bg-slate-50/70 border-slate-200 opacity-60 cursor-not-allowed'
                    : isPassed
                    ? 'bg-white border-emerald-200 hover:border-emerald-300 hover:shadow-sm cursor-pointer'
                    : isUnderTarget
                    ? 'bg-white border-amber-200 hover:border-amber-300 hover:shadow-sm cursor-pointer'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-sm ${
                      isPassed
                        ? 'bg-emerald-100 text-emerald-800'
                        : isUnderTarget
                        ? 'bg-amber-100 text-amber-800'
                        : !unlocked
                        ? 'bg-slate-200 text-slate-500'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {!unlocked ? <Lock className="w-5 h-5" /> : `BAB ${ch.chapterNumber}`}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Bab {ch.chapterNumber} dari 8
                      </span>

                      {/* Status */}
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
                          <span>Selesaikan Bab {ch.chapterNumber - 1} Dahulu</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                          Belum Dikerjakan
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium max-w-xl">
                      {ch.description}
                    </p>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] font-bold text-slate-400 block">Skor Bab</span>
                    <span className={`text-lg font-black ${isPassed ? 'text-emerald-700' : isUnderTarget ? 'text-amber-700' : 'text-slate-600'}`}>
                      {ch.score}%
                    </span>
                  </div>

                  {unlocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMaterial(currentSubject.id, ch.chapterNumber);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                    >
                      <span>{ch.completed ? 'Pelajari Ulang' : 'Buka Bab'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
