import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Home, HelpCircle, Sparkles, Bookmark, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, setIsProfileOpen, savedItems } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#D2D2D7]/60 dark:border-[#38383A] bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl transition-colors h-14 px-3 flex items-center justify-around">
      {/* Home */}
      <button
        onClick={() => setCurrentView('landing')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
          currentView === 'landing'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-[#6E6E73] dark:text-[#98989D]'
        }`}
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>Home</span>
      </button>

      {/* FAQs */}
      <button
        onClick={() => setCurrentView('faqs')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
          currentView === 'faqs' || currentView === 'faq-detail' || currentView === 'categories'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-[#6E6E73] dark:text-[#98989D]'
        }`}
      >
        <HelpCircle className="w-4 h-4 mb-0.5" />
        <span>FAQs</span>
      </button>

      {/* Center Floating Ask AI button */}
      <button
        onClick={() => setCurrentView('chat')}
        className={`flex items-center justify-center w-11 h-11 -mt-4 rounded-full bg-blue-600 text-white shadow-md active:scale-95 transition-all ${
          currentView === 'chat' ? 'ring-3 ring-blue-300 dark:ring-blue-800' : ''
        }`}
        aria-label="Ask AI"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {/* Saved */}
      <button
        onClick={() => setCurrentView('saved')}
        className={`relative flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
          currentView === 'saved'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-[#6E6E73] dark:text-[#98989D]'
        }`}
      >
        <Bookmark className="w-4 h-4 mb-0.5" />
        <span>Saved</span>
        {savedItems.length > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 bg-blue-600 rounded-full" />
        )}
      </button>

      {/* Profile */}
      <button
        onClick={() => setIsProfileOpen(true)}
        className="flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
      >
        <User className="w-4 h-4 mb-0.5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
