import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Medal, Award, Filter, Search } from 'lucide-react';
import { EducationLevel } from '../types';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, user } = useApp();
  const [levelFilter, setLevelFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = leaderboard.filter((entry) => {
    const matchesFilter = levelFilter === 'Semua' || entry.educationLevel === levelFilter;
    const matchesSearch =
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.school.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentUserRank = leaderboard.findIndex((e) => e.isCurrentUser || e.id === user.id) + 1;

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Peringkat Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Klasemen prestasi belajar dan akumulasi poin siswa Aurelia Edu
          </p>
        </div>

        {/* Current User Rank Badge */}
        <div className="p-3 px-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex items-center gap-3 self-start sm:self-auto">
          <Trophy className="w-5 h-5 text-indigo-600" />
          <div className="text-xs">
            <span className="text-slate-500 font-semibold block">Posisi Kamu:</span>
            <span className="font-extrabold text-indigo-900 text-sm">
              Peringkat #{currentUserRank || 1} ({user.points} Poin)
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
        {/* Rank 2 */}
        {leaderboard[1] && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 text-center space-y-2 flex flex-col justify-end shadow-xs order-1">
            <div className="relative mx-auto">
              <img
                src={leaderboard[1].profilePhoto}
                alt={leaderboard[1].name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-4 ring-slate-200 mx-auto"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center border-2 border-white">
                2
              </span>
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
              {leaderboard[1].name}
            </h4>
            <p className="text-[10px] text-slate-500 truncate">{leaderboard[1].school}</p>
            <div className="pt-1">
              <span className="text-xs sm:text-sm font-black text-slate-800">
                {leaderboard[1].points} Poin
              </span>
            </div>
          </div>
        )}

        {/* Rank 1 (Center) */}
        {leaderboard[0] && (
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 text-center space-y-2.5 shadow-md order-2 relative">
            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 text-xs font-black flex items-center justify-center absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-xs">
              1
            </div>
            <div className="relative mx-auto pt-2">
              <img
                src={leaderboard[0].profilePhoto}
                alt={leaderboard[0].name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover ring-4 ring-amber-400 mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
              {leaderboard[0].name}
            </h4>
            <p className="text-xs text-slate-500 truncate font-medium">{leaderboard[0].school}</p>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              {leaderboard[0].points} Poin
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {leaderboard[2] && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 text-center space-y-2 flex flex-col justify-end shadow-xs order-3">
            <div className="relative mx-auto">
              <img
                src={leaderboard[2].profilePhoto}
                alt={leaderboard[2].name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-4 ring-amber-700/20 mx-auto"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
              {leaderboard[2].name}
            </h4>
            <p className="text-[10px] text-slate-500 truncate">{leaderboard[2].school}</p>
            <div className="pt-1">
              <span className="text-xs sm:text-sm font-black text-slate-800">
                {leaderboard[2].points} Poin
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['Semua', 'SD', 'SMP', 'SMA', 'SMK', 'Kuliah'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                levelFilter === lvl
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa atau sekolah..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 outline-hidden text-xs font-medium"
          />
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {filteredEntries.map((entry, index) => {
          const isCurrentUser = entry.isCurrentUser || entry.id === user.id;

          return (
            <div
              key={entry.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition ${
                isCurrentUser ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className={`w-7 text-center font-black text-sm shrink-0 ${
                  index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-500' : index === 2 ? 'text-amber-700' : 'text-slate-400'
                }`}>
                  #{index + 1}
                </span>

                <img
                  src={entry.profilePhoto}
                  alt={entry.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {entry.name}
                    </h4>
                    {isCurrentUser && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                        Kamu
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {entry.school} • Jenjang {entry.educationLevel}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-base font-black text-slate-900 block">
                  {entry.points} Poin
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {entry.chaptersCompleted} Bab Tuntas
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
