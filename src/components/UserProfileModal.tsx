import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { SUPPORTED_LANGUAGES } from '../data/knowledgeBase.ts';
import {
  X,
  User,
  Sliders,
  Shield,
  Download,
  Trash2,
  Check,
  Volume2,
  Moon,
  Sun,
  Laptop,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    theme,
    setTheme,
    effectiveTheme,
    userLanguage,
    setUserLanguage,
    preferences,
    updatePreferences,
    clearAllChats,
    chatSessions,
    savedItems,
    faqs,
    addToast,
    currentUser,
    setCurrentView,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'privacy'>('profile');

  if (!isProfileOpen) return null;

  const handleExportData = (format: 'json' | 'txt') => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user: {
        name: 'Executive User',
        email: 'user@company.internal',
        language: userLanguage,
      },
      savedItems,
      chatHistory: chatSessions,
    };

    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      filename = `ai-faq-assistant-export-${Date.now()}.json`;
    } else {
      const textContent = `AI FAQ ASSISTANT EXPORT
Date: ${new Date().toLocaleString()}
Language: ${userLanguage}

=== SAVED ITEMS (${savedItems.length}) ===
${savedItems
  .map(
    (item, i) =>
      `${i + 1}. [${item.type.toUpperCase()}] ${item.title}\n${item.snippet}\nSource: ${item.source || 'N/A'}\n`
  )
  .join('\n')}

=== CHAT SESSIONS (${chatSessions.length}) ===
${chatSessions
  .map(
    (s, i) =>
      `--- Session ${i + 1}: ${s.title} (${s.messages.length} messages) ---\n` +
      s.messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n')
  )
  .join('\n\n')}
`;
      blob = new Blob([textContent], { type: 'text/plain' });
      filename = `ai-faq-assistant-export-${Date.now()}.txt`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast('Data Exported', `Downloaded ${filename} successfully.`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsProfileOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Account & Settings
            </h3>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-1.5 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 pt-3 border-b border-neutral-100 dark:border-neutral-800 gap-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 text-xs font-semibold transition-colors relative ${
              activeTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
            }`}
          >
            Profile & Display
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-2.5 text-xs font-semibold transition-colors relative ${
              activeTab === 'ai'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
            }`}
          >
            AI Preferences
            {activeTab === 'ai' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 text-xs font-semibold transition-colors relative ${
              activeTab === 'privacy'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
            }`}
          >
            Privacy & Data
            {activeTab === 'privacy' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'profile' && (
            <>
              {/* User Overview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm border border-blue-500/20">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{currentUser ? currentUser.name.slice(0, 2).toUpperCase() : 'GU'}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                        {currentUser ? currentUser.name : 'Guest Visitor'}
                      </h4>
                      {currentUser?.role === 'admin' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                      {currentUser ? (currentUser.isAdmin ? 'Administrator Account' : currentUser.email) : 'Not signed in'}
                    </p>
                    <span className="inline-block mt-0.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      {currentUser ? (currentUser.role === 'admin' ? 'Full Administrator Access' : 'Verified Member') : 'Browse mode only'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {currentUser ? (
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setCurrentView('login');
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Appearance Mode */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Appearance
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                      theme === 'light'
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'border-neutral-200 dark:border-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                      theme === 'dark'
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'border-neutral-200 dark:border-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                      theme === 'system'
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'border-neutral-200 dark:border-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Laptop className="w-4 h-4" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Primary Assistant Language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setUserLanguage(lang.code)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                        userLanguage === lang.code
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 font-semibold text-blue-600 dark:text-blue-400'
                          : 'border-neutral-200 dark:border-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      <span className="text-[#6E6E73] dark:text-[#98989D] text-[11px]">
                        {lang.nativeName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'ai' && (
            <>
              {/* Response Length */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Response Length
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['concise', 'standard', 'detailed'] as const).map(style => (
                    <button
                      key={style}
                      onClick={() => updatePreferences({ responseStyle: style })}
                      className={`capitalize py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                        preferences.responseStyle === style
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                          : 'border-neutral-200 dark:border-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                  Standard delivers balanced answers with citations; concise provides quick 2-line summaries.
                </p>
              </div>

              {/* Assistant Tone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Personality Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['professional', 'friendly', 'simple'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => updatePreferences({ personality: p })}
                      className={`capitalize py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                        preferences.personality === p
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                          : 'border-neutral-200 dark:border-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Readback */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-[#6E6E73] dark:text-[#98989D]" />
                  <div>
                    <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      Auto-Read Voice Response
                    </p>
                    <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                      Play speech audio automatically after AI response finishes
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.voicePlayback}
                  onChange={e => updatePreferences({ voicePlayback: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              {/* Retain History Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Save Conversation History
                  </p>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                    Allow session memory across page reloads
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.retainChatHistory}
                  onChange={e => updatePreferences({ retainChatHistory: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Export Data */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Export Personal Data
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportData('json')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON Archive</span>
                  </button>
                  <button
                    onClick={() => handleExportData('txt')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Plain Text (.txt)</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                <label className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Data Reset & Erasure
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                  <div>
                    <p className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                      Clear All Conversations
                    </p>
                    <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                      Permanently wipes active and historical chats
                    </p>
                  </div>
                  <button
                    onClick={clearAllChats}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={() => setIsProfileOpen(false)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
