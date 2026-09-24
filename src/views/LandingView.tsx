import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { FAQ_CATEGORIES } from '../data/knowledgeBase.ts';
import {
  Search,
  Sparkles,
  Mic,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  Cpu,
  Lock,
  CreditCard,
  UserCheck,
  Package,
  ChevronRight,
  LifeBuoy,
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const {
    setCurrentView,
    askQuestionInChat,
    viewFaqDetail,
    setSelectedCategoryFilter,
    faqs,
    setIsTicketModalOpen,
    knowledgeDocs,
    setIsCommandPaletteOpen,
  } = useApp();

  const [heroInput, setHeroInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const exampleSuggestions = [
    'How do I reset my password?',
    'What payment methods do you accept?',
    'How can I contact support?',
    'What is your refund policy?',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroInput.trim()) return;
    askQuestionInChat(heroInput.trim());
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setHeroInput(transcript);
        setIsListening(false);
        askQuestionInChat(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Popular questions
  const popularFaqs = [...faqs].sort((a, b) => b.views - a.views).slice(0, 4);

  // Icon mapping for categories
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return UserCheck;
      case 'CreditCard':
        return CreditCard;
      case 'Package':
        return Package;
      case 'Cpu':
        return Cpu;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Lock':
        return Lock;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Apple-style subtle ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-blue-400/10 via-indigo-300/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Hero badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 mb-6 transition-transform hover:scale-105">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
            Fast FAQ — Intelligent Knowledge Assistant
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.08] max-w-4xl mx-auto text-balance">
          Answers, without the searching.
        </h1>

        {/* Supporting text */}
        <p className="mt-5 text-base sm:text-xl text-[#6E6E73] dark:text-[#98989D] max-w-2xl mx-auto font-normal leading-relaxed text-balance">
          Ask questions naturally and get clear, reliable answers grounded in an intelligent, verified knowledge base.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setCurrentView('chat')}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Assistant</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => setCurrentView('faqs')}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#1D1D1F] dark:text-[#F5F5F7] font-medium text-sm transition-colors"
          >
            Explore All FAQs
          </button>
        </div>

        {/* Hero Interactive Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl shadow-xl p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          >
            <Search className="w-5 h-5 text-[#6E6E73] dark:text-[#98989D] ml-3 shrink-0" />
            <input
              type="text"
              value={heroInput}
              onChange={e => setHeroInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full px-3 py-2 text-sm bg-transparent text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#98989D] focus:outline-hidden"
            />

            <div className="flex items-center gap-1 shrink-0 mr-1">
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                title="Voice Input (Speech-to-text)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-[#6E6E73] dark:text-[#98989D]"
                title="Global shortcut"
              >
                ⌘K
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Example Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#6E6E73] dark:text-[#98989D] text-xs">Suggested:</span>
            {exampleSuggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => askQuestionInChat(suggestion)}
                className="px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 border border-neutral-200/60 dark:border-neutral-700/40 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Visual Asset */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#D2D2D7]/60 dark:border-[#38383A] shadow-2xl relative aspect-16/9 bg-neutral-100 dark:bg-neutral-900">
          <img
            src="/src/assets/images/hero_knowledge_glass_1790213668766.jpg"
            alt="Intelligent Knowledge System preview"
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.style.display = 'none';
            }}
          />
          {/* Subtle overlay card */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 apple-glass p-4 sm:p-5 rounded-2xl border border-white/40 dark:border-white/10 shadow-lg text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Instant Grounded Intelligence
                </p>
                <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                  Transparent citations with verifiable source documents and real confidence ratings.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('chat')}
              className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium rounded-xl whitespace-nowrap"
            >
              Try Interactive Demo
            </button>
          </div>
        </div>
      </section>

      {/* 2. POPULAR QUESTIONS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Trending Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
              Popular Questions
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('faqs')}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all {faqs.length} FAQs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularFaqs.map(faq => (
            <div
              key={faq.id}
              onClick={() => viewFaqDetail(faq.id)}
              className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/80 dark:border-[#38383A] hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-[#6E6E73] dark:text-[#98989D] mb-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase text-[11px]">
                  {faq.category}
                </span>
                <span className="tabular-nums">{faq.views} views</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {faq.question}
              </h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-2 line-clamp-2 leading-relaxed">
                {faq.shortAnswer}
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                <span>Source: {faq.sourceDocument}</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-0.5">
                  Read Answer <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FAQ CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Explore Topics
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
            Knowledge Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-2">
            Organized knowledge branches curated and approved by technical leads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FAQ_CATEGORIES.map(cat => {
            const Icon = getCategoryIcon(cat.iconName);
            const count = faqs.filter(f => f.category === cat.slug).length;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryFilter(cat.slug);
                  setCurrentView('faqs');
                }}
                className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] hover:border-blue-500/80 dark:hover:border-blue-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-[#6E6E73] dark:text-[#98989D] tabular-nums font-mono">
                    {count} {count === 1 ? 'article' : 'articles'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS (Three elegant cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Simple. Intelligent. Reliable.
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#2C2C2E] border border-neutral-200/80 dark:border-neutral-700/60 shadow-xs">
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                01 — Ask
              </span>
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mt-2 mb-2">
                Ask naturally
              </h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                Type or speak your inquiry. Whether you ask "Can I change my password?" or "I'm locked out", semantic parsing understands intent.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#2C2C2E] border border-neutral-200/80 dark:border-neutral-700/60 shadow-xs">
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                02 — Understand
              </span>
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mt-2 mb-2">
                Knowledge retrieval
              </h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                The engine matches your query against verified documentation chunks and calculates a factual confidence rating before formulation.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#2C2C2E] border border-neutral-200/80 dark:border-neutral-700/60 shadow-xs">
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                03 — Answer
              </span>
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mt-2 mb-2">
                Clear & verified answer
              </h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                Receive concise, cited answers with supporting documents. If confidence is low, instant human escalation ensures you never get stuck.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUSTED KNOWLEDGE SOURCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Transparency & Freshness
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              Multi-source verified knowledge foundation.
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
              Every AI answer traces directly back to audited source documentation. Our platform synchronizes PDFs, technical handbooks, website content, and internal compliance charters.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Continuous Freshness Audits
                  </h4>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                    Documents older than 90 days trigger automated review warnings for administrators.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Anti-Hallucination Safeguards
                  </h4>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                    Policies strictly forbid fabricating pricing, policies, dates, or specifications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Document list card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] shadow-lg divide-y divide-neutral-100 dark:divide-neutral-800">
            <div className="pb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Indexed Knowledge Sources
              </h3>
              <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D] tabular-nums">
                {knowledgeDocs.length} Active Repositories
              </span>
            </div>

            <div className="py-2 space-y-2">
              {knowledgeDocs.slice(0, 4).map(doc => (
                <div key={doc.id} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-[#6E6E73] dark:text-[#98989D]">
                        {doc.type} · {doc.chunksCount} chunks · {doc.size}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-md font-medium shrink-0">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setCurrentView('admin')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Inspect All Sources in Admin →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUANTITATIVE STATS (Tabular Figures) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] text-center">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              99.4%
            </span>
            <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-2">
              Verified Accuracy
            </p>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-1">
              Based on audited knowledge matches
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] text-center">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
              &lt;180ms
            </span>
            <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-2">
              Semantic Latency
            </p>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-1">
              Sub-second retrieval pipeline
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] text-center">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              100%
            </span>
            <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-2">
              Source Transparency
            </p>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-1">
              Every answer links to documents
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] text-center">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
              0
            </span>
            <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-2">
              Public Model Retention
            </p>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-1">
              Queries never train global LLMs
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER SUPPORT CTA ESCALATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Can't find what you need?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Our human customer advocacy team is ready to step in. Average response time is under 18 minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-medium text-xs rounded-xl shadow-sm transition-colors"
            >
              Submit Support Ticket
            </button>
            <button
              onClick={() => setCurrentView('support')}
              className="w-full sm:w-auto px-6 py-3 bg-blue-700/60 hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition-colors"
            >
              Track Active Tickets
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
