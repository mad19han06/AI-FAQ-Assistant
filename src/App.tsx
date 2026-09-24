/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { SupportTicketModal } from './components/SupportTicketModal.tsx';
import { EscalationModal } from './components/EscalationModal.tsx';
import { SourceViewerModal } from './components/SourceViewerModal.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';

// Views
import { LandingView } from './views/LandingView.tsx';
import { ChatView } from './views/ChatView.tsx';
import { FaqDashboardView } from './views/FaqDashboardView.tsx';
import { FaqDetailView } from './views/FaqDetailView.tsx';
import { CategoriesView } from './views/CategoriesView.tsx';
import { SavedView } from './views/SavedView.tsx';
import { ChatHistoryView } from './views/ChatHistoryView.tsx';
import { SupportTicketsView } from './views/SupportTicketsView.tsx';
import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { LoginView } from './views/LoginView.tsx';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content View Switcher */}
      <main
        className={`flex-1 w-full mx-auto ${
          currentView === 'chat'
            ? 'max-w-7xl px-2 sm:px-4 py-2 sm:py-3'
            : currentView === 'login'
            ? 'max-w-7xl px-4 py-4'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6'
        }`}
      >
        {currentView === 'landing' && <LandingView />}
        {currentView === 'chat' && <ChatView />}
        {currentView === 'faqs' && <FaqDashboardView />}
        {currentView === 'faq-detail' && <FaqDetailView />}
        {currentView === 'categories' && <CategoriesView />}
        {currentView === 'saved' && <SavedView />}
        {currentView === 'history' && <ChatHistoryView />}
        {currentView === 'support' && <SupportTicketsView />}
        {currentView === 'admin' && <AdminDashboardView />}
        {currentView === 'login' && <LoginView />}
      </main>

      {/* Footer */}
      {currentView !== 'chat' && currentView !== 'login' && <Footer />}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Interactive Global Modals */}
      <CommandPalette />
      <UserProfileModal />
      <OnboardingModal />
      <SupportTicketModal />
      <EscalationModal />
      <SourceViewerModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
