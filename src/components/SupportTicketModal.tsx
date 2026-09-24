import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { SupportTicket } from '../data/knowledgeBase.ts';
import { X, LifeBuoy, Paperclip, Send, CheckCircle2 } from 'lucide-react';

export const SupportTicketModal: React.FC = () => {
  const { isTicketModalOpen, setIsTicketModalOpen, createTicket, setCurrentView } = useApp();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Account & Login');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Medium');
  const [hasAttachment, setHasAttachment] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isTicketModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    createTicket(subject, description, category, priority);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsTicketModalOpen(false);
      setCurrentView('support');
      setSubject('');
      setDescription('');
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsTicketModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Submit Support Ticket
            </h3>
          </div>
          <button
            onClick={() => setIsTicketModalOpen(false)}
            className="p-1.5 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-in zoom-in-50 duration-200" />
            <h4 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Ticket Logged Successfully
            </h4>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
              Routing to the appropriate specialist team...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g., Unable to regenerate 2FA emergency keys"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden"
                >
                  <option value="Account & Login">Account & Login</option>
                  <option value="Payments & Billing">Payments & Billing</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Security & Auth">Security & Auth</option>
                  <option value="Orders & Subscriptions">Orders & Subscriptions</option>
                  <option value="Privacy & Data">Privacy & Data</option>
                  <option value="General Services">General Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as SupportTicket['priority'])}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden"
                >
                  <option value="Low">Low (General guidance)</option>
                  <option value="Medium">Medium (Standard request)</option>
                  <option value="High">High (Impacting operations)</option>
                  <option value="Urgent">Urgent (Service outage / locked)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1.5">
                Detailed Description
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Please describe what happened, any error messages displayed, and steps you already tried..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setHasAttachment(!hasAttachment)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  hasAttachment
                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'border-neutral-200 dark:border-neutral-800 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F]'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>{hasAttachment ? 'diagnostics_screenshot.png (attached)' : 'Attach Screenshot'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
