import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AdminTab } from '../types.ts';
import { FAQItem, KnowledgeDocument, FAQ_CATEGORIES } from '../data/knowledgeBase.ts';
import {
  LayoutDashboard,
  FileQuestion,
  HelpCircle,
  Database,
  Play,
  MessageSquareHeart,
  LifeBuoy,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Edit,
  Copy,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Send,
  Sliders,
  Check,
  X,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    knowledgeDocs,
    addKnowledgeDoc,
    updateKnowledgeDoc,
    unansweredQuestions,
    convertUnansweredToFaq,
    ignoreUnansweredQuestion,
    tickets,
    updateTicketStatus,
    replyToTicket,
    addToast,
    currentUser,
    setCurrentView,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // FAQ Modal state
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    shortAnswer: '',
    answer: '',
    category: 'account',
    status: 'Published' as FAQItem['status'],
    keywords: '',
    sourceDocument: 'Operations Manual 2026',
  });

  // Knowledge Doc Modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docForm, setDocForm] = useState({
    name: '',
    type: 'PDF Document' as KnowledgeDocument['type'],
    size: '1.2 MB',
    chunksCount: 24,
    category: 'General',
    urlOrFilename: 'document.pdf',
  });

  // Playground state
  const [playgroundQuery, setPlaygroundQuery] = useState('How can I export my account data?');
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [isPlaygroundLoading, setIsPlaygroundLoading] = useState(false);

  // Search in FAQs tab
  const [faqSearch, setFaqSearch] = useState('');

  // Stats calculation
  const totalFaqs = faqs.length;
  const publishedFaqs = faqs.filter(f => f.status === 'Published').length;
  const inReviewFaqs = faqs.filter(f => f.status === 'Review' || f.status === 'Draft').length;
  const totalHelpful = faqs.reduce((acc, curr) => acc + curr.helpfulCount, 0);
  const totalUnhelpful = faqs.reduce((acc, curr) => acc + curr.unhelpfulCount, 0);
  const helpfulRate = totalHelpful + totalUnhelpful > 0
    ? Math.round((totalHelpful / (totalHelpful + totalUnhelpful)) * 100)
    : 98;
  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  // Handle FAQ form submit
  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    const keywordsArray = faqForm.keywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    if (editingFaqId) {
      updateFaq(editingFaqId, {
        question: faqForm.question,
        shortAnswer: faqForm.shortAnswer || faqForm.answer.slice(0, 110) + '...',
        answer: faqForm.answer,
        category: faqForm.category,
        status: faqForm.status,
        keywords: keywordsArray,
        sourceDocument: faqForm.sourceDocument,
      });
    } else {
      addFaq({
        question: faqForm.question,
        shortAnswer: faqForm.shortAnswer || faqForm.answer.slice(0, 110) + '...',
        answer: faqForm.answer,
        category: faqForm.category,
        status: faqForm.status,
        keywords: keywordsArray,
        relatedFaqIds: [],
        sourceDocument: faqForm.sourceDocument,
        sourceDocId: 'doc-manual',
        author: 'Lead Administrator',
      });
    }

    setIsFaqModalOpen(false);
    setEditingFaqId(null);
  };

  const openCreateFaq = () => {
    setEditingFaqId(null);
    setFaqForm({
      question: '',
      shortAnswer: '',
      answer: '',
      category: 'account',
      status: 'Published',
      keywords: '',
      sourceDocument: 'Operations Manual 2026',
    });
    setIsFaqModalOpen(true);
  };

  const openEditFaq = (f: FAQItem) => {
    setEditingFaqId(f.id);
    setFaqForm({
      question: f.question,
      shortAnswer: f.shortAnswer,
      answer: f.answer,
      category: f.category,
      status: f.status,
      keywords: f.keywords.join(', '),
      sourceDocument: f.sourceDocument,
    });
    setIsFaqModalOpen(true);
  };

  const duplicateFaq = (f: FAQItem) => {
    addFaq({
      question: `${f.question} (Copy)`,
      shortAnswer: f.shortAnswer,
      answer: f.answer,
      category: f.category,
      status: 'Draft',
      keywords: f.keywords,
      relatedFaqIds: f.relatedFaqIds,
      sourceDocument: f.sourceDocument,
      sourceDocId: f.sourceDocId,
      author: 'Lead Administrator',
    });
  };

  // Test Playground Run
  const handleTestPlayground = async () => {
    if (!playgroundQuery.trim()) return;
    setIsPlaygroundLoading(true);

    try {
      const res = await fetch('/api/ai/test-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: playgroundQuery.trim() }),
      });

      const data = await res.json();
      setPlaygroundResult(data);
    } catch {
      setPlaygroundResult({
        answer: 'Failed to connect to testing endpoint.',
        confidence: 'low',
        confidenceLabel: 'Error',
        responseTimeMs: 0,
      });
    } finally {
      setIsPlaygroundLoading(false);
    }
  };

  // If user is not authenticated as administrator, show the admin access gate
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              Administrator Sign-In Required
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D]">
              This console is restricted to verified administrators. Please sign in with administrator credentials to manage verified knowledge documents and FAQs.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setCurrentView('login')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Go to Login Page</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('landing')}
              className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] text-xs font-medium transition-colors cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 pt-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-emerald-300 uppercase">
              Admin & Editorial Console
            </span>
            <span className="text-xs text-neutral-400">• Signed in as {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Knowledge Management Portal
          </h1>
          <p className="text-xs text-neutral-400">
            Control grounded knowledge sources, verify responses, inspect unanswered queries, and monitor satisfaction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('login')}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-xl transition-colors"
            title="Account details"
          >
            Switch Account
          </button>
          <button
            onClick={openCreateFaq}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New FAQ</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-200 dark:border-neutral-800">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'faqs', label: 'FAQ Directory', icon: FileQuestion, badge: totalFaqs },
          { id: 'unanswered', label: 'Unanswered Queries', icon: HelpCircle, badge: unansweredQuestions.filter(q => q.status === 'New' || q.status === 'Under Review').length },
          { id: 'knowledge-base', label: 'Knowledge Sources', icon: Database, badge: knowledgeDocs.length },
          { id: 'playground', label: 'AI Playground', icon: Play },
          { id: 'feedback', label: 'User Feedback', icon: MessageSquareHeart },
          { id: 'tickets', label: 'Support Tickets', icon: LifeBuoy, badge: openTicketsCount },
          { id: 'audit', label: 'Security & Audit', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
                  : 'border-transparent text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs">
              <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D] font-medium">
                Total Knowledge FAQs
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-mono text-3xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                  {totalFaqs}
                </span>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>{publishedFaqs} Live</span>
                </span>
              </div>
              <p className="text-[10px] text-[#6E6E73] mt-1">{inReviewFaqs} in approval review</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs">
              <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D] font-medium">
                Helpful Rating
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-mono text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {helpfulRate}%
                </span>
                <span className="text-xs text-[#6E6E73]">{totalHelpful} positive</span>
              </div>
              <p className="text-[10px] text-[#6E6E73] mt-1">{totalUnhelpful} unhelpful reports</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs">
              <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D] font-medium">
                Unanswered Queries
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-mono text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {unansweredQuestions.filter(q => q.status === 'New' || q.status === 'Under Review').length}
                </span>
                <span className="text-xs text-amber-600 font-medium">Needs FAQ</span>
              </div>
              <p className="text-[10px] text-[#6E6E73] mt-1">High user demand</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs">
              <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D] font-medium">
                Active Support Escalations
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-mono text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {openTicketsCount}
                </span>
                <span className="text-xs text-blue-600 font-medium">18m SLA</span>
              </div>
              <p className="text-[10px] text-[#6E6E73] mt-1">Specialist queue active</p>
            </div>
          </div>

          {/* Categories distribution breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Knowledge Base Category Distribution
            </h3>

            <div className="space-y-3">
              {FAQ_CATEGORIES.map(cat => {
                const count = faqs.filter(f => f.category === cat.slug).length;
                const pct = totalFaqs > 0 ? Math.round((count / totalFaqs) * 100) : 0;

                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                        {cat.name}
                      </span>
                      <span className="text-[#6E6E73] tabular-nums font-mono">
                        {count} articles ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FAQ DIRECTORY MANAGEMENT */}
      {activeTab === 'faqs' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearch}
                onChange={e => setFaqSearch(e.target.value)}
                placeholder="Filter FAQs by question, answer, or keywords..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden"
              />
            </div>
            <button
              onClick={openCreateFaq}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] rounded-2xl shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-100 dark:border-neutral-800 text-[#6E6E73]">
                <tr>
                  <th className="p-3.5">Question & Summary</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Views / Helpful</th>
                  <th className="p-3.5">Source Doc</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {faqs
                  .filter(
                    f =>
                      !faqSearch ||
                      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
                      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
                  )
                  .map(faq => (
                    <tr key={faq.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="p-3.5 max-w-xs">
                        <p className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] line-clamp-1">
                          {faq.question}
                        </p>
                        <p className="text-[11px] text-[#6E6E73] truncate mt-0.5">
                          {faq.shortAnswer}
                        </p>
                      </td>
                      <td className="p-3.5">
                        <span className="uppercase text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                          {faq.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            faq.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : faq.status === 'Review'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          {faq.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-[#6E6E73] tabular-nums">
                        {faq.views} v · {faq.helpfulCount} 👍
                      </td>
                      <td className="p-3.5 text-[11px] text-[#6E6E73] truncate max-w-xs">
                        {faq.sourceDocument}
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => openEditFaq(faq)}
                          className="p-1.5 text-[#6E6E73] hover:text-[#1D1D1F] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateFaq(faq)}
                          className="p-1.5 text-[#6E6E73] hover:text-[#1D1D1F] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteFaq(faq.id)}
                          className="p-1.5 text-[#6E6E73] hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: UNANSWERED QUESTIONS */}
      {activeTab === 'unanswered' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <p>
              These queries were asked by users where the AI assistant had low confidence or information not found. Convert them into verified FAQs to close knowledge gaps.
            </p>
          </div>

          <div className="space-y-3">
            {unansweredQuestions.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-semibold text-blue-600">
                      {item.categorySuggestion}
                    </span>
                    <span>·</span>
                    <span className="text-[10px] text-[#6E6E73] tabular-nums font-mono">
                      Asked {item.frequency} times
                    </span>
                    <span>·</span>
                    <span className="text-[10px] text-[#6E6E73]">Last: {item.date}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    "{item.question}"
                  </h4>
                  <span
                    className={`inline-block mt-1 text-[10px] px-2 py-0.2 rounded-full font-medium ${
                      item.status === 'New' || item.status === 'Under Review'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'Converted to FAQ'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {(item.status === 'New' || item.status === 'Under Review') && (
                    <>
                      <button
                        onClick={() => convertUnansweredToFaq(item.id, item.question, item.categorySuggestion)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create FAQ Draft</span>
                      </button>
                      <button
                        onClick={() => ignoreUnansweredQuestion(item.id)}
                        className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 text-xs text-[#6E6E73] hover:text-[#1D1D1F] rounded-xl"
                      >
                        Ignore
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: KNOWLEDGE BASE REPOSITORIES */}
      {activeTab === 'knowledge-base' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Knowledge Sources & Documents
              </h3>
              <p className="text-xs text-[#6E6E73]">
                All vector chunks used by the Gemini semantic grounding pipeline.
              </p>
            </div>

            <button
              onClick={() => setIsDocModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Index New Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeDocs.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 font-semibold">
                      {doc.type}
                    </span>
                    <h4 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
                      {doc.name}
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                    {doc.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-[#6E6E73]">
                  <div>
                    <span className="text-[10px] block">Size</span>
                    <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">{doc.size}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Chunks</span>
                    <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] font-mono">
                      {doc.chunksCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Last Indexed</span>
                    <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">{doc.lastIndexed}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#6E6E73]">
                    SOC2 Compliant · Freshness Verified
                  </span>
                  <button
                    onClick={() => {
                      updateKnowledgeDoc(doc.id, {
                        lastIndexed: new Date().toISOString().split('T')[0],
                      });
                      addToast('Re-indexed', `Re-indexed ${doc.name} successfully.`, 'success');
                    }}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-index Chunks</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI TESTING PLAYGROUND */}
      {activeTab === 'playground' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-lg space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              AI Response Testing Playground
            </h3>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
              Inspect live grounding confidence, source citations, latency, and tone compliance before deploying new FAQs.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Test Question / Prompt
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={playgroundQuery}
                onChange={e => setPlaygroundQuery(e.target.value)}
                placeholder="Enter sample question..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden"
              />
              <button
                onClick={handleTestPlayground}
                disabled={isPlaygroundLoading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl flex items-center gap-2 transition-colors shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isPlaygroundLoading ? 'Testing...' : 'Execute Test'}</span>
              </button>
            </div>
          </div>

          {playgroundResult && (
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Evaluated Response
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                    {playgroundResult.responseTimeMs}ms
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      playgroundResult.confidence === 'high'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {playgroundResult.confidenceLabel || playgroundResult.confidence}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-700 text-xs leading-relaxed text-[#1D1D1F] dark:text-[#F5F5F7]">
                {playgroundResult.answer}
              </div>

              {playgroundResult.source && (
                <div className="text-xs text-[#6E6E73] flex items-center gap-2">
                  <span>Matched Source:</span>
                  <strong className="text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {playgroundResult.source.title}
                  </strong>
                  <span>({playgroundResult.source.document})</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => addToast('Flagged', 'Prompt flagged for editorial revision.', 'warning')}
                  className="px-3 py-1.5 text-xs text-rose-600 border border-rose-200 dark:border-rose-900 rounded-xl"
                >
                  Flag Answer
                </button>
                <button
                  onClick={() => addToast('Approved', 'Response validated and approved.', 'success')}
                  className="px-4 py-1.5 text-xs bg-emerald-600 text-white font-medium rounded-xl"
                >
                  Approve Reliability
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: FEEDBACK & ACCURACY */}
      {activeTab === 'feedback' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 text-center">
              <span className="text-3xl font-mono font-bold text-emerald-600 tabular-nums">
                {totalHelpful}
              </span>
              <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
                Helpful Ratings
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 text-center">
              <span className="text-3xl font-mono font-bold text-rose-600 tabular-nums">
                {totalUnhelpful}
              </span>
              <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
                Unhelpful Reports
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 text-center">
              <span className="text-3xl font-mono font-bold text-blue-600 tabular-nums">
                {helpfulRate}%
              </span>
              <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
                Overall CSAT Score
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              User Feedback & Improvement Logs
            </h4>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              <div className="py-2.5 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    "Can I get a refund on annual billing?"
                  </span>
                  <p className="text-[11px] text-[#6E6E73] mt-0.5">
                    User note: Please clarify the exact 14-day pro-rated timeline for enterprise tiers.
                  </p>
                </div>
                <span className="text-[10px] text-rose-500 font-medium shrink-0">Unhelpful report</span>
              </div>
              <div className="py-2.5 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    "How to reset password?"
                  </span>
                  <p className="text-[11px] text-[#6E6E73] mt-0.5">
                    User note: Clear step-by-step instructions. Worked immediately.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-600 font-medium shrink-0">Helpful (+1)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SUPPORT TICKETS CONSOLE */}
      {activeTab === 'tickets' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Escalated Support Tickets Queue ({tickets.length})
            </h3>
            <span className="text-xs text-[#6E6E73]">SLA Target: 100% within 18m</span>
          </div>

          <div className="space-y-3">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">
                      {ticket.ticketNumber}
                    </span>
                    <span>·</span>
                    <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {ticket.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={ticket.status}
                      onChange={e => updateTicketStatus(ticket.id, e.target.value as any)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-[#1D1D1F] dark:text-[#F5F5F7]"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting for User">Waiting for User</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  {ticket.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#6E6E73]">
                  <span>User: {ticket.userEmail} · Category: {ticket.category}</span>
                  <span>Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOGS & ROLES */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Role-Based Access Control (RBAC) & Compliance
            </h3>
            <p className="text-xs text-[#6E6E73]">
              Security privileges enforced across staff and administrative tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'User', desc: 'Read FAQs, interact with AI assistant, save answers, create tickets.' },
              { role: 'Support Agent', desc: 'Triage tickets, reply to inquiries, mark answered.' },
              { role: 'Admin', desc: 'Author FAQs, review drafts, re-index knowledge sources.' },
              { role: 'Super Admin', desc: 'Full authority: delete audits, configure LLM endpoints, permissions.' },
            ].map(r => (
              <div key={r.role} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">
                  {r.role}
                </span>
                <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Recent Audit Log Entries
            </h4>
            <div className="space-y-1.5 font-mono text-[11px] text-[#6E6E73]">
              <p>• [2026-09-23 18:22:10] admin_user modified FAQ "How do I reset my password?"</p>
              <p>• [2026-09-23 17:40:02] support_agent assigned ticket TICK-4982 to Tier-2</p>
              <p>• [2026-09-23 16:15:33] system indexed document "Operations Manual 2026" (42 chunks)</p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT FAQ MODAL */}
      {isFaqModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsFaqModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {editingFaqId ? 'Edit FAQ Article' : 'Create New FAQ Article'}
              </h3>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="p-1 text-[#6E6E73] hover:text-[#1D1D1F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFaqSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={e => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. How do I configure Two-Factor Authentication?"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={faqForm.category}
                    onChange={e => setFaqForm({ ...faqForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                  >
                    {FAQ_CATEGORIES.map(c => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Status Workflow</label>
                  <select
                    value={faqForm.status}
                    onChange={e => setFaqForm({ ...faqForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Review">In Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published (Live to AI)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Short Preview Summary</label>
                <input
                  type="text"
                  value={faqForm.shortAnswer}
                  onChange={e => setFaqForm({ ...faqForm, shortAnswer: e.target.value })}
                  placeholder="Quick 1-2 sentence executive answer"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Full Comprehensive Answer</label>
                <textarea
                  required
                  rows={5}
                  value={faqForm.answer}
                  onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Complete explanation, steps, and details..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={faqForm.keywords}
                    onChange={e => setFaqForm({ ...faqForm, keywords: e.target.value })}
                    placeholder="password, 2fa, security"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Source Document</label>
                  <input
                    type="text"
                    value={faqForm.sourceDocument}
                    onChange={e => setFaqForm({ ...faqForm, sourceDocument: e.target.value })}
                    placeholder="e.g. Operations Manual 2026"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-neutral-200 text-[#6E6E73]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl"
                >
                  {editingFaqId ? 'Save Changes' : 'Publish to Repository'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INDEX NEW DOCUMENT MODAL */}
      {isDocModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsDocModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Index New Knowledge Document
              </h3>
              <button onClick={() => setIsDocModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  value={docForm.name}
                  onChange={e => setDocForm({ ...docForm, name: e.target.value })}
                  placeholder="e.g. Enterprise Security Handbook v4"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">File Format</label>
                  <select
                    value={docForm.type}
                    onChange={e => setDocForm({ ...docForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                  >
                    <option value="PDF Document">PDF Document</option>
                    <option value="DOCX Document">DOCX Document</option>
                    <option value="Website Content">Website Content</option>
                    <option value="Internal Documentation">Internal Documentation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Approx Chunks</label>
                  <input
                    type="number"
                    value={docForm.chunksCount}
                    onChange={e => setDocForm({ ...docForm, chunksCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-neutral-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!docForm.name.trim()) return;
                    addKnowledgeDoc({
                      name: docForm.name,
                      type: docForm.type,
                      size: docForm.size,
                      chunksCount: docForm.chunksCount,
                      status: 'Active',
                      category: docForm.category,
                      urlOrFilename: docForm.urlOrFilename,
                    });
                    setIsDocModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl"
                >
                  Process & Index
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
