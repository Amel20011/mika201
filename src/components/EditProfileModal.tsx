import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EducationLevel } from '../types';
import { X, Check, Camera, User, Calendar, School } from 'lucide-react';

export const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUserProfile } = useApp();

  const [name, setName] = useState(user.name);
  const [age, setAge] = useState<number>(user.age);
  const [school, setSchool] = useState(user.school);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(user.educationLevel);
  const [selectedPhoto, setSelectedPhoto] = useState(user.profilePhoto);

  if (!isOpen) return null;

  const avatarChoices = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      age: Number(age),
      school,
      educationLevel,
      profilePhoto: selectedPhoto,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative space-y-6 animate-scaleIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900">Edit Profil Siswa</h3>
          <p className="text-xs text-slate-500 font-medium">
            Perbarui data diri dan jenjang kurikulum belajar kamu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilih Foto Profil
            </label>
            <div className="flex items-center gap-3">
              {avatarChoices.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`relative cursor-pointer rounded-full p-0.5 transition ${
                    selectedPhoto === photo ? 'ring-3 ring-indigo-600' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Avatar ${idx + 1}`}
                    className="w-12 h-12 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedPhoto === photo && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-xs font-medium"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Umur (Tahun)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                required
                min="6"
                max="90"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-xs font-medium"
              />
            </div>
          </div>

          {/* School */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Asal Sekolah / Kampus
            </label>
            <div className="relative">
              <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-xs font-medium"
              />
            </div>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenjang Pendidikan
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-xs font-bold text-slate-800 bg-white"
            >
              <option value="SD">Sekolah Dasar (SD)</option>
              <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
              <option value="SMA">Sekolah Menengah Atas (SMA)</option>
              <option value="SMK">Sekolah Menengah Kejuruan (SMK)</option>
              <option value="Kuliah">Perguruan Tinggi / Kuliah</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Mengubah jenjang akan menyesuaikan daftar mata pelajaran dan silabus yang ditampilkan.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
