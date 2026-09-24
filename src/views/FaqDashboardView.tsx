import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { FAQ_CATEGORIES } from '../data/knowledgeBase.ts';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Share2,
  FileText,
  Clock,
  ArrowUpDown,
  Filter,
  Check,
} from 'lucide-react';

export const FaqDashboardView: React.FC = () => {
  const {
    faqs,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    toggleSaveFaq,
    isFaqSaved,
    rateFaq,
    viewFaqDetail,
    askQuestionInChat,
    setSelectedSourceForModal,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqIds, setExpandedFaqIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'helpful' | 'views' | 'newest' | 'alphabetical'>('views');

  const toggleExpand = (id: string) => {
    setExpandedFaqIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedFaqIds(new Set(filteredFaqs.map(f => f.id)));
  };

  const collapseAll = () => {
    setExpandedFaqIds(new Set());
  };

  // Filter & Sort
  const filteredFaqs = useMemo(() => {
    let list = [...faqs];

    // Filter by category
    if (selectedCategoryFilter !== 'all') {
      list = list.filter(f => f.category === selectedCategoryFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        f =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.keywords.some(k => k.toLowerCase().includes(q)) ||
          f.sourceDocument.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'helpful') {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else if (sortBy === 'views') {
      list.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    } else if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.question.localeCompare(b.question));
    }

    return list;
  }, [faqs, selectedCategoryFilter, searchQuery, sortBy]);

  const handleShare = (faq: any) => {
    const text = `FAQ: ${faq.question}\n\n${faq.answer}\n\nSource: ${faq.sourceDocument}`;
    if (navigator.share) {
      navigator.share({ title: faq.question, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      addToast('Copied', 'FAQ answer copied to clipboard.', 'success');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pt-6">
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Knowledge Repository
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-1 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
          Search answers directly or filter by topic. Every answer is grounded in verified operational guides.
        </p>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6E6E73] dark:text-[#98989D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by question, topic, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#98989D] focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#6E6E73] hover:text-[#1D1D1F] absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] text-xs shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6E6E73]" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden cursor-pointer"
            >
              <option value="views">Most Viewed</option>
              <option value="helpful">Most Helpful</option>
              <option value="newest">Newest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <button
            onClick={expandedFaqIds.size === filteredFaqs.length ? collapseAll : expandAll}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            {expandedFaqIds.size === filteredFaqs.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
            selectedCategoryFilter === 'all'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white dark:bg-[#1C1C1E] text-[#6E6E73] dark:text-[#98989D] border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50'
          }`}
        >
          All Topics ({faqs.length})
        </button>

        {FAQ_CATEGORIES.map(cat => {
          const count = faqs.filter(f => f.category === cat.slug).length;
          const isSelected = selectedCategoryFilter === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-[#1C1C1E] text-[#6E6E73] dark:text-[#98989D] border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAQs ACCORDION LIST */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 space-y-3">
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
              No FAQs matched your filter criteria "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isExpanded = expandedFaqIds.has(faq.id);
            const isSaved = isFaqSaved(faq.id);

            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs overflow-hidden transition-all duration-150"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(faq.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      Q
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-wider">
                          {faq.category}
                        </span>
                        <span className="text-[10px] text-[#6E6E73] dark:text-[#98989D] tabular-nums">
                          · {faq.views} views
                        </span>
                        {faq.status === 'Published' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                            Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] leading-snug">
                        {faq.question}
                      </h3>
                      {!isExpanded && (
                        <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1 line-clamp-1">
                          {faq.shortAnswer}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleSaveFaq(faq);
                      }}
                      className={`p-2 rounded-xl transition-colors ${
                        isSaved
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50'
                          : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                      title={isSaved ? 'Remove bookmark' : 'Bookmark FAQ'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <div className="p-1 text-[#6E6E73]">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-neutral-100 dark:border-neutral-800/80 space-y-4 animate-in fade-in duration-150">
                    {/* Full Answer text */}
                    <div className="text-xs sm:text-sm text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed pt-3">
                      {faq.answer}
                    </div>

                    {/* Source metadata card */}
                    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-[#6E6E73] dark:text-[#98989D]">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Source: <strong className="text-[#1D1D1F] dark:text-[#F5F5F7]">{faq.sourceDocument}</strong></span>
                        <span>·</span>
                        <Clock className="w-3 h-3" />
                        <span>Updated {faq.lastUpdated}</span>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedSourceForModal({
                            id: faq.id,
                            title: faq.question,
                            category: faq.category,
                            document: faq.sourceDocument,
                            lastUpdated: faq.lastUpdated,
                          })
                        }
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Inspect Source Citation
                      </button>
                    </div>

                    {/* Related Questions Chips */}
                    {faq.relatedFaqIds && faq.relatedFaqIds.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider">
                          Related Questions:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {faq.relatedFaqIds.map(relId => {
                            const rel = faqs.find(f => f.id === relId);
                            if (!rel) return null;
                            return (
                              <button
                                key={relId}
                                onClick={() => viewFaqDetail(rel.id)}
                                className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[#1D1D1F] dark:text-[#F5F5F7] hover:text-blue-600 transition-colors"
                              >
                                {rel.question}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Footer */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-[#6E6E73] dark:text-[#98989D] text-[11px]">
                          Was this helpful?
                        </span>
                        <button
                          onClick={() => rateFaq(faq.id, true)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3 text-emerald-600" />
                          <span>Yes ({faq.helpfulCount})</span>
                        </button>
                        <button
                          onClick={() => rateFaq(faq.id, false)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] transition-colors"
                        >
                          <ThumbsDown className="w-3 h-3 text-rose-500" />
                          <span>No ({faq.unhelpfulCount})</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShare(faq)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                          title="Share FAQ"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => askQuestionInChat(`Explain in detail: "${faq.question}"`)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ask AI About This</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
