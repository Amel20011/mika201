import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History as HistoryIcon,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { history, selectChapter } = useApp();
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Lulus' | 'Belum Lulus'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((item) => {
    const matchesStatus =
      filterStatus === 'Semua' ||
      (filterStatus === 'Lulus' && item.status === 'Lulus') ||
      (filterStatus === 'Belum Lulus' && item.status === 'Belum Lulus');

    const matchesSearch =
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Riwayat Pengerjaan Soal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Daftar seluruh aktivitas pengerjaan evaluasi bab beserta catatan skor
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['Semua', 'Lulus', 'Belum Lulus'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-1 sm:flex-initial text-center ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mata pelajaran atau bab..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 outline-hidden text-xs font-medium"
          />
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <HistoryIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Tidak Ada Riwayat</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            Tidak ada riwayat pengerjaan yang cocok dengan filter atau pencarian saat ini.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {filteredHistory.map((item) => {
            const isPassed = item.status === 'Lulus';

            return (
              <div
                key={item.id}
                onClick={() => selectChapter(item.subjectId, item.chapterNumber)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition cursor-pointer group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isPassed
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {item.subjectName}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-black text-indigo-600">
                        BAB {item.chapterNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isPassed
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition truncate">
                      {item.chapterTitle}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.time}
                      </span>
                      <span>
                        Jawaban: {item.correct} benar, {item.incorrect} salah dari {item.totalQuestions} soal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                  <span className={`text-2xl font-black ${isPassed ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {item.score}%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 group-hover:text-indigo-600 transition">
                    <span>Lihat Bab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
