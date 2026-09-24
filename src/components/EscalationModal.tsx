import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, LifeBuoy, MessageSquare, Mail, HelpCircle, ArrowRight } from 'lucide-react';

export const EscalationModal: React.FC = () => {
  const {
    isEscalationModalOpen,
    setIsEscalationModalOpen,
    escalationQuery,
    setIsTicketModalOpen,
    setCurrentView,
    addToast,
  } = useApp();

  if (!isEscalationModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsEscalationModalOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Need Human Support?
            </h3>
          </div>
          <button
            onClick={() => setIsEscalationModalOpen(false)}
            className="p-1.5 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
            {escalationQuery ? (
              <>
                For your question <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">"{escalationQuery}"</span>, our knowledge base does not have a verified match. How would you like to proceed?
              </>
            ) : (
              'Our human specialist advocacy team is ready to assist you directly.'
            )}
          </p>

          <div className="space-y-2.5">
            {/* Create Ticket */}
            <button
              onClick={() => {
                setIsEscalationModalOpen(false);
                setIsTicketModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Create a Support Ticket
                  </h4>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                    Average first-response SLA under 18 minutes
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Live Chat */}
            <button
              onClick={() => {
                setIsEscalationModalOpen(false);
                setCurrentView('chat');
                addToast('Live Chat Connected', 'You are connected to our tier-2 automated escalation pipeline.', 'info');
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Live Specialist Queue
                  </h4>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                    Direct chat with support agent available now
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-emerald-600 transition-colors" />
            </button>

            {/* Email Support */}
            <button
              onClick={() => {
                setIsEscalationModalOpen(false);
                navigator.clipboard.writeText('support@company.internal');
                addToast('Email Copied', 'support@company.internal copied to clipboard', 'success');
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Email Support
                  </h4>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                    support@company.internal (Click to copy)
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-purple-600 transition-colors" />
            </button>

            {/* Browse FAQs */}
            <button
              onClick={() => {
                setIsEscalationModalOpen(false);
                setCurrentView('faqs');
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[#6E6E73] dark:text-[#98989D] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Browse All FAQs
                  </h4>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                    Search directory by topic or keyword
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
