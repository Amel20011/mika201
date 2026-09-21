import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audio';
import {
  X,
  Check,
  Loader2,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  XCircle,
  BookOpen,
  Award,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

interface ScoreAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoreAuditModal: React.FC<ScoreAuditModalProps> = ({ isOpen, onClose }) => {
  const { user, userSubjects, history, passedChaptersCount, totalChaptersCount, overallAverageScore, selectChapter } = useApp();

  // 6 Tahap pemeriksaan sesuai permintaan spesifik pengguna
  const auditSteps = [
    { id: 1, text: 'Mengecek skor kamu', detail: 'Mengakses basis data skor perolehan mandiri' },
    { id: 2, text: 'Mengecek semua riwayat kamu', detail: 'Membaca seluruh jejak rekor pengerjaan kuis' },
    { id: 3, text: 'Mengecek status terakhir bab', detail: 'Verifikasi kelulusan Bab 1 hingga Bab 8' },
    { id: 4, text: 'Mengecek kesalahan soal masing-masing bab', detail: 'Audit opsi jawaban tidak tepat pada evaluasi' },
    { id: 5, text: 'Mengecek kebenaran semua', detail: 'Validasi jawaban benar & pemahaman konsep' },
    { id: 6, text: 'Mengevaluasi nilai yang sebenarnya', detail: 'Kalkulasi presisi standar kelulusan 80%' },
  ];

  // State untuk proses tahapan pemeriksaan
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(true);

  // State untuk animasi angka besar (0% sampai nilai target)
  const [displayPercentage, setDisplayPercentage] = useState<number>(0);
  const [displayPoints, setDisplayPoints] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // Perhitungan data bab & poin
  const auditData = useMemo(() => {
    // Kumpulkan seluruh bab dari semua mata pelajaran pengguna
    const allChaptersList: Array<{
      subjectName: string;
      subjectId: string;
      chapterNumber: number;
      title: string;
      score: number;
      completed: boolean;
      status: 'Lulus' | 'Belum Lulus' | 'Belum Dikerjakan';
      correctCount: number;
      incorrectCount: number;
      totalQuestions: number;
      pointsEarned: number;
    }> = [];

    userSubjects.forEach((subject) => {
      subject.chapters.forEach((chapter) => {
        // Cari riwayat kuis untuk bab ini
        const chapterHistory = history.filter(
          (h) => h.subjectId === subject.id && h.chapterNumber === chapter.chapterNumber
        );

        let correct = 0;
        let incorrect = 0;
        let totalQ = chapter.questions?.length || 5;

        if (chapterHistory.length > 0) {
          const bestAttempt = chapterHistory.reduce((max, h) => (h.score > max.score ? h : max), chapterHistory[0]);
          correct = bestAttempt.correct;
          incorrect = bestAttempt.incorrect;
          totalQ = bestAttempt.totalQuestions;
        } else if (chapter.completed) {
          correct = Math.round((chapter.score / 100) * totalQ);
          incorrect = totalQ - correct;
        }

        // Poin bab: 100 poin jika lulus (>=80%), ditambah skor proporsional
        const isPassed = chapter.score >= 80;
        const pts = chapter.completed ? (isPassed ? 100 : Math.round(chapter.score * 0.5)) : 0;

        allChaptersList.push({
          subjectName: subject.name,
          subjectId: subject.id,
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          score: chapter.score || 0,
          completed: chapter.completed || chapter.score > 0,
          status: chapter.status,
          correctCount: correct,
          incorrectCount: incorrect,
          totalQuestions: totalQ,
          pointsEarned: pts,
        });
      });
    });

    // Total target skor persentase (rata-rata atau kelulusan)
    const targetPercent = overallAverageScore > 0 ? overallAverageScore : (passedChaptersCount > 0 ? Math.round((passedChaptersCount / (totalChaptersCount || 8)) * 100) : 0);
    const targetPoints = user.points;

    return {
      chapters: allChaptersList,
      targetPercent,
      targetPoints,
    };
  }, [userSubjects, history, overallAverageScore, passedChaptersCount, totalChaptersCount, user.points]);

  // Audio ticker ref
  const audioIntervalRef = useRef<number | null>(null);

  // Jalankan alur pemeriksaan sekuensial saat modal dibuka
  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      setIsEvaluating(true);
      setDisplayPercentage(0);
      setDisplayPoints(0);
      setShowSummary(false);
      return;
    }

    // Reset state saat baru dibuka
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setIsEvaluating(true);
    setDisplayPercentage(0);
    setDisplayPoints(0);
    setShowSummary(false);

    let step = 0;
    const stepInterval = setInterval(() => {
      if (step < auditSteps.length) {
        soundManager.playStepPing(step);
        setCompletedSteps((prev) => [...prev, auditSteps[step].id]);
        step++;
        setCurrentStepIndex(step);
      } else {
        clearInterval(stepInterval);
        setIsEvaluating(false);

        // Mulai animasi angka besar berputar cepat dari 0% ke target
        startNumberAnimation(auditData.targetPercent, auditData.targetPoints);
      }
    }, 520); // waktu tiap langkah verifikasi lingkaran kecil

    return () => {
      clearInterval(stepInterval);
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, [isOpen]);

  // Animasi angka besar cepat dari 0 sampai nilai target dengan efek audio ticker
  const startNumberAnimation = (targetScore: number, targetPts: number) => {
    const finalScore = Math.max(0, Math.min(100, targetScore));
    const finalPoints = Math.max(0, targetPts);

    const duration = 1400; // ms
    const startTime = performance.now();
    let lastAudioTick = 0;

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const currentScore = Math.round(ease * finalScore);
      const currentPts = Math.round(ease * finalPoints);

      setDisplayPercentage(currentScore);
      setDisplayPoints(currentPts);

      // Mainkan suara ticker angka setiap beberapa ms
      if (now - lastAudioTick > 45 && progress < 0.95) {
        soundManager.playCounterTick(1 + progress * 0.5);
        lastAudioTick = now;
      }

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        setDisplayPercentage(finalScore);
        setDisplayPoints(finalPoints);
        soundManager.playSuccessChime();
        setShowSummary(true);
      }
    };

    requestAnimationFrame(animateFrame);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div
        id="score-audit-modal-content"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Pemeriksaan Skor & Poin Belajar
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Audit verifikasi otomatis capaian seluruh bab
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            id="close-score-audit-modal-btn"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="Tutup pemeriksaan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Bagian 1: 6 Tahapan Lingkaran Pemeriksaan Berurutan */}
          <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status Verifikasi Sistem
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {isEvaluating
                  ? `Memeriksa ${completedSteps.length}/${auditSteps.length}`
                  : 'Terverifikasi Lengkap'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {auditSteps.map((step, idx) => {
                const isDone = completedSteps.includes(step.id);
                const isActive = currentStepIndex === idx && !isDone;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-white border-emerald-200 text-slate-900 shadow-xs'
                        : isActive
                        ? 'bg-white border-indigo-300 ring-2 ring-indigo-500/10 text-slate-900'
                        : 'bg-slate-100/60 border-slate-200/60 text-slate-400'
                    }`}
                  >
                    {/* Lingkaran kecil status */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isActive
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isActive ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span className="text-[10px] font-bold">{step.id}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate">{step.text}</p>
                      <p className="text-[10px] text-slate-500 truncate">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bagian 2: Lingkaran Besar Angka 0% sampai Nilai Sebenarnya + Audio Effect */}
          <div className="text-center py-4 px-2">
            <div className="relative inline-flex items-center justify-center">
              {/* Lingkaran Besar dengan Aksen Gradasi & Efek Glow */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-1.5 shadow-xl shadow-indigo-600/25">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-3">
                  <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Nilai Evaluasi
                  </span>
                  {/* Angka Besar berputar cepat */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 my-0.5">
                    {displayPercentage}
                    <span className="text-xl sm:text-2xl font-bold text-indigo-600">%</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {displayPercentage >= 80 ? 'Memenuhi Standar' : 'Belum Mencapai 80%'}
                  </span>
                </div>
              </div>

              {/* Badges Poin di samping lingkaran */}
              <div className="absolute -bottom-2 sm:-bottom-3 bg-amber-500 text-white px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{displayPoints} Poin Terakumulasi</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-5 max-w-md mx-auto">
              Total capaian dihitung berdasarkan kelulusan minimum 80% tiap bab, kebenaran jawaban evaluasi, serta rekor belajar mandiri Anda.
            </p>
          </div>

          {/* Bagian 3: Rangkuman Semua Bab yang Telah Dikerjakan */}
          {showSummary && (
            <div className="space-y-3 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Rangkuman Bab & Kesalahan Soal
                  </h4>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {passedChaptersCount} dari {totalChaptersCount} Bab Lulus (&ge; 80%)
                </span>
              </div>

              {/* Daftar Bab Terperinci */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {auditData.chapters.map((ch) => {
                  const isPassed = ch.score >= 80;
                  return (
                    <div
                      key={`${ch.subjectId}-${ch.chapterNumber}`}
                      className="p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 transition flex items-center justify-between gap-3 text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${
                            isPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : ch.completed
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          B{ch.chapterNumber}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {ch.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
                              <CheckCircle2 className="w-3 h-3" /> {ch.correctCount} Benar
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-rose-500 font-medium">
                              <XCircle className="w-3 h-3" /> {ch.incorrectCount} Salah
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span
                            className={`text-sm font-black ${
                              isPassed ? 'text-emerald-600' : 'text-slate-700'
                            }`}
                          >
                            {ch.score}%
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              isPassed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isPassed ? 'Lulus' : 'Belum'}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-amber-600 block mt-0.5">
                          +{ch.pointsEarned} Poin
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => {
              soundManager.playClick();
              // Reset dan ulangi pemeriksaan
              setCurrentStepIndex(0);
              setCompletedSteps([]);
              setIsEvaluating(true);
              setDisplayPercentage(0);
              setDisplayPoints(0);
              setShowSummary(false);

              let step = 0;
              const stepInterval = setInterval(() => {
                if (step < auditSteps.length) {
                  soundManager.playStepPing(step);
                  setCompletedSteps((prev) => [...prev, auditSteps[step].id]);
                  step++;
                  setCurrentStepIndex(step);
                } else {
                  clearInterval(stepInterval);
                  setIsEvaluating(false);
                  startNumberAnimation(auditData.targetPercent, auditData.targetPoints);
                }
              }, 480);
            }}
            id="re-audit-score-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cek Ulang Skor & Poin</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            id="finish-score-audit-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition cursor-pointer"
          >
            <span>Tutup & Lanjut Belajar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
