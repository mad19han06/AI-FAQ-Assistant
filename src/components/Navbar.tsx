import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ViewMode } from '../types.ts';
import { SUPPORTED_LANGUAGES } from '../data/knowledgeBase.ts';
import {
  Search,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Bell,
  User,
  Shield,
  Menu,
  X,
  Bookmark,
  MessageSquare,
  LifeBuoy,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    theme,
    setTheme,
    effectiveTheme,
    userLanguage,
    setUserLanguage,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsCommandPaletteOpen,
    setIsProfileOpen,
    savedItems,
    currentUser,
    logout,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === userLanguage) || SUPPORTED_LANGUAGES[0];

  const navLinks: { label: string; view: ViewMode }[] = [
    { label: 'Home', view: 'landing' },
    { label: 'Ask AI', view: 'chat' },
    { label: 'FAQs', view: 'faqs' },
    { label: 'Categories', view: 'categories' },
    { label: 'Saved', view: 'saved' },
    { label: 'History', view: 'history' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D2D2D7]/60 dark:border-[#38383A] apple-glass transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Zone (strictly follows Top Bar Contract) */}
        <button
          onClick={() => setCurrentView('landing')}
          className="text-lg sm:text-xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="font-semibold">Fast FAQ</span>
        </button>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map(link => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => setCurrentView(link.view)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40'
                    : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40'
                }`}
              >
                {link.label}
                {link.view === 'saved' && savedItems.length > 0 && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-full tabular-nums">
                    {savedItems.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Quick Search ⌘K */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-[#6E6E73] dark:text-[#98989D] bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-xl transition-colors"
            title="Search FAQs (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Search FAQs</span>
            <kbd className="font-mono text-[10px] bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Mobile search trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="sm:hidden p-2 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-lg"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 text-xs font-medium"
              title="Change Language"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden xl:inline uppercase">{currentLangObj.code}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-semibold text-[#6E6E73] dark:text-[#98989D] border-b border-neutral-100 dark:border-neutral-800">
                  Select Language
                </div>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setUserLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                      userLanguage === lang.code
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-[#1D1D1F] dark:text-[#F5F5F7]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    <span className="text-[#6E6E73] dark:text-[#98989D] text-[11px] font-sans">
                      {lang.nativeName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {effectiveTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-[#1C1C1E]" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold rounded-full tabular-nums">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#6E6E73] dark:text-[#98989D]">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.actionUrl?.startsWith('/faq/')) {
                            // view faq detail
                            const faqId = n.actionUrl.replace('/faq/', '');
                            setCurrentView('faq-detail');
                          } else if (n.actionUrl === '/support') {
                            setCurrentView('support');
                          }
                          setIsNotifOpen(false);
                        }}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${
                          !n.read ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-[#6E6E73] dark:text-[#98989D] whitespace-nowrap">
                            {n.date}
                          </span>
                        </div>
                        <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile & Settings Trigger */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-2 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="User Profile & Settings"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4" />
            )}
          </button>

          {/* Auth Button: Sign In or User Menu */}
          {currentUser ? (
            <button
              onClick={() => logout()}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#6E6E73] dark:text-[#98989D] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
              title={`Logged in as ${currentUser.name}. Click to sign out.`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[11px]">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                currentView === 'login'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-[#1D1D1F] dark:text-[#F5F5F7] bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/80 dark:hover:bg-neutral-700'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Primary CTA: Ask AI */}
          <button
            onClick={() => setCurrentView('chat')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#6E6E73] dark:text-[#98989D] rounded-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1C1E] px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map(link => (
            <button
              key={link.view}
              onClick={() => {
                setCurrentView(link.view);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-xl ${
                currentView === link.view
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                  : 'text-[#1D1D1F] dark:text-[#F5F5F7]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-medium text-rose-600 py-2 px-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentView('login');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-medium text-blue-600 py-2 px-1"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}

            <button
              onClick={() => {
                setCurrentView('chat');
                setIsMobileMenuOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl"
            >
              Ask AI Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
