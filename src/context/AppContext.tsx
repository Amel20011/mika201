import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  User,
  Subject,
  Chapter,
  HistoryItem,
  RewardBadge,
  LeaderboardUser,
  AppSettings,
  ActiveView,
  EducationLevel,
} from '../types';
import { getInitialCurriculum, INITIAL_BADGES, MOCK_LEADERBOARD } from '../data/curriculumData';

interface EvaluationData {
  subjectId: string;
  subjectName: string;
  chapterNumber: number;
  chapterTitle: string;
  score: number;
  correct: number;
  incorrect: number;
  totalQuestions: number;
  passed: boolean; // >= 80%
  date: string;
  time: string;
}

interface AppContextType {
  user: User;
  isLoggedIn: boolean;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  subjects: Subject[];
  userSubjects: Subject[];
  history: HistoryItem[];
  badges: RewardBadge[];
  leaderboard: LeaderboardUser[];
  settings: AppSettings;
  selectedSubjectId: string | null;
  selectedChapterNumber: number | null;
  lastEvaluation: EvaluationData | null;
  secondsUntilNextLife: number;
  // Actions
  login: (emailOrName: string) => void;
  logout: () => void;
  completeOnboarding: (name: string, age: number, school: string, level: EducationLevel) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  selectSubject: (subjectId: string) => void;
  selectChapter: (subjectId: string, chapterNumber: number) => void;
  openMaterial: (subjectId: string, chapterNumber: number) => void;
  startQuiz: (subjectId: string, chapterNumber: number) => boolean; // returns false if no lives
  submitQuizResult: (
    subjectId: string,
    chapterNumber: number,
    correct: number,
    incorrect: number,
    totalQuestions: number
  ) => void;
  decrementLife: () => void;
  refillLives: () => void;
  continueLearning: () => void;
  resetAllProgress: () => void;
  isAllChaptersPassed: boolean;
  unpassedChaptersCount: number;
  totalChaptersCount: number;
  passedChaptersCount: number;
  overallAverageScore: number;
  isChapterUnlocked: (subjectId: string, chapterNumber: number) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'aurelia_user',
  SUBJECTS: 'aurelia_subjects',
  HISTORY: 'aurelia_history',
  BADGES: 'aurelia_badges',
  SETTINGS: 'aurelia_settings',
  LOGGED_IN: 'aurelia_logged_in',
};

const DEFAULT_USER: User = {
  id: 'usr-1',
  name: 'Farhan Ardiansyah',
  age: 17,
  school: 'SMA Negeri 8 Jakarta',
  educationLevel: 'SMA',
  profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  points: 1450,
  lives: 5,
  lastLifeLostAt: null,
  studyStreakDays: 3,
};

