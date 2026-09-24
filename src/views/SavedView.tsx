import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Bookmark,
  Sparkles,
  Trash2,
  Download,
  Search,
  ExternalLink,
  Share2,
  FileText,
} from 'lucide-react';

export const SavedView: React.FC = () => {
  const {
    savedItems,
    removeSavedItem,
    viewFaqDetail,
    askQuestionInChat,
    addToast,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'faq' | 'ai-answer'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = savedItems.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleExport = (format: 'json' | 'txt') => {
    if (savedItems.length === 0) {
      addToast('No Items', 'Your saved collection is currently empty.', 'warning');
      return;
    }

    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      blob = new Blob([JSON.stringify(savedItems, null, 2)], { type: 'application/json' });
      filename = `saved-faqs-${Date.now()}.json`;
    } else {
      const text = `SAVED KNOWLEDGE ITEMS (${savedItems.length})\n\n` +
        savedItems
          .map(
            (item, i) =>
              `${i + 1}. [${item.type.toUpperCase()}] ${item.title}\nSaved on: ${item.savedAt}\n${item.snippet}\nSource: ${item.source || 'Knowledge Base'}\n`
          )
          .join('\n---\n\n');
      blob = new Blob([text], { type: 'text/plain' });
      filename = `saved-faqs-${Date.now()}.txt`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast('Collection Exported', `Downloaded ${filename}`, 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Personal Repository
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
            Saved Knowledge
          </h1>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
            Your collection of bookmarked FAQs and saved AI answers.
          </p>
        </div>

        {/* Export Buttons */}
        {savedItems.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1C1E] text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => handleExport('txt')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1C1E] text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export TXT</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white dark:bg-[#1C1C1E] text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-[#6E6E73] dark:text-[#98989D]'
            }`}
          >
            All Items ({savedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'faq'
                ? 'bg-white dark:bg-[#1C1C1E] text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-[#6E6E73] dark:text-[#98989D]'
            }`}
          >
            Saved FAQs ({savedItems.filter(i => i.type === 'faq').length})
          </button>
          <button
            onClick={() => setActiveTab('ai-answer')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'ai-answer'
                ? 'bg-white dark:bg-[#1C1C1E] text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-[#6E6E73] dark:text-[#98989D]'
            }`}
          >
            AI Answers ({savedItems.filter(i => i.type === 'ai-answer').length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search within saved..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 space-y-3">
            <Bookmark className="w-8 h-8 text-[#6E6E73] mx-auto opacity-50" />
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              No saved items yet
            </h3>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] max-w-sm mx-auto">
              Bookmark useful FAQs or save high-confidence AI answers to access them quickly here.
            </p>
            <button
              onClick={() => setCurrentView('faqs')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl"
            >
              Browse FAQs
            </button>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs hover:shadow-xs transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md ${
                      item.type === 'faq'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                    }`}
                  >
                    {item.type === 'faq' ? 'Verified FAQ' : 'AI Verified Answer'}
                  </span>
                  {item.category && (
                    <span className="text-[#6E6E73] text-[11px] uppercase">
                      · {item.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#6E6E73] dark:text-[#98989D] mr-2">
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => removeSavedItem(item.id)}
                    className="p-1.5 text-[#6E6E73] hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {item.title}
              </h3>

              <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed line-clamp-3">
                {item.snippet}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D] truncate">
                  Source: {item.source || 'Verified Knowledge Base'}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {item.faqId && (
                    <button
                      onClick={() => viewFaqDetail(item.faqId!)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:underline"
                    >
                      View Article
                    </button>
                  )}
                  <button
                    onClick={() => askQuestionInChat(`Regarding: "${item.title}" - ${item.snippet}`)}
                    className="px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7] text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
