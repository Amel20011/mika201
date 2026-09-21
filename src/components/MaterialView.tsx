import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  BookOpen,
  Play,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  FileText,
  ListOrdered,
  ChevronRight,
} from 'lucide-react';

export const MaterialView: React.FC = () => {
  const {
    subjects,
    selectedSubjectId,
    selectedChapterNumber,
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
        <h3 className="text-lg font-bold text-slate-800">Materi Tidak Ditemukan</h3>
        <button
          onClick={() => setActiveView('subjects')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Kembali
        </button>
      </div>
    );
  }

  const { material } = currentChapter;

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-4xl mx-auto">
      {/* Top Breadcrumbs & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('chapter-detail')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Bab</span>
        </button>

        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
          {currentSubject.name} • Bab {currentChapter.chapterNumber}
        </span>
      </div>

      {/* Material Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
            Materi Pembelajaran — BAB {currentChapter.chapterNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {currentChapter.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed pt-1">
            {material.introduction}
          </p>
        </div>

        {/* Progress reminder */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Skor saat ini: <strong className="text-slate-800">{currentChapter.score}%</strong></span>
          <span>Target kelulusan: <strong className="text-emerald-700">&ge; 80%</strong></span>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {material.sections.map((sec, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                {idx + 1}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {sec.heading}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pl-10">
              {sec.content}
            </p>

            {sec.formulaOrNote && (
              <div className="ml-10 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 text-xs sm:text-sm font-semibold text-indigo-950 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-indigo-900 text-[11px] uppercase tracking-wider mb-0.5">
                    Catatan Konsep Kunci
                  </span>
                  <span>{sec.formulaOrNote}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Examples Section */}
        {material.examples && material.examples.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Contoh Soal & Pembahasan Kontekstual
              </h2>
            </div>

            {material.examples.map((ex, exIdx) => (
              <div key={exIdx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  <span className="text-indigo-600 font-extrabold mr-1.5">Contoh {exIdx + 1}:</span>
                  {ex.question}
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
                  <span className="font-bold text-emerald-700 block text-[11px] uppercase tracking-wider">
                    Langkah Penyelesaian
                  </span>
                  <p>{ex.solution}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Section */}
        {material.summary && material.summary.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Ringkasan Bab
              </h2>
            </div>

            <ul className="space-y-2.5 pl-4">
              {material.summary.map((sumItem, sumIdx) => (
                <li key={sumIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{sumItem}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom CTA: Mulai Latihan */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold tracking-tight">
            Sudah Paham Materinya?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Uji pemahamanmu sekarang pada latihan soal BAB {currentChapter.chapterNumber}. Target kelulusan minimal 80%.
          </p>
        </div>

        <button
          onClick={() => {
            const started = startQuiz(currentSubject.id, currentChapter.chapterNumber);
            if (!started) {
              alert('Nyawa kamu habis (0/5). Tunggu regenerasi 1 menit per nyawa atau isi penuh di pojok kanan atas.');
            }
          }}
          id="material-start-quiz-cta"
          className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg transition active:scale-98 shrink-0"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Mulai Latihan Soal</span>
        </button>
      </div>
    </div>
  );
};
