import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EducationLevel } from '../types';
import { Bot, ArrowRight, CheckCircle2, Loader2, Sparkles, School, User, Calendar } from 'lucide-react';

export const OnboardingFlow: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [school, setSchool] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('SMA');
  const [detectedReason, setDetectedReason] = useState<string>('');

  // Step 1: Name validation & next
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  };

  // Step 2: Age validation & next
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    const numAge = parseInt(age, 10);
    if (isNaN(numAge) || numAge <= 0 || numAge > 99) return;
    setStep(3);
  };

  // Step 3: School & automatic level detection
  const handleStep3Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school.trim()) return;

    const numAge = parseInt(age, 10) || 16;
    const lowerSchool = school.toLowerCase();

    let autoLevel: EducationLevel = 'SMA';
    let reason = '';

    if (
      lowerSchool.includes('univ') ||
      lowerSchool.includes('kampus') ||
      lowerSchool.includes('institut') ||
      lowerSchool.includes('politeknik') ||
      numAge >= 19
    ) {
      autoLevel = 'Kuliah';
      reason = 'Berdasarkan usia dan institusi pendidikan tinggi.';
    } else if (lowerSchool.includes('smk') || lowerSchool.includes('kejuruan')) {
      autoLevel = 'SMK';
      reason = 'Berdasarkan kata kunci SMK/Kejuruan pada nama sekolah.';
    } else if (lowerSchool.includes('smp') || lowerSchool.includes('mts') || (numAge >= 12 && numAge <= 15)) {
      autoLevel = 'SMP';
      reason = 'Berdasarkan rentang usia 12-15 tahun dan jenjang SMP.';
    } else if (lowerSchool.includes('sd') || lowerSchool.includes('mi') || numAge <= 12) {
      autoLevel = 'SD';
      reason = 'Berdasarkan rentang usia Sekolah Dasar (SD).';
    } else {
      autoLevel = 'SMA';
      reason = 'Berdasarkan rentang usia 16-18 tahun jenjang SMA.';
    }

    setSelectedLevel(autoLevel);
    setDetectedReason(reason);
    setStep(4);
  };

  // Step 4: Confirm level & show loading animation
  const handleConfirmLevel = () => {
    setStep(5);
    // Simulate smart curation loading for 2 seconds
    setTimeout(() => {
      completeOnboarding(name, parseInt(age, 10) || 16, school, selectedLevel);
    }, 2000);
  };

  const levelOptions: { level: EducationLevel; label: string; desc: string }[] = [
    { level: 'SD', label: 'Sekolah Dasar (SD)', desc: 'Matematika Dasar, IPA, Bahasa Indonesia' },
    { level: 'SMP', label: 'Sekolah Menengah Pertama (SMP)', desc: 'Aljabar, Fisika Dasar, Bahasa' },
    { level: 'SMA', label: 'Sekolah Menengah Atas (SMA)', desc: 'Kalkulus, Trigonometri, Fisika, Biologi' },
    { level: 'SMK', label: 'Sekolah Menengah Kejuruan (SMK)', desc: 'RPL, Desain, Kejuruan Terapan' },
    { level: 'Kuliah', label: 'Perguruan Tinggi / Kuliah', desc: 'Algoritma, DBMS Lanjut, Teori Komputasi' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div
            className="bg-indigo-600 h-2 transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          {/* Aurel Avatar & Dialogue Bubble Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/20">
              <Bot className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base">Aurel</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Pemandu Belajar
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">AURELIA EDU Onboarding</p>
            </div>
          </div>

          {/* TAHAP 1: NAMA */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Aurel Speech Bubble */}
              <div className="relative p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                <p>Halo, saya Aurel.</p>
                <p className="mt-1">Sebelum mulai belajar, mari kita kenalan terlebih dahulu.</p>
                <p className="mt-3 font-bold text-indigo-900">Siapa nama kamu?</p>
              </div>

              <form onSubmit={handleStep1Next} className="space-y-4">
                <div>
                  <label htmlFor="student-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="student-name-input"
                      type="text"
                      required
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Farhan Ardiansyah"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden font-medium text-slate-900 placeholder:text-slate-400 text-base transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    id="onboarding-step1-next"
                    disabled={!name.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAHAP 2: UMUR */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Aurel Speech Bubble */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                <p>Senang berkenalan denganmu, <strong className="text-indigo-900">{name}</strong>!</p>
                <p className="mt-2 font-bold text-indigo-900">Berapa umur kamu?</p>
              </div>

              <form onSubmit={handleStep2Next} className="space-y-4">
                <div>
                  <label htmlFor="student-age-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Umur (Tahun)
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="student-age-input"
                      type="number"
                      required
                      min="6"
                      max="90"
                      autoFocus
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Contoh: 17"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden font-medium text-slate-900 placeholder:text-slate-400 text-base transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="submit"
                    id="onboarding-step2-next"
                    disabled={!age}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAHAP 3: SEKOLAH / KAMPUS */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Aurel Speech Bubble */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                <p className="font-bold text-indigo-900">
                  Saat ini kamu bersekolah atau kuliah di mana?
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Informasi ini membantu Aurelia Edu memetakan kurikulum dan jenjang materi yang relevan.
                </p>
              </div>

              <form onSubmit={handleStep3Next} className="space-y-4">
                <div>
                  <label htmlFor="student-school-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nama Sekolah atau Universitas
                  </label>
                  <div className="relative">
                    <School className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="student-school-input"
                      type="text"
                      required
                      autoFocus
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Contoh: SMA Negeri 8 Jakarta atau ITB"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden font-medium text-slate-900 placeholder:text-slate-400 text-base transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="submit"
                    id="onboarding-step3-next"
                    disabled={!school.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAHAP 4: PENYESUAIAN JENJANG OTOMATIS & KONFIRMASI */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Aurel Speech Bubble */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                <p className="font-bold text-indigo-900">
                  Sistem telah menganalisis data kamu!
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {detectedReason} Silakan konfirmasi atau pilih jenjang yang tepat jika perlu penyesuaian:
                </p>
              </div>

              {/* Level Cards Selector */}
              <div className="space-y-2.5">
                {levelOptions.map((opt) => {
                  const isSelected = selectedLevel === opt.level;
                  return (
                    <div
                      key={opt.level}
                      onClick={() => setSelectedLevel(opt.level)}
                      id={`level-option-${opt.level}`}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{opt.label}</h4>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                              Terpilih
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  Sebelumnya
                </button>
                <button
                  type="button"
                  id="onboarding-confirm-level-btn"
                  onClick={handleConfirmLevel}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
                >
                  <span>Mulai Belajar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAHAP 5: LOADING ANIMATION */}
          {step === 5 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-5 animate-fadeIn">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin flex items-center justify-center"></div>
                <Sparkles className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Menyesuaikan pengalaman belajar kamu…
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Menyiapkan kurikulum {selectedLevel}, bab 1 hingga bab 8, sistem evaluasi, serta akun belajar pribadi.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
