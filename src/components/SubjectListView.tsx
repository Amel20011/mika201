import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Layers, CheckCircle2, ChevronRight, Search, ArrowLeft } from 'lucide-react';

export const SubjectListView: React.FC = () => {
  const { user, userSubjects, selectSubject, setActiveView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = userSubjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveView('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mata Pelajaran {user.educationLevel}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Kurikulum terstruktur untuk jenjang {user.educationLevel} ({user.school})
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mata pelajaran..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden text-xs font-medium text-slate-900 transition"
          />
        </div>
      </div>

      {/* College (Kuliah) Special Academic Structure Banner */}
      {user.educationLevel === 'Kuliah' && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-200/80 text-indigo-900 uppercase tracking-wider">
              Struktur Akademik Perguruan Tinggi
            </span>
            <p className="text-sm font-bold text-indigo-900 mt-1">
              Fakultas Ilmu Komputer & Sains Informasi • Semester Ganjil 2026/2027
            </p>
            <p className="text-xs text-indigo-700 font-medium">
              Struktur mata kuliah berstandar kurikulum perguruan tinggi nasional dengan 8 bab kajian mendalam.
            </p>
          </div>
        </div>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((sub) => {
          const totalCh = sub.chapters.length;
          const passedCh = sub.chapters.filter((c) => c.status === 'Lulus' && c.score >= 80).length;
          const progressPercent = Math.round((passedCh / totalCh) * 100);

          return (
            <div
              key={sub.id}
              onClick={() => selectSubject(sub.id)}
              id={`subject-card-${sub.id}`}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {sub.category}
                  </span>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    <span>8 Bab Lengkap</span>
                  </span>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                      {sub.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Ketuntasan Bab</span>
                  <span className="font-bold text-slate-900">{passedCh} / {totalCh} Bab ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    Target kelulusan per bab &ge; 80%
                  </span>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    <span>Pelajari</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Mata Pelajaran Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            Tidak ada mata pelajaran yang cocok dengan pencarian "{searchQuery}".
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
          >
            Hapus Pencarian
          </button>
        </div>
      )}
    </div>
  );
};
