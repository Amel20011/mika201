import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Target,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AnimatedPhrase {
  text: string;
  themeName: string;
  textClass: string;
  cursorClass: string;
  highlightBadge: string;
}

export const WelcomeView: React.FC<{ onOpenLogin: () => void; onStartRegister: () => void }> = ({
  onOpenLogin,
  onStartRegister,
}) => {
  // Daftar teks beserta variasi warna: Kuning, Hijau, Rainbow, Biru Cerah, dan Fuchsia/Pink
  const animatedPhrases: AnimatedPhrase[] = [
    {
      text: 'Selesaikan setiap bab.',
      themeName: 'Kuning',
      textClass: 'text-amber-500 drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)]',
      cursorClass: 'bg-amber-500',
      highlightBadge: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    {
      text: 'Belajar lebih terarah.',
      themeName: 'Hijau',
      textClass: 'text-emerald-500 drop-shadow-[0_2px_12px_rgba(16,185,129,0.3)]',
      cursorClass: 'bg-emerald-500',
      highlightBadge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    {
      text: 'Tingkatkan kemampuan analitis.',
      themeName: 'Rainbow',
      textClass:
        'bg-gradient-to-r from-rose-500 via-amber-500 via-emerald-500 via-sky-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(99,102,241,0.25)]',
      cursorClass: 'bg-gradient-to-b from-rose-500 to-indigo-600',
      highlightBadge: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    },
    {
      text: 'Kerjakan soal terstruktur.',
      themeName: 'Biru',
      textClass: 'text-sky-500 drop-shadow-[0_2px_12px_rgba(14,165,233,0.3)]',
      cursorClass: 'bg-sky-500',
      highlightBadge: 'bg-sky-50 border-sky-200 text-sky-700',
    },
    {
      text: 'Raih pencapaian paripurna.',
      themeName: 'Rainbow Gem',
      textClass:
        'bg-gradient-to-r from-fuchsia-500 via-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(217,70,239,0.3)]',
      cursorClass: 'bg-fuchsia-500',
      highlightBadge: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700',
    },
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Ref untuk scroll container kartu fitur lurus horizontal
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Typewriter effect dengan penutupan (backspacing) dan penggantian warna
  useEffect(() => {
    const currentItem = animatedPhrases[phraseIndex];
    const currentFullText = currentItem.text;
    const typingSpeed = isDeleting ? 30 : 65;

    if (!isDeleting && displayText === currentFullText) {
      // Jeda setelah teks selesai diketik sebelum menutup kembali
      const pauseTimeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1900);
      return () => clearTimeout(pauseTimeout);
    } else if (isDeleting && displayText === '') {
      // Teks sudah menutup penuh, beralih ke warna dan kalimat berikutnya lalu mulai menulis kembali
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

  // Monitor scroll position pada baris kartu fitur lurus
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollHorizontally = (direction: 'left' | 'right') => {
    soundManager.playClick();
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  const currentPhrase = animatedPhrases[phraseIndex];

  // Daftar kartu fitur yang disusun lurus 1 baris (termasuk 5 nyawa & sertifikat resmi yang dipindahkan ke sini)
  const featureCards = [
    {
      id: 'feature-chapters',
      icon: BookOpen,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50/70',
      borderColor: 'border-indigo-100',
      title: '8 Bab Lengkap',
      desc: 'Materi & evaluasi runtut terstruktur',
    },
    {
      id: 'feature-target',
      icon: Target,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/70',
      borderColor: 'border-emerald-100',
      title: 'Target 80%',
      desc: 'Standar kelulusan mutlak tiap bab',
    },
    {
      id: 'feature-lives',
      icon: ShieldCheck,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50/70',
      borderColor: 'border-rose-100',
      title: '5 Nyawa Real-time',
      desc: 'Regenerasi 1 menit per nyawa',
    },
    {
      id: 'feature-certificate',
      icon: Sparkles,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50/70',
      borderColor: 'border-amber-100',
      title: 'Sertifikat Resmi',
      desc: 'Terbuka saat semua bab tuntas',
    },
    {
      id: 'feature-independent',
      icon: Award,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50/70',
      borderColor: 'border-purple-100',
      title: 'Prestasi Mandiri',
      desc: 'Evaluasi akurat tanpa distraksi',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      {/* Main Hero Section (Header atas dan badge jenjang telah dihapus sesuai instruksi) */}
      <main className="max-w-4xl mx-auto w-full text-center pt-8 sm:pt-14 pb-8 space-y-8 my-auto">
        {/* Big Bold Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Tingkatkan Prestasi dengan Pembelajaran Interaktif
          </h1>

          {/* Animated Colorful Text: Menutup kembali lalu menulis kembali dengan warna berbeda (Kuning, Hijau, Rainbow, dll.) */}
          <div className="min-h-[56px] sm:min-h-[64px] flex items-center justify-center px-4">
            <div className="inline-flex items-center text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight transition-colors duration-300">
              <span className={currentPhrase.textClass}>
                {displayText}
              </span>
              <span
                className={`inline-block w-[3px] h-7 sm:h-9 ml-1.5 rounded-full animate-pulse align-middle ${currentPhrase.cursorClass}`}
              />
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Platform edukasi profesional dengan materi terstruktur dari Bab 1 hingga Bab 8,
          sistem evaluasi presisi minimal 80%, tantangan 5 nyawa, serta sertifikasi kompetensi resmi.
        </p>

        {/* Call to Actions (Daftar Akun Baru & Masuk) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-md mx-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              onStartRegister();
            }}
            id="welcome-register-btn"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 transition transform active:scale-98 cursor-pointer"
          >
            <span>Daftar Akun Baru</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLogin();
            }}
            id="welcome-login-main-btn"
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-bold text-base shadow-xs transition cursor-pointer"
          >
            Masuk
          </button>
        </div>

        {/* Baris Fitur Lurus Horizontal yang Dapat Digeser Kiri & Kanan */}
        <div className="pt-8 sm:pt-10 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-3 px-1 sm:px-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>Keunggulan Pembelajaran</span>
            </span>

            {/* Tombol Navigasi Panah Geser Kiri / Kanan */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollHorizontally('left')}
                id="btn-scroll-features-left"
                disabled={!canScrollLeft}
                aria-label="Geser ke kiri"
                className={`p-1.5 rounded-lg border transition ${
                  canScrollLeft
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer'
                    : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollHorizontally('right')}
                id="btn-scroll-features-right"
                disabled={!canScrollRight}
                aria-label="Geser ke kanan"
                className={`p-1.5 rounded-lg border transition ${
                  canScrollRight
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer'
                    : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Container Lurus Horizontal 1 Baris (Bisa di-swipe / di-scroll ke kiri dan kanan) */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex flex-row overflow-x-auto gap-3.5 sm:gap-4 pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {featureCards.map((card) => {
              const IconComp = card.icon;
              return (
                <div
                  key={card.id}
                  id={card.id}
                  className={`min-w-[220px] sm:min-w-[250px] flex-1 flex-shrink-0 p-4 rounded-2xl bg-white border ${card.borderColor} shadow-xs text-left snap-start hover:shadow-md transition-all group`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${card.bgColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <IconComp className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{card.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
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

