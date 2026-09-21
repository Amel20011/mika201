import React from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audio';
import { Heart, Clock, Sparkles, User as UserIcon, RefreshCw } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, secondsUntilNextLife, refillLives, setActiveView, openScoreAudit } = useApp();

  // Format indonesian date: "Senin, 21 September 2026"
  const today = new Date('2026-09-21T09:00:00');
  const formattedDate = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* User Info Left */}
        <div 
          onClick={() => setActiveView('account')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
          id="header-user-profile"
        >
          <div className="relative shrink-0 w-9 h-9 sm:w-10 sm:h-10">
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-full h-full rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-indigo-600 transition truncate max-w-[90px] xs:max-w-[130px] sm:max-w-none">
                {user.name}
              </h2>
              <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                {user.educationLevel}
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-medium truncate">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Right Info: Points & Lives */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Tombol Cek Skor Poin */}
          <button
            onClick={openScoreAudit}
            id="header-check-points-btn"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs font-black text-[11px] sm:text-xs transition active:scale-95 cursor-pointer shrink-0"
            title="Klik untuk mengecek skor poin dan evaluasi semua bab"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-100" />
            <span>Cek Poin</span>
            <span className="bg-amber-700/60 px-1.5 py-0.5 rounded-md text-[10px] ml-0.5 font-black">
              {user.points}
            </span>
          </button>

          {/* Hearts / Lives Display */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-900 shrink-0"
            id="header-lives-container"
          >
            {/* Desktop / Tablet: 5 Hearts */}
            <div className="hidden sm:flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((idx) => {
                const isActive = idx <= user.lives;
                return (
                  <Heart
                    key={idx}
                    className={`w-4 h-4 transition-transform ${
                      isActive
                        ? 'text-rose-500 fill-rose-500 scale-100'
                        : 'text-slate-300 fill-slate-200 scale-90'
                    }`}
                  />
                );
              })}
            </div>

            {/* Mobile Single Heart icon */}
            <div className="flex sm:hidden items-center">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-1 sm:pl-1 sm:border-l sm:border-rose-200 text-xs font-black">
              <span>{user.lives}/5</span>
              {user.lives < 5 && (
                <div 
                  className="flex items-center gap-0.5 text-[10px] sm:text-[11px] text-rose-700 font-semibold cursor-help ml-0.5"
                  title="Regenerasi 1 nyawa setiap 1 menit"
                >
                  <Clock className="w-3 h-3 text-rose-500 animate-spin" />
                  <span className="tabular-nums">{formatSeconds(secondsUntilNextLife)}</span>
                </div>
              )}
            </div>

            {user.lives < 5 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  refillLives();
                }}
                className="hidden lg:flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-rose-200/80 hover:bg-rose-300 text-rose-900 transition font-semibold"
                title="Isi ulang nyawa untuk pengujian"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Isi Penuh</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
