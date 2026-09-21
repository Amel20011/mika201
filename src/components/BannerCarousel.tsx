import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Award, Flame, Target, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  ctaText: string;
  actionView: 'subjects' | 'rewards' | 'leaderboard';
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
}

export const BannerCarousel: React.FC = () => {
  const { setActiveView, isAllChaptersPassed } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const banners: BannerSlide[] = [
    {
      id: 'banner-1',
      tag: 'Target Kelulusan',
      title: 'Minimal 80% di Setiap Bab',
      description: 'Selesaikan materi dan jawab latihan soal dengan presisi. Setiap bab wajib mencapai minimal 80% untuk membuka reward.',
      icon: Target,
      ctaText: 'Mulai Pembelajaran',
      actionView: 'subjects',
      bgGradient: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900',
      borderColor: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30',
      textColor: 'text-white',
    },
    {
      id: 'banner-2',
      tag: 'Sistem Reward Paripurna',
      title: isAllChaptersPassed ? 'Reward Kamu Terbuka!' : 'Buka Sertifikat & Badge Keahlian',
      description: isAllChaptersPassed 
        ? 'Selamat! Semua bab telah tuntas di atas 80%. Klaim sertifikat kompetensi resmi kamu sekarang.'
        : 'Reward utama hanya terbuka jika seluruh bab telah tuntas dengan nilai minimal 80%. Buktikan kompetensimu.',
      icon: Award,
      ctaText: 'Lihat Status Reward',
      actionView: 'rewards',
      bgGradient: 'bg-gradient-to-r from-indigo-900 via-violet-950 to-slate-900',
      borderColor: 'border-violet-500/30',
      badgeBg: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
      textColor: 'text-white',
    },
    {
      id: 'banner-3',
      tag: 'Tantangan Ketelitian',
      title: 'Sistem 5 Nyawa & Regenerasi Otomatis',
      description: 'Jawaban salah mengurangi 1 nyawa. Jika nyawa habis, regenerasi berlangsung 1 nyawa setiap 1 menit secara terukur.',
      icon: ShieldCheck,
      ctaText: 'Cek Peringkat Siswa',
      actionView: 'leaderboard',
      bgGradient: 'bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900',
      borderColor: 'border-cyan-500/30',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30',
      textColor: 'text-white',
    },
  ];

  // Auto-slide effect every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = banners[currentIndex];
  const SlideIcon = currentSlide.icon;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-md group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      id="banner-carousel"
    >
      {/* Banner Container */}
      <div className={`p-6 sm:p-8 ${currentSlide.bgGradient} border ${currentSlide.borderColor} transition-colors duration-500`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${currentSlide.badgeBg}`}>
                {currentSlide.tag}
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {currentSlide.title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              {currentSlide.description}
            </p>

            {/* Action Button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveView(currentSlide.actionView)}
                id={`banner-action-btn-${currentSlide.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition transform active:scale-95"
              >
                <span>{currentSlide.ctaText}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative Icon */}
          <div className="hidden md:flex items-center justify-center pr-6">
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-300 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <SlideIcon className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-7 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
