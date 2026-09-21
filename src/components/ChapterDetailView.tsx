import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Play,
  Award,
  Sparkles,
  ChevronRight,
  Clock,
  Target,
} from 'lucide-react';

export const ChapterDetailView: React.FC = () => {
  const {
    subjects,
    selectedSubjectId,
    selectedChapterNumber,
    openMaterial,
    startQuiz,
    setActiveView,
    user,
  } = useApp();

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentChapter = currentSubject?.chapters.find(
    (c) => c.chapterNumber === selectedChapterNumber
  );

  if (!currentSubject || !currentChapter) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <h3 className="text-lg font-bold text-slate-800">Bab Tidak Ditemukan</h3>
        <button
          onClick={() => setActiveView('subjects')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Kembali
        </button>
      </div>
    );
  }

  const isPassed = currentChapter.score >= 80 && currentChapter.status === 'Lulus';
  const isUnderTarget = currentChapter.score > 0 && currentChapter.score < 80;

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveView('subject-detail')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke {currentSubject.name}</span>
        </button>
      </div>

      {/* Main Chapter Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                BAB {currentChapter.chapterNumber} DARI 8
              </span>
              <span className="text-xs font-bold text-slate-400">
                {currentSubject.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentChapter.title}
            </h1>
            <p className="text-sm text-slate-600 font-medium max-w-xl">
              {currentChapter.description}
            </p>
          </div>

          {/* Current Score Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 sm:text-right shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Skor Terbaik Bab
            </span>
            <div className="flex items-baseline sm:justify-end gap-1">
              <span className={`text-3xl font-black ${isPassed ? 'text-emerald-700' : isUnderTarget ? 'text-amber-700' : 'text-slate-700'}`}>
                {currentChapter.score}%
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                isPassed
                  ? 'bg-emerald-100 text-emerald-800'
                  : isUnderTarget
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isPassed ? <CheckCircle2 className="w-3 h-3" /> : isUnderTarget ? <AlertCircle className="w-3 h-3" /> : null}
              <span>{isPassed ? 'Lulus (&ge; 80%)' : isUnderTarget ? 'Belum Lulus (< 80%)' : 'Belum Dikerjakan'}</span>
            </span>
          </div>
        </div>

        {/* Requirements & Target Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3.5">
          <Target className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 space-y-1">
            <p className="font-bold text-indigo-900">
              Standar Evaluasi Kelulusan Bab: Minimal 80%
            </p>
            <p className="text-indigo-800 leading-relaxed font-normal">
              Untuk dinyatakan lulus pada bab ini, kamu harus mencapai minimal nilai 80% pada lembar latihan soal.
              Setiap jawaban salah akan mengurangi 1 dari 5 nyawa kamu.
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Read Material Button */}
          <button
            onClick={() => openMaterial(currentSubject.id, currentChapter.chapterNumber)}
            id="chapter-open-material-btn"
            className="p-5 rounded-2xl border-2 border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50/50 bg-white text-left transition flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition">
                  Pelajari Materi
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Konsep, contoh soal, dan ringkasan
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition" />
          </button>

          {/* Start Quiz Button */}
          <button
            onClick={() => {
              const started = startQuiz(currentSubject.id, currentChapter.chapterNumber);
              if (!started) {
                alert('Nyawa kamu saat ini habis (0/5). Silakan tunggu regenerasi (1 nyawa per menit) atau isi ulang nyawa di pojok atas.');
              }
            }}
            id="chapter-start-quiz-btn"
            className="p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-left transition flex items-center justify-between shadow-md shadow-indigo-600/20 active:scale-98"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center">
                <Play className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">
                  Mulai Latihan Soal
                </h4>
                <p className="text-xs text-indigo-100 font-medium">
                  Uji pemahaman dan raih nilai &ge; 80%
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
