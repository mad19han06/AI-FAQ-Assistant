import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Search, Sparkles, HelpCircle, Bookmark, History, LifeBuoy, Shield, ArrowRight, CornerDownLeft, LogIn } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    faqs,
    viewFaqDetail,
    askQuestionInChat,
    setCurrentView,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Search logic
  const cleanQ = query.trim().toLowerCase();

  // Quick actions
  const defaultActions = [
    {
      id: 'act-ask',
      title: 'Ask AI Assistant a question',
      subtitle: 'Natural language query with verified citations',
      icon: Sparkles,
      action: () => {
        setIsCommandPaletteOpen(false);
        askQuestionInChat(cleanQ.replace(/^\/ask\s*/, '') || 'How can I get started?');
      },
    },
    {
      id: 'act-faqs',
      title: 'Browse all FAQs',
      subtitle: 'Explore categorized knowledge base articles',
      icon: HelpCircle,
      action: () => {
        setIsCommandPaletteOpen(false);
        setCurrentView('faqs');
      },
    },
    {
      id: 'act-saved',
      title: 'View Saved FAQs & Answers',
      subtitle: 'Review bookmarked questions',
      icon: Bookmark,
      action: () => {
        setIsCommandPaletteOpen(false);
        setCurrentView('saved');
      },
    },
    {
      id: 'act-history',
      title: 'Open Chat History',
      subtitle: 'Previous AI conversations',
      icon: History,
      action: () => {
        setIsCommandPaletteOpen(false);
        setCurrentView('history');
      },
    },
    {
      id: 'act-support',
      title: 'Customer Support Tickets',
      subtitle: 'Check ticket status or request escalation',
      icon: LifeBuoy,
      action: () => {
        setIsCommandPaletteOpen(false);
        setCurrentView('support');
      },
    },
    {
      id: 'act-admin',
      title: 'Open Admin Portal',
      subtitle: 'Knowledge base, analytics, unanswered queries',
      icon: Shield,
      action: () => {
        setIsCommandPaletteOpen(false);
        setCurrentView('admin');
      },
    },
    {
      id: 'act-login',
      title: 'Sign In / Account Access',
      subtitle: 'Login as Administrator or Standard Member',
      icon: LogIn,
      action: () => {
        setIsCommandPaletteOpen(false);
        setCurrentView('login');
      },
    },
  ];

  // Filtered FAQs
  const matchingFaqs = cleanQ
    ? faqs.filter(
        f =>
          f.question.toLowerCase().includes(cleanQ) ||
          f.shortAnswer.toLowerCase().includes(cleanQ) ||
          f.keywords.some(k => k.toLowerCase().includes(cleanQ)) ||
          f.category.toLowerCase().includes(cleanQ)
      ).slice(0, 6)
    : [];

  const items = cleanQ
    ? [
        {
          id: 'custom-ask',
          title: `Ask AI: "${cleanQ}"`,
          subtitle: 'Generate intelligent verified answer with sources',
          icon: Sparkles,
          action: () => {
            setIsCommandPaletteOpen(false);
            askQuestionInChat(cleanQ);
          },
        },
        ...matchingFaqs.map(f => ({
          id: f.id,
          title: f.question,
          subtitle: `${f.category.toUpperCase()} · ${f.shortAnswer.slice(0, 85)}...`,
          icon: HelpCircle,
          action: () => {
            setIsCommandPaletteOpen(false);
            viewFaqDetail(f.id);
          },
        })),
      ]
    : defaultActions;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800">
          <Search className="w-5 h-5 text-[#6E6E73] dark:text-[#98989D] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search FAQs, type /ask, /saved, or a question..."
            className="w-full bg-transparent text-sm text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#98989D] focus:outline-hidden"
          />
          <kbd className="text-[10px] font-mono text-[#6E6E73] dark:text-[#98989D] bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-neutral-100 dark:divide-neutral-800/40">
          {items.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6E6E73] dark:text-[#98989D]">
              No matching FAQs found. Press Enter to ask the AI assistant.
            </div>
          ) : (
            items.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-[#6E6E73] dark:text-[#98989D]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{item.title}</p>
                      <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <CornerDownLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-[#6E6E73] dark:text-[#98989D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>esc Dismiss</span>
          </div>
          <span>Grounded in {faqs.length} verified FAQs</span>
        </div>
      </div>
    </div>
  );
};
