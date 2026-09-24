import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, FileText, CheckCircle, Calendar, Sparkles, ExternalLink } from 'lucide-react';

export const SourceViewerModal: React.FC = () => {
  const {
    selectedSourceForModal,
    setSelectedSourceForModal,
    viewFaqDetail,
    askQuestionInChat,
    faqs,
  } = useApp();

  if (!selectedSourceForModal) return null;

  const matchingFaq = faqs.find(f => f.id === selectedSourceForModal.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setSelectedSourceForModal(null)}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Knowledge Source Citation
            </h3>
          </div>
          <button
            onClick={() => setSelectedSourceForModal(null)}
            className="p-1.5 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Verification Banner */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium">
              Verified Knowledge Base Content · PCI-DSS & SOC2 Certified
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {selectedSourceForModal.category}
            </span>
            <h4 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mt-0.5">
              {selectedSourceForModal.title}
            </h4>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-xs">
            <div>
              <span className="text-[#6E6E73] dark:text-[#98989D] block text-[11px]">
                Underlying Document
              </span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] truncate block">
                {selectedSourceForModal.document}
              </span>
            </div>
            <div>
              <span className="text-[#6E6E73] dark:text-[#98989D] block text-[11px]">
                Last Synchronized
              </span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#6E6E73]" />
                <span>{selectedSourceForModal.lastUpdated}</span>
              </span>
            </div>
          </div>

          {/* Knowledge passage */}
          {matchingFaq && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Original Knowledge Excerpt
              </span>
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-xs leading-relaxed text-[#1D1D1F] dark:text-[#F5F5F7]">
                {matchingFaq.answer}
              </div>
            </div>
          )}

          {/* Distinction Explainer */}
          <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
            The AI assistant synthesizes answers using semantic vector similarity against verified documents. Only approved editorial passages are incorporated into answer formation.
          </p>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-2">
            {matchingFaq && (
              <button
                onClick={() => {
                  setSelectedSourceForModal(null);
                  viewFaqDetail(matchingFaq.id);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in FAQ Directory</span>
              </button>
            )}
            <button
              onClick={() => {
                const q = selectedSourceForModal.title;
                setSelectedSourceForModal(null);
                askQuestionInChat(`Can you tell me more about: "${q}"?`);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI About This</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
