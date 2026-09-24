import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const FaqDetailView: React.FC = () => {
  const {
    selectedFaqId,
    setCurrentView,
    faqs,
    toggleSaveFaq,
    isFaqSaved,
    rateFaq,
    askQuestionInChat,
    setSelectedSourceForModal,
    viewFaqDetail,
    addToast,
  } = useApp();

  const faq = faqs.find(f => f.id === selectedFaqId) || faqs[0];

  if (!faq) {
    return (
      <div className="text-center py-20">
        <p className="text-xs text-[#6E6E73]">FAQ article not found.</p>
        <button
          onClick={() => setCurrentView('faqs')}
          className="mt-3 text-xs text-blue-600 font-medium"
        >
          Return to FAQs
        </button>
      </div>
    );
  }

  const isSaved = isFaqSaved(faq.id);

  const handleShare = () => {
    const text = `FAQ: ${faq.question}\n\n${faq.answer}`;
    if (navigator.share) {
      navigator.share({ title: faq.question, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      addToast('Copied', 'Article link copied to clipboard.', 'success');
    }
  };

  const relatedFaqs = (faq.relatedFaqIds || [])
    .map(id => faqs.find(f => f.id === id))
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-4">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('faqs')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to FAQs</span>
      </button>

      {/* Main Article Container */}
      <article className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/80 dark:border-[#38383A] shadow-xl space-y-6">
        {/* Category & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="uppercase font-semibold tracking-wider text-blue-600 dark:text-blue-400 text-xs">
              {faq.category}
            </span>
            <span>·</span>
            <span className="text-[#6E6E73] dark:text-[#98989D] tabular-nums">
              {faq.views} views
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveFaq(faq)}
              className={`p-2 rounded-xl transition-colors ${
                isSaved
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              title={isSaved ? 'Remove bookmark' : 'Bookmark this article'}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Title */}
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight">
          {faq.question}
        </h1>

        {/* Executive Summary */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
          <span className="font-semibold block mb-1">Executive Summary:</span>
          {faq.shortAnswer}
        </div>

        {/* Full Comprehensive Answer */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#1D1D1F] dark:text-[#F5F5F7] whitespace-pre-line space-y-4">
          {faq.answer}
        </div>

        {/* Source Citation Box */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {faq.sourceDocument}
              </p>
              <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                Verified by {faq.author} · Last updated {faq.lastUpdated}
              </p>
            </div>
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
            className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 flex items-center gap-1.5"
          >
            <span>Inspect Verification Citation</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Helpfulness Feedback */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
              Was this answer helpful?
            </span>
            <button
              onClick={() => rateFaq(faq.id, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Yes ({faq.helpfulCount})</span>
            </button>
            <button
              onClick={() => rateFaq(faq.id, false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
              <span>No ({faq.unhelpfulCount})</span>
            </button>
          </div>

          <button
            onClick={() => askQuestionInChat(`Explain in more detail: "${faq.question}"`)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl shadow-xs flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Follow-up Questions</span>
          </button>
        </div>
      </article>

      {/* Related Questions Section */}
      {relatedFaqs.length > 0 && (
        <section className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedFaqs.map(rel => (
              <div
                key={rel!.id}
                onClick={() => viewFaqDetail(rel!.id)}
                className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 cursor-pointer transition-colors"
              >
                <span className="text-[10px] font-semibold text-blue-600 uppercase">
                  {rel!.category}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
                  {rel!.question}
                </h4>
                <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1 line-clamp-2">
                  {rel!.shortAnswer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
