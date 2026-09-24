import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { SupportTicket } from '../data/knowledgeBase.ts';
import {
  LifeBuoy,
  Plus,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  User,
  Shield,
  ArrowLeft,
} from 'lucide-react';

export const SupportTicketsView: React.FC = () => {
  const { tickets, createTicket, replyToTicket, updateTicketStatus, setIsTicketModalOpen } = useApp();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [replyText, setReplyText] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;

    replyToTicket(selectedTicketId, replyText.trim(), 'user');
    setReplyText('');
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'Waiting for User':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'Urgent':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-200';
      case 'High':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200';
      case 'Medium':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200';
      case 'Low':
        return 'text-neutral-600 bg-neutral-50 dark:bg-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Customer Advocacy
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
            Support Tickets
          </h1>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
            Track escalation inquiries submitted to our human specialist team.
          </p>
        </div>

        <button
          onClick={() => setIsTicketModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Tickets Master-Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Your Tickets ({tickets.length})
            </span>
            <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
              Avg response: 18m
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
            {tickets.map(ticket => {
              const isSelected = ticket.id === selectedTicketId;

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 shadow-2xs'
                      : 'bg-white dark:bg-[#1C1C1E] border-[#D2D2D7]/70 dark:border-[#38383A] hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-semibold text-[#6E6E73] dark:text-[#98989D]">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadge(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] line-clamp-1">
                    {ticket.subject}
                  </h3>

                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-1 line-clamp-2">
                    {ticket.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[10px] text-[#6E6E73] dark:text-[#98989D]">
                    <span
                      className={`px-1.5 py-0.2 rounded border font-medium ${getPriorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                    <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Ticket Thread (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] rounded-3xl shadow-lg p-6 flex flex-col min-h-[500px]">
          {selectedTicket ? (
            <div className="flex flex-col h-full space-y-6">
              {/* Ticket Top bar */}
              <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span>·</span>
                    <span className="text-xs text-[#6E6E73]">{selectedTicket.category}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {selectedTicket.subject}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status}
                  </span>

                  {selectedTicket.status !== 'Resolved' ? (
                    <button
                      onClick={() => updateTicketStatus(selectedTicket.id, 'Resolved')}
                      className="px-3 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => updateTicketStatus(selectedTicket.id, 'In Progress')}
                      className="px-3 py-1 text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-xl hover:bg-neutral-50"
                    >
                      Reopen Ticket
                    </button>
                  )}
                </div>
              </div>

              {/* Conversation Messages Thread */}
              <div className="flex-1 overflow-y-auto space-y-4 max-h-[380px] pr-2">
                {selectedTicket.responses.map(resp => {
                  const isUser = resp.sender === 'user';

                  return (
                    <div
                      key={resp.id}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                          <Shield className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-lg p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-tr-xs'
                            : 'bg-neutral-100 dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] rounded-tl-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1.5">
                          <span className="font-semibold">{resp.senderName}</span>
                          <span>{new Date(resp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="whitespace-pre-line">{resp.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply to the assigned support specialist..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-12 text-[#6E6E73] text-xs">
              Select a ticket to inspect correspondence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
