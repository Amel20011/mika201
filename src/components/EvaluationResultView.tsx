import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ListOrdered,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const EvaluationResultView: React.FC = () => {
  const {
    lastEvaluation,
    subjects,
    openMaterial,
    startQuiz,
    selectChapter,
    selectSubject,
    setActiveView,
    isAllChaptersPassed,
  } = useApp();

  if (!lastEvaluation) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <h3 className="text-lg font-bold text-slate-800">Tidak Ada Hasil Evaluasi</h3>
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const { subjectId, chapterNumber, score, correct, incorrect, totalQuestions, passed: isPassed } = lastEvaluation;

  const currentSubject = subjects.find((s) => s.id === subjectId);
  const nextChapterNumber = chapterNumber + 1;
  const hasNextChapter = nextChapterNumber <= 8;

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm text-center space-y-6">
        {/* Status Badge & Icon */}
        <div className="space-y-3">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-inner ${
              isPassed
                ? 'bg-emerald-50 border-2 border-emerald-200 text-emerald-600'
                : 'bg-amber-50 border-2 border-amber-200 text-amber-600'
            }`}
          >
            {isPassed ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>

          <div className="space-y-1">
            <span
              className={`inline-flex items-center gap-1 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${
                isPassed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isPassed ? 'Lulus Evaluasi Bab' : 'Belum Memenuhi Target'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isPassed ? 'Kerja Luar Biasa!' : 'Tetap Semangat!'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Hasil Evaluasi {currentSubject?.name} • Bab {chapterNumber}
            </p>
          </div>
        </div>

        {/* Big Score Percentage Display */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Skor Pencapaian
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={`text-6xl sm:text-7xl font-black tracking-tight ${
                isPassed ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {score}%
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-600">
            {isPassed
              ? 'Selamat! Nilai kamu melampaui batas minimal kelulusan 80%.'
              : 'Nilai minimal kelulusan adalah 80%. Kamu perlu mengulang bab ini agar dapat melanjutkan atau membuka reward.'}
          </p>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Benar</span>
            <span className="text-2xl font-black text-emerald-600">{correct}</span>
            <span className="text-[10px] font-semibold text-slate-400 block">soal</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Salah</span>
            <span className="text-2xl font-black text-rose-600">{incorrect}</span>
            <span className="text-[10px] font-semibold text-slate-400 block">soal</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Total</span>
            <span className="text-2xl font-black text-slate-800">{totalQuestions}</span>
            <span className="text-[10px] font-semibold text-slate-400 block">soal</span>
          </div>
        </div>

        {/* Action Buttons based on Pass / Fail */}
        <div className="space-y-3 pt-2">
          {isPassed ? (
            <>
              {hasNextChapter && (
                <button
                  onClick={() => selectChapter(subjectId, nextChapterNumber)}
                  id="eval-next-chapter-btn"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-md transition active:scale-98"
                >
                  <span>Lanjut ke Bab {nextChapterNumber}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              {isAllChaptersPassed && (
                <button
                  onClick={() => setActiveView('rewards')}
                  id="eval-view-reward-btn"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition"
                >
                  <Award className="w-5 h-5" />
                  <span>Klaim Sertifikat & Reward Kamu</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openMaterial(subjectId, chapterNumber)}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Lihat Pembahasan</span>
                </button>
                <button
                  onClick={() => selectSubject(subjectId)}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <ListOrdered className="w-4 h-4" />
                  <span>Daftar Bab</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  const ok = startQuiz(subjectId, chapterNumber);
                  if (!ok) {
                    alert('Nyawa kamu habis (0/5). Tunggu regenerasi 1 menit per nyawa atau isi ulang nyawa.');
                  }
                }}
                id="eval-retry-quiz-btn"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-md transition active:scale-98"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Ulangi Latihan Soal</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openMaterial(subjectId, chapterNumber)}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Pelajari Materi Lagi</span>
                </button>

                <button
                  onClick={() => selectSubject(subjectId)}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <ListOrdered className="w-4 h-4" />
                  <span>Kembali ke Bab</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
