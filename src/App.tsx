import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { WelcomeView } from './components/WelcomeView';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { SubjectListView } from './components/SubjectListView';
import { SubjectDetailView } from './components/SubjectDetailView';
import { ChapterDetailView } from './components/ChapterDetailView';
import { MaterialView } from './components/MaterialView';
import { QuizView } from './components/QuizView';
import { EvaluationResultView } from './components/EvaluationResultView';
import { RewardView } from './components/RewardView';
import { LeaderboardView } from './components/LeaderboardView';
import { HistoryView } from './components/HistoryView';
import { AccountView } from './components/AccountView';
import { SettingsView } from './components/SettingsView';

const MainAppLayout: React.FC = () => {
  const { user, isLoggedIn, activeView, setActiveView } = useApp();
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If user is not authenticated yet or signed out
  if (!isLoggedIn) {
    if (isOnboardingActive) {
      return <OnboardingFlow onCancel={() => setIsOnboardingActive(false)} />;
    }

    return (
      <>
        <WelcomeView
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onStartRegister={() => setIsOnboardingActive(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  // Render view router based on activeView
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'subjects':
        return <SubjectListView />;
      case 'subject-detail':
        return <SubjectDetailView />;
      case 'chapter-detail':
        return <ChapterDetailView />;
      case 'material':
        return <MaterialView />;
      case 'quiz':
        return <QuizView />;
      case 'evaluation-result':
        return <EvaluationResultView />;
      case 'rewards':
        return <RewardView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'history':
        return <HistoryView />;
      case 'account':
        return <AccountView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar & Mobile Bottom Nav */}
      <Navbar />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
