import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Trophy,
  History,
  User,
  BookOpen,
  Award,
  Settings,
  GraduationCap,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { ActiveView } from '../types';
import { soundManager } from '../utils/audio';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, user, logout, isAllChaptersPassed } = useApp();

  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'subjects', label: 'Mata Pelajaran', icon: BookOpen },
    { id: 'leaderboard', label: 'Prestasi', icon: Trophy },
    { id: 'history', label: 'Riwayat', icon: History },
    { id: 'rewards', label: 'Reward', icon: Award },
    { id: 'account', label: 'Akun', icon: User },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const mobileNavItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'leaderboard', label: 'Prestasi', icon: Trophy },
    { id: 'history', label: 'Riwayat', icon: History },
    { id: 'account', label: 'Akun', icon: User },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen fixed left-0 top-0 bottom-0 z-40 p-4 shadow-xs">
        {/* Brand */}
        <div 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-3 px-3 py-4 cursor-pointer group mb-4 border-b border-slate-100"
          id="sidebar-brand"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              AURELIA <span className="text-indigo-600">EDU</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-500">Platform Belajar Interaktif</p>
          </div>
        </div>

        {/* Education Level Badge Box */}
        <div className="mx-2 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jenjang Aktif</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {user.educationLevel}
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium mt-1 truncate" title={user.school}>
            {user.school}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || 
              (item.id === 'subjects' && ['subject-detail', 'chapter-detail', 'material', 'quiz', 'evaluation-result'].includes(activeView));

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveView(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'rewards' && isAllChaptersPassed && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                )}
                <ChevronRight className={`w-4 h-4 opacity-50 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </nav>

        {/* Bottom User Quick & Logout */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <button
            onClick={logout}
            id="sidebar-logout-btn"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-5 h-5 text-rose-500" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || 
              (item.id === 'dashboard' && ['subjects', 'subject-detail', 'chapter-detail', 'material'].includes(activeView));

            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveView(item.id);
                }}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition ${
                  isActive
                    ? 'text-indigo-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-500'}`} />
                <span className="text-[11px] leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
