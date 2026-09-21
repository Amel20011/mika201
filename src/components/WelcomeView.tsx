import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ArrowRight, ShieldCheck, Sparkles, BookOpen, Target } from 'lucide-react';

export const WelcomeView: React.FC<{ onOpenLogin: () => void; onStartRegister: () => void }> = ({
  onOpenLogin,
  onStartRegister,
}) => {
  const animatedPhrases = [
    'Belajar lebih terarah.',
    'Kerjakan soal terstruktur.',
    'Tingkatkan kemampuan analitis.',
    'Selesaikan setiap bab.',
    'Raih pencapaian paripurna.',
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = animatedPhrases[phraseIndex];
    let typingSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && displayText === currentFullText) {
      const pauseTimeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1800);
      return () => clearTimeout(pauseTimeout);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % animatedPhrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentFullText.substring(0, prev.length - 1)
          : currentFullText.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      {/* Top Brand */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              AURELIA <span className="text-indigo-600">EDU</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500">Platform Pembelajaran Terpadu</p>
          </div>
        </div>

        <button
          onClick={onOpenLogin}
          id="welcome-login-top-btn"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
        >
          Masuk Akun
        </button>
      </div>

      {/* Main Hero Section */}
      <main className="max-w-4xl mx-auto w-full text-center py-12 sm:py-20 space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold tracking-wide">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>SD • SMP • SMA • SMK • Perguruan Tinggi</span>
        </div>

        {/* Big Bold Headline */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Tingkatkan Prestasi dengan Pembelajaran Interaktif
          </h2>

          {/* Animated Text */}
          <div className="h-12 flex items-center justify-center">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600 tracking-tight">
              {displayText}
              <span className="inline-block w-0.5 h-6 ml-1 bg-indigo-600 animate-pulse align-middle" />
            </p>
          </div>
        </div>

        {/* Short Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Platform edukasi profesional dengan materi terstruktur dari Bab 1 hingga Bab 8,
          sistem evaluasi presisi minimal 80%, tantangan 5 nyawa, serta sertifikasi kompetensi resmi.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
          <button
            onClick={onStartRegister}
            id="welcome-register-btn"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 transition transform active:scale-98"
          >
            <span>Daftar Akun Baru</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenLogin}
            id="welcome-login-main-btn"
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-bold text-base shadow-xs transition"
          >
            Masuk
          </button>
        </div>

        {/* Key Features Pill Highlights */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <BookOpen className="w-5 h-5 text-indigo-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">8 Bab Lengkap</h4>
            <p className="text-xs text-slate-500 font-medium">Materi & evaluasi runtut</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <Target className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Target 80%</h4>
            <p className="text-xs text-slate-500 font-medium">Standar kelulusan mutlak</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-rose-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">5 Nyawa Real-time</h4>
            <p className="text-xs text-slate-500 font-medium">Regenerasi 1 menit/nyawa</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Sertifikat Resmi</h4>
            <p className="text-xs text-slate-500 font-medium">Terbuka saat semua bab lulus</p>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="max-w-6xl mx-auto w-full py-4 text-center text-xs text-slate-400 font-medium border-t border-slate-200/60">
        AURELIA EDU &copy; 2026 • Platform Edukasi Berkelanjutan
      </footer>
    </div>
  );
};
