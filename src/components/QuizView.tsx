import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audio';
import {
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';

export const QuizView: React.FC = () => {
  const {
    subjects,
    selectedSubjectId,
    selectedChapterNumber,
    user,
    decrementLife,
    refillLives,
    submitQuizResult,
    setActiveView,
    secondsUntilNextLife,
  } = useApp();

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentChapter = currentSubject?.chapters.find(
    (c) => c.chapterNumber === selectedChapterNumber
  );

  const questions = currentChapter?.questions || [];

  // Local quiz session state (saved in sessionStorage for anti-cheat and page refresh persistence)
  const sessionKey = `quiz_progress_${selectedSubjectId}_${selectedChapterNumber}`;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.currentIndex || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });

  const [correctCount, setCorrectCount] = useState<number>(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        return JSON.parse(saved).correctCount || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });

  const [incorrectCount, setIncorrectCount] = useState<number>(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        return JSON.parse(saved).incorrectCount || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });

  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());

  // Keep session state synced to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(
      sessionKey,
      JSON.stringify({
        currentIndex: currentQuestionIndex,
        correctCount,
        incorrectCount,
        startedAt: startTime,
      })
    );
  }, [currentQuestionIndex, correctCount, incorrectCount, sessionKey, startTime]);

  if (!currentSubject || !currentChapter || questions.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <h3 className="text-lg font-bold text-slate-800">Soal Belum Tersedia</h3>
        <button
          onClick={() => setActiveView('subject-detail')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Kembali
        </button>
      </div>
    );
  }

  // Check 0 Lives condition
  if (user.lives <= 0) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 text-center space-y-6 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
          <Heart className="w-8 h-8 fill-rose-600 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800">
            Nyawa Habis (0/5)
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kamu Memerlukan Nyawa untuk Melanjutkan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Setiap jawaban salah mengurangi 1 nyawa. Sistem meregenerasi 1 nyawa setiap 1 menit secara terukur.
          </p>
        </div>

        {/* Realtime Countdown */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-slate-700">
          <Clock className="w-4 h-4 text-indigo-600 animate-spin" />
          <span className="text-sm font-bold">
            Nyawa berikutnya dalam: {Math.floor(secondsUntilNextLife / 60)}:
            {secondsUntilNextLife % 60 < 10 ? '0' : ''}
            {secondsUntilNextLife % 60}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={refillLives}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Isi Ulang Nyawa Sekarang (Demo)</span>
          </button>

          <button
            onClick={() => setActiveView('subject-detail')}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
          >
            Kembali ke Halaman Bab
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  // Auto-advance timer ref
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerSubmitted) return;
    setSelectedOption(key);
    setIsAnswerSubmitted(true);

    const isCorrect = key === currentQ.correctAnswer;
    const newCorrect = correctCount + (isCorrect ? 1 : 0);
    const newIncorrect = incorrectCount + (!isCorrect ? 1 : 0);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      // Mainkan sound jawaban benar (khusus jawaban benar)
      soundManager.playCorrect();
    } else {
      setIncorrectCount((prev) => prev + 1);
      decrementLife();
      // Tanpa suara untuk jawaban salah sesuai instruksi user
    }

    // Otomatis lanjut ke soal selanjutnya tanpa tombol "Lanjutkan"
    autoAdvanceTimerRef.current = setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Kuis Selesai! Submit hasil otomatis
        sessionStorage.removeItem(sessionKey);
        submitQuizResult(
          currentSubject.id,
          currentChapter.chapterNumber,
          newCorrect,
          newIncorrect,
          questions.length
        );
      }
    }, 1300);
  };

  return (
    <div className="space-y-5 pb-24 lg:pb-12 max-w-3xl mx-auto select-none">
      {/* Quiz Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => {
                if (confirm('Keluar dari latihan? Progres sesi ini dapat disimpan di peramban.')) {
                  setActiveView('chapter-detail');
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 transition shrink-0"
              title="Keluar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-500 block truncate">
                {currentSubject.name} • Bab {currentChapter.chapterNumber}
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                {currentChapter.title}
              </h2>
            </div>
          </div>

          {/* Real-time Lives Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 shrink-0">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse sm:hidden" />
            <div className="hidden sm:flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((idx) => (
                <Heart
                  key={idx}
                  className={`w-4 h-4 transition ${
                    idx <= user.lives
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-slate-300 fill-slate-200 scale-90'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black text-rose-900 ml-0.5">{user.lives}/5</span>
          </div>
        </div>

        {/* Progress Bar & Question Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Soal {currentQuestionIndex + 1} dari {questions.length}</span>
            <span className="text-indigo-600 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-indigo-600">
              Pertanyaan {currentQuestionIndex + 1}
            </span>
            {isAnswerSubmitted && (
              <span className="text-[11px] font-bold text-indigo-600 animate-pulse flex items-center gap-1">
                <span>Lanjut otomatis...</span>
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* Options List (Klik langsung evaluasi & otomatis lanjut) */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            const isCorrectAnswer = opt.key === currentQ.correctAnswer;

            let buttonStyle = 'border-slate-200 hover:border-indigo-400 bg-white text-slate-800 active:bg-slate-50';
            let badgeStyle = 'border-slate-300 text-slate-600 bg-slate-50';

            if (isAnswerSubmitted) {
              if (isCorrectAnswer) {
                buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                badgeStyle = 'border-emerald-600 bg-emerald-600 text-white';
              } else if (isSelected && !isCorrectAnswer) {
                buttonStyle = 'border-rose-400 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-500/20';
                badgeStyle = 'border-rose-600 bg-rose-600 text-white';
              } else {
                buttonStyle = 'border-slate-200 opacity-50 text-slate-400 pointer-events-none';
              }
            }

            return (
              <button
                key={opt.key}
                type="button"
                id={`quiz-opt-${opt.key}`}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(opt.key)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3.5 cursor-pointer active:scale-99 ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center font-extrabold text-xs shrink-0 ${badgeStyle}`}>
                    {opt.key}
                  </span>
                  <span className="text-sm sm:text-base leading-snug">{opt.text}</span>
                </div>

                {isAnswerSubmitted && isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation Box */}
        {isAnswerSubmitted && (
          <div
            className={`p-4 rounded-2xl border space-y-2 animate-in fade-in duration-200 ${
              selectedOption === currentQ.correctAnswer
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/90 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                {selectedOption === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Jawaban Benar! (+15 Poin)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Jawaban Salah (-1 Nyawa)</span>
                  </>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {currentQuestionIndex + 1 < questions.length ? 'Memuat soal berikutnya...' : 'Menghitung hasil...'}
              </span>
            </div>
            <div className="text-xs sm:text-sm leading-relaxed pt-1.5 border-t border-black/5">
              <strong className="block text-[10px] uppercase tracking-wider mb-0.5 text-slate-600">
                Pembahasan Jawaban:
              </strong>
              {currentQ.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
