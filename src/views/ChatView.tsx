import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ChatMessage } from '../types.ts';
import { MarkdownRenderer } from '../components/MarkdownRenderer.tsx';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Share2,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Plus,
  Trash2,
  Search,
  PanelLeftClose,
  PanelLeft,
  Edit2,
  CheckCheck,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  HelpCircle,
  Code2,
  PenTool,
  CreditCard,
  KeyRound,
  Compass,
  Square,
  Globe,
  Database,
  ArrowUp,
  Sliders,
  ChevronDown,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    createNewChatSession,
    addChatMessage,
    updateChatMessage,
    deleteChatSession,
    clearAllChats,
    saveAiAnswer,
    savedItems,
    setSelectedSourceForModal,
    setIsEscalationModalOpen,
    setEscalationQuery,
    userLanguage,
    preferences,
    updatePreferences,
    setCurrentView,
    addToast,
    knowledgeDocs,
  } = useApp();

  // Mode state: 'general' (Fast FAQ mode) vs 'faq' (Company FAQ Grounded mode)
  const [chatMode, setChatMode] = useState<'general' | 'faq'>('general');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [feedbackInputId, setFeedbackInputId] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Editing user message state
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState('');

  // Renaming chat session state
  const [renamingSessionId, setRenamingSessionId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeSession =
    chatSessions.find(s => s.id === activeSessionId) || chatSessions[0];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isLoading]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputQuery]);

  // Listen to custom ask events dispatched from other views
  useEffect(() => {
    const handleAskEvent = (e: any) => {
      if (e.detail?.question) {
        handleSendMessage(e.detail.question);
      }
    };
    window.addEventListener('ai-ask-query', handleAskEvent);
    return () => window.removeEventListener('ai-ask-query', handleAskEvent);
  }, [activeSessionId, chatMode]);

  // Handle Send Message
  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    setInputQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // If current active session doesn't exist, create one
    let targetSessionId = activeSessionId;
    if (!activeSession) {
      targetSessionId = createNewChatSession(textToSend);
    }

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    addChatMessage(targetSessionId, userMessage);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const historyForApi = (activeSession?.messages || []).map(m => ({
        role: m.role,
        content: m.content,
      }));

      let res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          message: textToSend,
          history: historyForApi,
          language: userLanguage,
          style: preferences.responseStyle,
          personality: preferences.personality,
          mode: chatMode,
        }),
      });

      // Quick retry once on transient network or 503 response
      if (!res.ok) {
        await new Promise(r => setTimeout(r, 600));
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abortControllerRef.current.signal,
          body: JSON.stringify({
            message: textToSend,
            history: historyForApi,
            language: userLanguage,
            style: preferences.responseStyle,
            personality: preferences.personality,
            mode: chatMode,
          }),
        });
      }

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: data.answer || "I couldn't retrieve an answer at this moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: data.confidence || 'high',
        confidenceLabel: data.confidenceLabel || (chatMode === 'general' ? 'AI Intelligence' : 'Verified Answer'),
        source: data.source || null,
        relatedFaqIds: data.relatedFaqIds || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
      };

      addChatMessage(targetSessionId, assistantMessage);

      // Auto voice playback if user enabled it
      if (preferences.voicePlayback && 'speechSynthesis' in window) {
        speakText(assistantMessage.content, assistantMessage.id);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; // User clicked stop
      }
      const fallbackMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content:
          "I experienced a momentary connection interruption. The knowledge base is accessible, and you can re-submit your prompt or contact human support.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 'low',
        confidenceLabel: 'Information Not Found',
        suggestedFollowUps: ['Browse all FAQs', 'Submit Support Ticket'],
      };
      addChatMessage(targetSessionId, fallbackMsg);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Stop current generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      addToast('Stopped', 'Generation stopped.', 'info');
    }
  };

  // Resend edited user message
  const handleSaveAndResend = (msgId: string) => {
    if (!editingMessageText.trim()) return;
    setEditingMessageId(null);
    handleSendMessage(editingMessageText.trim());
  };

  // Voice speech synthesis
  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      addToast('Audio Unavailable', 'Speech synthesis is not supported on this browser.', 'warning');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted.');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Speech Recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast('Voice Input', 'Speech recognition is not supported in this browser.', 'warning');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = userLanguage === 'ta' ? 'ta-IN' : userLanguage === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    addToast('Copied to Clipboard', 'Message text copied.', 'success');
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Share conversation
  const handleShare = () => {
    if (!activeSession) return;
    const conversationTranscript = activeSession.messages
      .map(m => `${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`)
      .join('\n\n');

    if (navigator.share) {
      navigator.share({
        title: activeSession.title,
        text: conversationTranscript,
      });
    } else {
      navigator.clipboard.writeText(conversationTranscript);
      addToast('Transcript Copied', 'Full conversation transcript copied to clipboard.', 'success');
    }
  };

  // Feedback rating
  const handleFeedback = (messageId: string, helpful: boolean) => {
    updateChatMessage(activeSessionId, messageId, {
      feedback: helpful ? 'helpful' : 'unhelpful',
    });
    addToast(
      helpful ? 'Feedback Recorded' : 'Response Flagged',
      helpful ? 'Thank you for verifying this response!' : 'We will review this answer for accuracy.',
      helpful ? 'success' : 'info'
    );
    if (!helpful) {
      setFeedbackInputId(messageId);
    }
  };

  // Submit feedback comment
  const submitFeedbackComment = (messageId: string) => {
    if (!feedbackComment.trim()) return;
    updateChatMessage(activeSessionId, messageId, {
      feedbackComment,
    });
    addToast('Note Saved', 'Editorial team will inspect the knowledge chunk.', 'info');
    setFeedbackInputId(null);
    setFeedbackComment('');
  };

  // Save answer to bookmarks
  const handleSaveAnswer = (msg: ChatMessage) => {
    const parentUserMsg = activeSession?.messages
      .slice(0, activeSession.messages.findIndex(m => m.id === msg.id))
      .filter(m => m.role === 'user')
      .pop();

    const q = parentUserMsg?.content || 'AI Consultation';
    saveAiAnswer(q, msg.content, msg.source?.title);
  };

  // Filter messages if search open
  const filteredMessages =
    isSearchOpen && searchFilter.trim()
      ? (activeSession?.messages || []).filter(m =>
          m.content.toLowerCase().includes(searchFilter.toLowerCase())
        )
      : activeSession?.messages || [];

  // Group chat sessions for sidebar
  const groupSessions = () => {
    const now = new Date();
    const today: typeof chatSessions = [];
    const previous7Days: typeof chatSessions = [];
    const older: typeof chatSessions = [];

    chatSessions.forEach(s => {
      const d = new Date(s.updatedAt || s.createdAt);
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        today.push(s);
      } else if (diffDays <= 7) {
        previous7Days.push(s);
      } else {
        older.push(s);
      }
    });

    return { today, previous7Days, older };
  };

  const { today, previous7Days, older } = groupSessions();

  return (
    <div className="h-[calc(100vh-8.5rem)] flex rounded-2xl overflow-hidden border border-[#D2D2D7]/80 dark:border-[#38383A] bg-white dark:bg-[#151516] shadow-sm">
      {/* 1. FAST FAQ SIDEBAR */}
      <aside
        className={`transition-all duration-300 ease-in-out flex flex-col bg-[#F7F7F8] dark:bg-[#171719] border-r border-[#D2D2D7]/60 dark:border-[#2C2C2E] shrink-0 ${
          isSidebarOpen ? 'w-64 sm:w-72' : 'w-0 overflow-hidden border-r-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-[#E5E5EA] dark:border-[#2C2C2E] flex items-center justify-between gap-2">
          <button
            onClick={() => createNewChatSession()}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#232326] hover:bg-neutral-100 dark:hover:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] border border-neutral-200/80 dark:border-neutral-700/80 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>New Chat</span>
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Search Past Chats */}
        <div className="px-3 pt-2.5 pb-1">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-neutral-200/50 dark:bg-[#232326] text-xs text-neutral-600 dark:text-neutral-400">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full bg-transparent focus:outline-hidden text-neutral-800 dark:text-neutral-200 text-xs placeholder-neutral-400"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 scrollbar-thin text-xs">
          {/* Today */}
          {today.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Today
              </span>
              <div className="mt-1 space-y-0.5">
                {today.map(s => renderSessionItem(s))}
              </div>
            </div>
          )}

          {/* Previous 7 Days */}
          {previous7Days.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Previous 7 Days
              </span>
              <div className="mt-1 space-y-0.5">
                {previous7Days.map(s => renderSessionItem(s))}
              </div>
            </div>
          )}

          {/* Older */}
          {older.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Older
              </span>
              <div className="mt-1 space-y-0.5">
                {older.map(s => renderSessionItem(s))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#E5E5EA] dark:border-[#2C2C2E] bg-neutral-100/50 dark:bg-[#1A1A1C] text-xs space-y-2">
          {/* Mode Switcher inside sidebar */}
          <div className="flex rounded-xl p-1 bg-neutral-200/70 dark:bg-[#262629]">
            <button
              onClick={() => setChatMode('general')}
              className={`flex-1 py-1 text-[11px] font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                chatMode === 'general'
                  ? 'bg-white dark:bg-[#343438] text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>Fast FAQ</span>
            </button>
            <button
              onClick={() => setChatMode('faq')}
              className={`flex-1 py-1 text-[11px] font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                chatMode === 'faq'
                  ? 'bg-white dark:bg-[#343438] text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              <Database className="w-3 h-3 text-emerald-500" />
              <span>Grounded FAQ</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Gemini 3.8 Flash
            </span>
            <button
              onClick={() => {
                if (window.confirm('Clear all conversation history?')) {
                  clearAllChats();
                }
              }}
              className="text-neutral-400 hover:text-rose-600 transition-colors"
              title="Clear chats"
            >
              Clear All
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CHAT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FFFFFF] dark:bg-[#151516] relative">
        {/* Top Header */}
        <header className="h-14 px-4 border-b border-[#E5E5EA] dark:border-[#28282B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors mr-1"
                title="Open sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {/* Mode Switcher Pill */}
            <div className="flex items-center bg-neutral-100 dark:bg-[#232326] p-1 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
              <button
                onClick={() => setChatMode('general')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  chatMode === 'general'
                    ? 'bg-white dark:bg-[#2E2E33] text-neutral-900 dark:text-neutral-100 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Fast FAQ Mode</span>
              </button>

              <button
                onClick={() => setChatMode('faq')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  chatMode === 'faq'
                    ? 'bg-white dark:bg-[#2E2E33] text-neutral-900 dark:text-neutral-100 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>FAQ Grounded</span>
              </button>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search messages in conversation */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-xl transition-colors ${
                isSearchOpen
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              title="Search messages"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Share transcript */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Share conversation transcript"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Response Style Switcher */}
            <div className="hidden sm:flex items-center gap-1 ml-1 text-xs">
              {(['concise', 'standard', 'detailed'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => updatePreferences({ responseStyle: style })}
                  className={`px-2 py-1 rounded-lg capitalize transition-colors text-[11px] ${
                    preferences.responseStyle === style
                      ? 'bg-neutral-200 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-white'
                      : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* New chat icon button */}
            <button
              onClick={() => createNewChatSession()}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Start fresh chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Search inside conversation banner */}
        {isSearchOpen && (
          <div className="px-4 py-2 bg-neutral-50 dark:bg-[#1C1C1E] border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Find in this chat..."
              className="w-full text-xs bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
              autoFocus
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="text-xs text-neutral-400 hover:text-neutral-600"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* 3. MESSAGES SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scrollbar-thin">
          {filteredMessages.length === 0 ? (
            /* EMPTY / WELCOME STATE */
            <div className="max-w-2xl mx-auto py-10 flex flex-col items-center text-center space-y-6">
              {/* Fast FAQ Spark Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                  What can I help with today?
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto">
                  {chatMode === 'general'
                    ? 'Ask me anything: write code, brainstorm ideas, troubleshoot bugs, or analyze documents.'
                    : 'Search company policies, accounts, refunds, security, and verified FAQs with zero hallucinations.'}
                </p>
              </div>

              {/* Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2">
                {[
                  {
                    icon: Code2,
                    label: 'Write Code',
                    prompt: 'Write a TypeScript function to debounce an async API call with clean error handling.',
                  },
                  {
                    icon: PenTool,
                    label: 'Creative Writing',
                    prompt: 'Draft a polite follow-up email requesting an update on a pending invoice.',
                  },
                  {
                    icon: KeyRound,
                    label: 'Account Help',
                    prompt: 'How do I reset my password if my account gets locked out?',
                  },
                  {
                    icon: CreditCard,
                    label: 'Refund Policy',
                    prompt: 'What payment methods do you accept and how do refunds work?',
                  },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(card.prompt)}
                      className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#1C1C1E] hover:border-blue-500 dark:hover:border-blue-500/80 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        <Icon className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>{card.label}</span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                        {card.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* CONVERSATION MESSAGES */
            <div className="max-w-3xl mx-auto space-y-6">
              {filteredMessages.map(msg => {
                const isUser = msg.role === 'user';
                const isSpeaking = speakingMsgId === msg.id;

                if (isUser) {
                  return (
                    <div key={msg.id} className="flex justify-end group">
                      <div className="max-w-[85%] sm:max-w-[75%] space-y-1">
                        {editingMessageId === msg.id ? (
                          <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 space-y-2">
                            <textarea
                              value={editingMessageText}
                              onChange={e => setEditingMessageText(e.target.value)}
                              className="w-full text-xs sm:text-sm bg-transparent border-0 focus:outline-hidden resize-none"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="px-2.5 py-1 text-xs rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveAndResend(msg.id)}
                                className="px-3 py-1 text-xs rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                              >
                                Save & Resubmit
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative group flex items-start justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingMessageId(msg.id);
                                setEditingMessageText(msg.content);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-opacity"
                              title="Edit message"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="px-4 py-2.5 rounded-3xl bg-[#007AFF] text-white text-xs sm:text-sm leading-relaxed shadow-sm">
                              {msg.content}
                            </div>
                          </div>
                        )}
                        <span className="text-[10px] text-neutral-400 text-right block pr-2">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                }

                // AI ASSISTANT MESSAGE
                return (
                  <div key={msg.id} className="flex items-start gap-3 sm:gap-4 group">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Header with confidence & source if present */}
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                          AI Assistant
                        </span>

                        {/* Reliability Badge */}
                        {msg.confidence && (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              msg.confidence === 'high'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                : msg.confidence === 'medium'
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {msg.confidence === 'high' && <Check className="w-3 h-3" />}
                            {msg.confidence === 'medium' && <span>◐</span>}
                            {msg.confidence === 'low' && <span>?</span>}
                            <span>{msg.confidenceLabel || 'Verified'}</span>
                          </span>
                        )}

                        {/* Source Document pill */}
                        {msg.source && (
                          <button
                            onClick={() => setSelectedSourceForModal(msg.source!)}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-blue-500 border border-neutral-200 dark:border-neutral-700 transition-colors"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span className="max-w-[150px] truncate">{msg.source.title}</span>
                          </button>
                        )}
                      </div>

                      {/* Content Rendered with Markdown / Code blocks */}
                      <div className="text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E6E6E8] leading-relaxed">
                        <MarkdownRenderer content={msg.content} />
                      </div>

                      {/* Low Confidence Escalation Alert */}
                      {msg.confidence === 'low' && (
                        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <p className="font-semibold text-amber-900 dark:text-amber-200">
                              Would you like to connect with Human Support?
                            </p>
                            <p className="text-amber-700 dark:text-amber-300 text-[11px] mt-0.5">
                              Our support team can help you resolve custom account or billing inquiries.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEscalationQuery(activeSession?.title || '');
                                setIsEscalationModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors"
                            >
                              Submit Ticket
                            </button>
                            <button
                              onClick={() => setCurrentView('faqs')}
                              className="px-3 py-1.5 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-xl"
                            >
                              Browse FAQs
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Message Actions Toolbar */}
                      <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 pt-1">
                        {/* Audio Voice */}
                        <button
                          onClick={() => speakText(msg.content, msg.id)}
                          className={`p-1.5 rounded-lg hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                            isSpeaking ? 'text-blue-600 dark:text-blue-400' : ''
                          }`}
                          title={isSpeaking ? 'Stop playback' : 'Read aloud'}
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="p-1.5 rounded-lg hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Copy response"
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Thumbs Up */}
                        <button
                          onClick={() => handleFeedback(msg.id, true)}
                          className={`p-1.5 rounded-lg hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                            msg.feedback === 'helpful' ? 'text-emerald-500' : ''
                          }`}
                          title="Good response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Thumbs Down */}
                        <button
                          onClick={() => handleFeedback(msg.id, false)}
                          className={`p-1.5 rounded-lg hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                            msg.feedback === 'unhelpful' ? 'text-rose-500' : ''
                          }`}
                          title="Bad response"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Save to bookmarks */}
                        <button
                          onClick={() => handleSaveAnswer(msg)}
                          className="p-1.5 rounded-lg hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Save to bookmarks"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        {/* Regenerate */}
                        <button
                          onClick={() => {
                            const lastUser = activeSession?.messages
                              .slice(0, activeSession.messages.findIndex(m => m.id === msg.id))
                              .filter(m => m.role === 'user')
                              .pop();
                            if (lastUser) {
                              handleSendMessage(lastUser.content);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Regenerate"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Feedback Comment Drawer */}
                      {feedbackInputId === msg.id && (
                        <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 w-full space-y-2">
                          <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                            How can we improve this answer?
                          </p>
                          <input
                            type="text"
                            value={feedbackComment}
                            onChange={e => setFeedbackComment(e.target.value)}
                            placeholder="e.g. Missing refund processing timeline..."
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setFeedbackInputId(null)}
                              className="px-2.5 py-1 text-xs text-neutral-500"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => submitFeedbackComment(msg.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg font-medium"
                            >
                              Submit Note
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Smart follow-up questions */}
                      {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                        <div className="pt-2 w-full space-y-1.5">
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            You may also want to know:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestedFollowUps.map((fu, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(fu)}
                                className="text-xs px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-neutral-800 dark:text-neutral-200 transition-colors text-left"
                              >
                                {fu}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-[#1E1E22] border border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs text-neutral-500 ml-1">
                      {chatMode === 'general' ? 'Thinking...' : 'Searching knowledge base...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 4. FAST FAQ PROMPT BAR */}
        <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent dark:from-[#151516] dark:via-[#151516] dark:to-transparent shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl bg-neutral-100/90 dark:bg-[#1E1E22] border border-neutral-300 dark:border-neutral-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all">
              {/* Textarea */}
              <div className="px-4 pt-3 pb-1">
                <textarea
                  ref={textareaRef}
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  placeholder={
                    isListening
                      ? 'Listening to voice...'
                      : chatMode === 'general'
                      ? 'Ask Fast FAQ anything, write code, analyze, brainstorm... (Shift+Enter for newline)'
                      : 'Ask a question about account, billing, policies, or technical help...'
                  }
                  className="w-full text-xs sm:text-sm bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 resize-none focus:outline-hidden max-h-44 leading-relaxed"
                />
              </div>

              {/* Bottom bar inside prompt container */}
              <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
                {/* Left quick toggles */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setChatMode(chatMode === 'general' ? 'faq' : 'general')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors border ${
                      chatMode === 'general'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {chatMode === 'general' ? (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Fast FAQ</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3 h-3" />
                        <span>FAQ Grounded</span>
                      </>
                    )}
                  </button>

                  {/* Language Indicator */}
                  <span className="text-[10px] text-neutral-400 uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800">
                    {userLanguage}
                  </span>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2">
                  {/* Voice dictation */}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-full transition-colors ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                    }`}
                    title="Voice dictation"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send or Stop button */}
                  {isLoading ? (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      className="p-2 rounded-full bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 hover:opacity-90 transition-opacity"
                      title="Stop generating"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={!inputQuery.trim()}
                      className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 text-white transition-all shadow-2xs"
                      title="Send message"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Subtext disclaimer */}
            <div className="mt-2 text-center text-[11px] text-neutral-400">
              AI FAQ Assistant can make mistakes. Verify critical facts and policies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper to render session item in sidebar
  function renderSessionItem(session: (typeof chatSessions)[0]) {
    const isActive = session.id === activeSessionId;
    const isRenaming = renamingSessionId === session.id;

    return (
      <div
        key={session.id}
        onClick={() => setActiveSessionId(session.id)}
        className={`group flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition-colors ${
          isActive
            ? 'bg-neutral-200/80 dark:bg-[#28282B] text-neutral-900 dark:text-neutral-100 font-medium'
            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/40 dark:hover:bg-[#202022]'
        }`}
      >
        {isRenaming ? (
          <input
            type="text"
            value={renamingTitle}
            onChange={e => setRenamingTitle(e.target.value)}
            onBlur={() => {
              // save title
              setRenamingSessionId(null);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setRenamingSessionId(null);
              }
            }}
            className="w-full bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded text-xs"
            autoFocus
          />
        ) : (
          <span className="truncate flex-1 text-xs">{session.title}</span>
        )}

        {/* Hover Delete Action */}
        <button
          onClick={e => {
            e.stopPropagation();
            if (chatSessions.length > 1) {
              deleteChatSession(session.id);
            } else {
              addToast('Info', 'At least one chat must remain open.', 'info');
            }
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-rose-500 transition-opacity ml-1"
          title="Delete chat"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  }
};