const DEFAULT_SETTINGS: AppSettings = {
  strictSequentialChapters: true,
  soundEffects: true,
  autoSaveProgress: true,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. State initialization from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGGED_IN);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getInitialCurriculum();
      }
    }
    const initial = getInitialCurriculum();
    // Seed some initial progress for SMA Math to make the app immediately testable
    const smaMath = initial.find(s => s.id === 'sma-math');
    if (smaMath) {
      smaMath.chapters[0].score = 90;
      smaMath.chapters[0].status = 'Lulus';
      smaMath.chapters[0].completed = true;
      smaMath.chapters[1].score = 85;
      smaMath.chapters[1].status = 'Lulus';
      smaMath.chapters[1].completed = true;
      smaMath.chapters[2].score = 75; // Bab 3 not yet passed (< 80%) to demo 80% rule
      smaMath.chapters[2].status = 'Belum Lulus';
      smaMath.chapters[2].completed = false;
    }
    return initial;
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'hist-1',
        userId: 'usr-1',
        subjectId: 'sma-math',
        subjectName: 'Matematika Peminatan SMA',
        chapterId: 'sma-math-ch1',
        chapterNumber: 1,
        chapterTitle: 'Trigonometri Lanjutan & Sudut Berelasi',
        score: 90,
        correct: 9,
        incorrect: 1,
        totalQuestions: 10,
        status: 'Lulus',
        date: '21 September 2026',
        time: '14:20 WIB',
        timestamp: Date.now() - 3600000 * 5,
      },
      {
        id: 'hist-2',
        userId: 'usr-1',
        subjectId: 'sma-math',
        subjectName: 'Matematika Peminatan SMA',
        chapterId: 'sma-math-ch2',
        chapterNumber: 2,
        chapterTitle: 'Limit Fungsi Aljabar dan Trigonometri',
        score: 85,
        correct: 8,
        incorrect: 2,
        totalQuestions: 10,
        status: 'Lulus',
        date: '21 September 2026',
        time: '16:05 WIB',
        timestamp: Date.now() - 3600000 * 2,
      },
      {
        id: 'hist-3',
        userId: 'usr-1',
        subjectId: 'sma-math',
        subjectName: 'Matematika Peminatan SMA',
        chapterId: 'sma-math-ch3',
        chapterNumber: 3,
        chapterTitle: 'Turunan Fungsi (Diferensial) & Aplikasi',
        score: 75,
        correct: 7,
        incorrect: 3,
        totalQuestions: 10,
        status: 'Belum Lulus',
        date: '21 September 2026',
        time: '17:40 WIB',
        timestamp: Date.now() - 1800000,
      },
    ];
  });

  const [badges, setBadges] = useState<RewardBadge[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const savedLoggedIn = localStorage.getItem(STORAGE_KEYS.LOGGED_IN);
    return savedLoggedIn === 'false' ? 'welcome' : 'dashboard';
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>('sma-math');
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number | null>(3);
  const [lastEvaluation, setLastEvaluation] = useState<EvaluationData | null>(null);
  const [secondsUntilNextLife, setSecondsUntilNextLife] = useState<number>(60);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  // 2. Real-time Lives Regeneration Engine (1 minute per life based on timestamp)
  useEffect(() => {
    const interval = setInterval(() => {
      setUser((prevUser) => {
        if (prevUser.lives >= 5 || !prevUser.lastLifeLostAt) {
          setSecondsUntilNextLife(60);
          return prevUser;
        }

        const now = Date.now();
        const elapsedMs = now - prevUser.lastLifeLostAt;
        const ONE_MINUTE_MS = 60000;

        if (elapsedMs >= ONE_MINUTE_MS) {
          const livesGained = Math.floor(elapsedMs / ONE_MINUTE_MS);
          const newLives = Math.min(5, prevUser.lives + livesGained);
          const remainderMs = elapsedMs % ONE_MINUTE_MS;
          const newLastLostAt = newLives >= 5 ? null : now - remainderMs;

          setSecondsUntilNextLife(Math.max(0, Math.ceil((ONE_MINUTE_MS - remainderMs) / 1000)));

          return {
            ...prevUser,
            lives: newLives,
            lastLifeLostAt: newLastLostAt,
          };
        } else {
          setSecondsUntilNextLife(Math.max(0, Math.ceil((ONE_MINUTE_MS - elapsedMs) / 1000)));
          return prevUser;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter subjects for current user's level
  const userSubjects = useMemo(() => {
    return subjects.filter((s) => s.level === user.educationLevel);
  }, [subjects, user.educationLevel]);

  // Check if subject exists in user's subjects, fallback to first available
  useEffect(() => {
    if (userSubjects.length > 0) {
      if (!selectedSubjectId || !userSubjects.some((s) => s.id === selectedSubjectId)) {
        setSelectedSubjectId(userSubjects[0].id);
      }
    }
  }, [userSubjects, selectedSubjectId]);

  // 3. Stats and Reward calculations
  const allUserChapters = useMemo(() => {
    return userSubjects.flatMap((s) => s.chapters);
  }, [userSubjects]);

  const totalChaptersCount = allUserChapters.length;
  const passedChaptersCount = allUserChapters.filter((c) => c.status === 'Lulus' && c.score >= 80).length;
  const unpassedChaptersCount = totalChaptersCount - passedChaptersCount;

  // Strict rule: Reward is only unlocked if EVERY chapter is >= 80%!
  const isAllChaptersPassed = totalChaptersCount > 0 && unpassedChaptersCount === 0;

  const overallAverageScore = useMemo(() => {
    const scoredChapters = allUserChapters.filter((c) => c.score > 0);
    if (scoredChapters.length === 0) return 0;
    const sum = scoredChapters.reduce((acc, c) => acc + c.score, 0);
    return Math.round(sum / scoredChapters.length);
  }, [allUserChapters]);

  // Unlock Grandmaster badge if all chapters passed
  useEffect(() => {
    if (isAllChaptersPassed) {
      setBadges((prev) =>
        prev.map((b) =>
          b.id === 'badge-grandmaster'
            ? { ...b, isUnlocked: true, unlockedAt: '2026-09-21' }
            : b
        )
      );
    }
  }, [isAllChaptersPassed]);

  // 4. Chapter unlock checker
  const isChapterUnlocked = useCallback(
    (subjectId: string, chapterNumber: number): boolean => {
      if (!settings.strictSequentialChapters) return true;
      if (chapterNumber === 1) return true;
      const targetSubj = subjects.find((s) => s.id === subjectId);
      if (!targetSubj) return true;
      const prevChapter = targetSubj.chapters.find((c) => c.chapterNumber === chapterNumber - 1);
      if (!prevChapter) return true;
      // Strict rule: Previous chapter must have score >= 80% and status 'Lulus'
      return prevChapter.status === 'Lulus' && prevChapter.score >= 80;
    },
    [settings.strictSequentialChapters, subjects]
  );

  // 5. Actions
  const decrementLife = useCallback(() => {
    setUser((prev) => {
      if (prev.lives <= 0) return prev;
      const newLives = Math.max(0, prev.lives - 1);
      // Set timestamp if starting from full or if not currently running
      const newLastLost = prev.lastLifeLostAt === null ? Date.now() : prev.lastLifeLostAt;
      return {
        ...prev,
        lives: newLives,
        lastLifeLostAt: newLastLost,
      };
    });
  }, []);

  const refillLives = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      lives: 5,
      lastLifeLostAt: null,
    }));
    setSecondsUntilNextLife(60);
  }, []);

  const login = (emailOrName: string) => {
    setIsLoggedIn(true);
    if (emailOrName && emailOrName.trim()) {
      setUser((prev) => ({ ...prev, name: emailOrName.trim() }));
    }
    setActiveView('dashboard');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActiveView('welcome');
  };

  const completeOnboarding = (
    name: string,
    age: number,
    school: string,
    level: EducationLevel
  ) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'Siswa Aurelia',
      age: age || 16,
      school: school || 'Sekolah Teladan',
      educationLevel: level,
      profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      points: 100,
      lives: 5,
      lastLifeLostAt: null,
      studyStreakDays: 1,
    };
    setUser(newUser);
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const selectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveView('subject-detail');
  };

  const selectChapter = (subjectId: string, chapterNumber: number) => {
    setSelectedSubjectId(subjectId);
    setSelectedChapterNumber(chapterNumber);
    setActiveView('chapter-detail');
  };

  const openMaterial = (subjectId: string, chapterNumber: number) => {
    setSelectedSubjectId(subjectId);
    setSelectedChapterNumber(chapterNumber);
    setActiveView('material');
  };

  const startQuiz = (subjectId: string, chapterNumber: number): boolean => {
    if (user.lives <= 0) {
      return false;
    }
    setSelectedSubjectId(subjectId);
    setSelectedChapterNumber(chapterNumber);
    setActiveView('quiz');
    return true;
  };

  const submitQuizResult = (
    subjectId: string,
    chapterNumber: number,
    correct: number,
    incorrect: number,
    totalQuestions: number
  ) => {
    const scorePercentage = Math.round((correct / Math.max(1, totalQuestions)) * 100);
    const passed = scorePercentage >= 80;

    const currentSubj = subjects.find((s) => s.id === subjectId);
    const subjectName = currentSubj ? currentSubj.name : 'Mata Pelajaran';
    const currentChapter = currentSubj?.chapters.find((c) => c.chapterNumber === chapterNumber);
    const chapterTitle = currentChapter ? currentChapter.title : `Bab ${chapterNumber}`;

    // Update chapter score and completion status
    setSubjects((prevSubjects) => {
      return prevSubjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const updatedChapters = sub.chapters.map((ch) => {
          if (ch.chapterNumber !== chapterNumber) return ch;
          // Keep best score or update
          const newScore = Math.max(ch.score, scorePercentage);
          return {
            ...ch,
            score: newScore,
            completed: ch.completed || passed,
            status: (newScore >= 80 ? 'Lulus' : 'Belum Lulus') as 'Lulus' | 'Belum Lulus',
          };
        });
        return { ...sub, chapters: updatedChapters };
      });
    });

    // Add points: 15 points per correct answer + 50 bonus if passed
    const pointsGained = correct * 15 + (passed ? 50 : 0);
    setUser((prev) => ({
      ...prev,
      points: prev.points + pointsGained,
    }));

    // Record History
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    const newHistoryItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      userId: user.id,
      subjectId,
      subjectName,
      chapterId: `${subjectId}-ch${chapterNumber}`,
      chapterNumber,
      chapterTitle,
      score: scorePercentage,
      correct,
      incorrect,
      totalQuestions,
      status: passed ? 'Lulus' : 'Belum Lulus',
      date: dateStr,
      time: timeStr,
      timestamp: Date.now(),
    };

    setHistory((prev) => [newHistoryItem, ...prev]);

    // Check accuracy badge
    if (scorePercentage === 100) {
      setBadges((prev) =>
        prev.map((b) =>
          b.id === 'badge-accuracy'
            ? { ...b, isUnlocked: true, unlockedAt: dateStr }
            : b
        )
      );
    }

    const evalData: EvaluationData = {
      subjectId,
      subjectName,
      chapterNumber,
      chapterTitle,
      score: scorePercentage,
      correct,
      incorrect,
      totalQuestions,
      passed,
      date: dateStr,
      time: timeStr,
    };

    setLastEvaluation(evalData);
    setActiveView('evaluation-result');
  };

  const continueLearning = () => {
    // Find first unfinished or unpassed chapter in current level
    for (const subj of userSubjects) {
      const unfinished = subj.chapters.find((c) => c.status !== 'Lulus' || c.score < 80);
      if (unfinished) {
        setSelectedSubjectId(subj.id);
        setSelectedChapterNumber(unfinished.chapterNumber);
        setActiveView('chapter-detail');
        return;
      }
    }
    // If all passed, open first chapter
    if (userSubjects.length > 0) {
      setSelectedSubjectId(userSubjects[0].id);
      setSelectedChapterNumber(1);
      setActiveView('chapter-detail');
    }
  };

  const resetAllProgress = () => {
    const freshCurriculum = getInitialCurriculum();
    setSubjects(freshCurriculum);
    setHistory([]);
    setBadges(INITIAL_BADGES);
    setUser((prev) => ({
      ...prev,
      points: 120,
      lives: 5,
      lastLifeLostAt: null,
    }));
    setLastEvaluation(null);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.BADGES);
  };

  // Build dynamic leaderboard including current user
  const leaderboard: LeaderboardUser[] = useMemo(() => {
    const currentUserProgress =
      totalChaptersCount > 0
        ? Math.round((passedChaptersCount / totalChaptersCount) * 100)
        : 0;

    const currentUserInLb: LeaderboardUser = {
      id: user.id,
      name: user.name,
      school: user.school,
      educationLevel: user.educationLevel,
      profilePhoto: user.profilePhoto,
      points: user.points,
      progressPercent: currentUserProgress,
      chaptersCompleted: passedChaptersCount,
      isCurrentUser: true,
    };

    const combined = [...MOCK_LEADERBOARD, currentUserInLb];
    return combined.sort((a, b) => b.points - a.points);
  }, [user, totalChaptersCount, passedChaptersCount]);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        activeView,
        setActiveView,
        subjects,
        userSubjects,
        history,
        badges,
        leaderboard,
        settings,
        selectedSubjectId,
        selectedChapterNumber,
        lastEvaluation,
        secondsUntilNextLife,
        login,
        logout,
        completeOnboarding,
        updateUserProfile,
        updateSettings,
        selectSubject,
        selectChapter,
        openMaterial,
        startQuiz,
        submitQuizResult,
        decrementLife,
        refillLives,
        continueLearning,
        resetAllProgress,
        isAllChaptersPassed,
        unpassedChaptersCount,
        totalChaptersCount,
        passedChaptersCount,
        overallAverageScore,
        isChapterUnlocked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
