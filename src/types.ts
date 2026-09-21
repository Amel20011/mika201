export type EducationLevel = 'SD' | 'SMP' | 'SMA' | 'SMK' | 'Kuliah';

export interface User {
  id: string;
  name: string;
  age: number;
  school: string;
  educationLevel: EducationLevel;
  profilePhoto: string;
  points: number;
  lives: number; // 0 - 5
  lastLifeLostAt: number | null; // timestamp in ms
  studyStreakDays: number;
  faculty?: string; // For Kuliah
  major?: string; // For Kuliah
  semester?: number; // For Kuliah
}

export interface Question {
  id: string;
  chapterId: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  chapterNumber: number; // 1 to 8
  title: string;
  description: string;
  material: {
    introduction: string;
    sections: {
      heading: string;
      content: string;
      formulaOrNote?: string;
    }[];
    examples: {
      question: string;
      solution: string;
    }[];
    summary: string[];
  };
  questions: Question[];
  score: number; // 0 - 100
  completed: boolean;
  status: 'Lulus' | 'Belum Lulus' | 'Belum Dikerjakan';
}

export interface Subject {
  id: string;
  level: EducationLevel;
  name: string;
  category: string;
  description: string;
  iconName: string;
  color: string;
  chapters: Chapter[];
  faculty?: string;
  major?: string;
  semester?: number;
}

export interface HistoryItem {
  id: string;
  userId: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  score: number;
  correct: number;
  incorrect: number;
  totalQuestions: number;
  status: 'Lulus' | 'Belum Lulus';
  date: string; // e.g. "21 September 2026"
  time: string; // e.g. "14:30 WIB"
  timestamp: number;
}

export interface RewardBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'score' | 'mastery' | 'streak' | 'perseverance';
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  school: string;
  educationLevel: EducationLevel;
  profilePhoto: string;
  points: number;
  progressPercent: number;
  chaptersCompleted: number;
  isCurrentUser?: boolean;
}

export interface AppSettings {
  strictSequentialChapters: boolean; // if true, chapter N requires chapter N-1 >= 80%
  soundEffects: boolean;
  autoSaveProgress: boolean;
}

export type ActiveView = 
  | 'welcome'
  | 'login'
  | 'register'
  | 'onboarding'
  | 'dashboard'
  | 'subjects'
  | 'subject-detail'
  | 'chapter-detail'
  | 'material'
  | 'quiz'
  | 'evaluation-result'
  | 'rewards'
  | 'leaderboard'
  | 'history'
  | 'account'
  | 'settings';
