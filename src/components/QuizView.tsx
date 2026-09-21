import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
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

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerSubmitted) return;
    setSelectedOption(key);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
      decrementLife();
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz Finished! Submit results
      sessionStorage.removeItem(sessionKey);
      submitQuizResult(
        currentSubject.id,
        currentChapter.chapterNumber,
        correctCount + (selectedOption === currentQ.correctAnswer ? 1 : 0),
        incorrectCount + (selectedOption !== currentQ.correctAnswer ? 1 : 0),
        questions.length
      );
    }
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-3xl mx-auto">
      {/* Quiz Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Keluar dari latihan? Progres sesi ini dapat disimpan di peramban.')) {
                  setActiveView('chapter-detail');
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 transition"
              title="Keluar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold text-slate-500 block">
                {currentSubject.name} • Bab {currentChapter.chapterNumber}
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                {currentChapter.title}
              </h2>
            </div>
          </div>

          {/* Real-time Lives Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 shrink-0">
            <div className="flex items-center gap-0.5">
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
            <span className="text-xs font-black text-rose-900 ml-1">{user.lives}/5</span>
          </div>
        </div>

        {/* Progress Bar & Question Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Soal {currentQuestionIndex + 1} dari {questions.length}</span>
            <span>{progressPercent}%</span>
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
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-black tracking-wider uppercase text-indigo-600">
            Pertanyaan {currentQuestionIndex + 1}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* Options List (Large touch-friendly buttons) */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            const isCorrectAnswer = opt.key === currentQ.correctAnswer;

            let buttonStyle = 'border-slate-200 hover:border-indigo-300 bg-white text-slate-800';
            let badgeStyle = 'border-slate-300 text-slate-600 bg-slate-50';

            if (isSelected && !isAnswerSubmitted) {
              buttonStyle = 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20 text-indigo-950 font-bold';
              badgeStyle = 'border-indigo-600 bg-indigo-600 text-white';
            }

            if (isAnswerSubmitted) {
              if (isCorrectAnswer) {
                buttonStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
                badgeStyle = 'border-emerald-600 bg-emerald-600 text-white';
              } else if (isSelected && !isCorrectAnswer) {
                buttonStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 font-bold';
                badgeStyle = 'border-rose-600 bg-rose-600 text-white';
              } else {
                buttonStyle = 'border-slate-200 opacity-60 text-slate-500';
              }
            }

            return (
              <button
                key={opt.key}
                type="button"
                id={`quiz-opt-${opt.key}`}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(opt.key)}
                className={`w-full p-4 sm:p-4.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-4 cursor-pointer active:scale-99 ${buttonStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center font-extrabold text-xs shrink-0 ${badgeStyle}`}>
                    {opt.key}
                  </span>
                  <span className="text-sm sm:text-base">{opt.text}</span>
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
            className={`p-4 sm:p-5 rounded-2xl border space-y-2 animate-fadeIn ${
              selectedOption === currentQ.correctAnswer
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedOption === currentQ.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Jawaban Tepat! (+15 Poin)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Jawaban Kurang Tepat (-1 Nyawa)</span>
                </>
              )}
            </div>
            <div className="text-xs sm:text-sm font-medium leading-relaxed pt-1 border-t border-black/5">
              <strong className="block text-[11px] uppercase tracking-wider mb-0.5">
                Pembahasan Jawaban:
              </strong>
              {currentQ.explanation}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleConfirmAnswer}
              id="quiz-submit-answer-btn"
              disabled={!selectedOption}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-md transition"
            >
              Periksa Jawaban
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              id="quiz-next-question-btn"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm sm:text-base shadow-md transition"
            >
              <span>{currentQuestionIndex + 1 < questions.length ? 'Soal Berikutnya' : 'Lihat Hasil Evaluasi'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
