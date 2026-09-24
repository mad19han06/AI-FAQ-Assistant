import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ViewMode,
  ChatSession,
  ChatMessage,
  SavedItem,
  UserPreferences,
  ToastMessage,
  SourceCitation,
  AuthUser,
} from '../types.ts';
import {
  FAQItem,
  KnowledgeDocument,
  UnansweredQuestion,
  SupportTicket,
  NotificationItem,
  INITIAL_FAQS,
  INITIAL_KNOWLEDGE_DOCUMENTS,
  INITIAL_UNANSWERED_QUESTIONS,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
} from '../data/knowledgeBase.ts';

interface AppContextType {
  // Navigation
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedFaqId: string | null;
  setSelectedFaqId: (id: string | null) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Theme & Preferences
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  effectiveTheme: 'light' | 'dark';
  userLanguage: string;
  setUserLanguage: (lang: string) => void;
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;

  // Data Stores
  faqs: FAQItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
  addFaq: (faq: Omit<FAQItem, 'id' | 'views' | 'helpfulCount' | 'unhelpfulCount' | 'lastUpdated'>) => void;
  updateFaq: (id: string, updates: Partial<FAQItem>) => void;
  deleteFaq: (id: string) => void;
  rateFaq: (id: string, helpful: boolean) => void;

  knowledgeDocs: KnowledgeDocument[];
  addKnowledgeDoc: (doc: Omit<KnowledgeDocument, 'id' | 'lastIndexed'>) => void;
  updateKnowledgeDoc: (id: string, updates: Partial<KnowledgeDocument>) => void;

  unansweredQuestions: UnansweredQuestion[];
  convertUnansweredToFaq: (unansweredId: string, initialQuestion: string, category: string) => void;
  ignoreUnansweredQuestion: (id: string) => void;

  tickets: SupportTicket[];
  createTicket: (subject: string, description: string, category: string, priority: SupportTicket['priority']) => void;
  replyToTicket: (ticketId: string, message: string, sender?: 'user' | 'agent') => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Chat
  chatSessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  createNewChatSession: (initialMessage?: string) => string;
  addChatMessage: (sessionId: string, message: ChatMessage) => void;
  updateChatMessage: (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  deleteChatSession: (id: string) => void;
  renameChatSession: (id: string, newTitle: string) => void;
  clearAllChats: () => void;

  // Saved Items
  savedItems: SavedItem[];
  toggleSaveFaq: (faq: FAQItem) => void;
  saveAiAnswer: (question: string, answer: string, sourceTitle?: string) => void;
  removeSavedItem: (id: string) => void;
  isFaqSaved: (faqId: string) => boolean;

  // Modals & UI States
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isTicketModalOpen: boolean;
  setIsTicketModalOpen: (open: boolean) => void;
  isEscalationModalOpen: boolean;
  setIsEscalationModalOpen: (open: boolean) => void;
  escalationQuery: string;
  setEscalationQuery: (q: string) => void;
  selectedSourceForModal: SourceCitation | null;
  setSelectedSourceForModal: (source: SourceCitation | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Actions
  askQuestionInChat: (question: string) => void;
  viewFaqDetail: (faqId: string) => void;

  // Authentication
  currentUser: AuthUser | null;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
}

export const ADMIN_CREDENTIALS = {
  email: 'madhansudha2009@gmail.com',
  password: 'madhan@2009#madhan',
  name: 'Madhan Sudha',
  role: 'admin' as const,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  responseStyle: 'standard',
  personality: 'friendly',
  voicePlayback: false,
  emailNotifications: true,
  retainChatHistory: true,
};

const DEFAULT_FIRST_SESSION: ChatSession = {
  id: 'session-default-1',
  title: 'Welcome & System Questions',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [
    {
      id: 'msg-welcome-1',
      role: 'assistant',
      content: "Hi! I'm your AI FAQ Assistant. I can help you find answers, explain FAQs, and guide you to the right support resources. What can I help you with today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 'high',
      confidenceLabel: 'Verified Answer',
      source: {
        id: 'faq-gen-1',
        title: 'Platform Introduction & Support Services',
        category: 'general',
        document: 'Customer Support Escalation & SLAs',
        lastUpdated: '2026-04-01',
      },
      suggestedFollowUps: [
        'How do I reset my password?',
        'What payment methods do you accept?',
        'How is my information protected?',
      ],
    },
  ],
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation state
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Preferences & Theme
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('ai_faq_prefs');
      return saved ? JSON.parse(saved) : INITIAL_PREFERENCES;
    } catch {
      return INITIAL_PREFERENCES;
    }
  });

  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(preferences.theme);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [userLanguage, setUserLanguageState] = useState<string>(preferences.language);

  // Sync effective theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const computeEffective = (currentTheme: 'light' | 'dark' | 'system') => {
      if (currentTheme === 'dark') return 'dark';
      if (currentTheme === 'light') return 'light';
      return mediaQuery.matches ? 'dark' : 'light';
    };

    const newEffective = computeEffective(theme);
    setEffectiveTheme(newEffective);

    if (newEffective === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const handleChange = () => {
      if (theme === 'system') {
        const sys = mediaQuery.matches ? 'dark' : 'light';
        setEffectiveTheme(sys);
        if (sys === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    updatePreferences({ theme: newTheme });
  };

  const setUserLanguage = (lang: string) => {
    setUserLanguageState(lang);
    updatePreferences({ language: lang });
    addToast('Language Updated', `Active language set to ${lang.toUpperCase()}`, 'info');
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('ai_faq_prefs', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save preferences:', e);
      }
      return next;
    });
  };

  // FAQs State
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai_faq_list');
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_faq_list', JSON.stringify(faqs));
    } catch (e) {
      console.error('Failed to save FAQs', e);
    }
  }, [faqs]);

  const addFaq = (faqData: Omit<FAQItem, 'id' | 'views' | 'helpfulCount' | 'unhelpfulCount' | 'lastUpdated'>) => {
    const newFaq: FAQItem = {
      ...faqData,
      id: `faq-${Date.now()}`,
      views: 1,
      helpfulCount: 0,
      unhelpfulCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setFaqs(prev => [newFaq, ...prev]);
    addToast('FAQ Created', `"${newFaq.question}" is now in ${newFaq.status} status.`, 'success');
  };

  const updateFaq = (id: string, updates: Partial<FAQItem>) => {
    setFaqs(prev =>
      prev.map(f =>
        f.id === id
          ? {
              ...f,
              ...updates,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : f
      )
    );
    addToast('FAQ Updated', 'Your changes have been published to the knowledge base.', 'info');
  };

  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    addToast('FAQ Removed', 'Question removed from knowledge base.', 'warning');
  };

  const rateFaq = (id: string, helpful: boolean) => {
    setFaqs(prev =>
      prev.map(f => {
        if (f.id === id) {
          return {
            ...f,
            helpfulCount: helpful ? f.helpfulCount + 1 : f.helpfulCount,
            unhelpfulCount: !helpful ? f.unhelpfulCount + 1 : f.unhelpfulCount,
          };
        }
        return f;
      })
    );
    addToast('Thank you!', helpful ? 'Glad that was helpful.' : 'Feedback recorded for our team.', 'success');
  };

  // Knowledge Documents State
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(INITIAL_KNOWLEDGE_DOCUMENTS);

  const addKnowledgeDoc = (doc: Omit<KnowledgeDocument, 'id' | 'lastIndexed'>) => {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      lastIndexed: new Date().toISOString().split('T')[0],
    };
    setKnowledgeDocs(prev => [newDoc, ...prev]);
    addToast('Document Indexed', `${newDoc.name} processed (${newDoc.chunksCount} chunks).`, 'success');
  };

  const updateKnowledgeDoc = (id: string, updates: Partial<KnowledgeDocument>) => {
    setKnowledgeDocs(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  // Unanswered Questions State
  const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQuestion[]>(INITIAL_UNANSWERED_QUESTIONS);

  const convertUnansweredToFaq = (unansweredId: string, initialQuestion: string, category: string) => {
    setUnansweredQuestions(prev =>
      prev.map(q => (q.id === unansweredId ? { ...q, status: 'Converted to FAQ' } : q))
    );
    addFaq({
      question: initialQuestion,
      shortAnswer: 'Answer drafting in progress by editorial team.',
      answer: 'This answer has been newly provisioned from frequent user queries and is awaiting editorial verification.',
      category: category || 'general',
      keywords: initialQuestion.toLowerCase().split(' ').slice(0, 5),
      relatedFaqIds: [],
      sourceDocument: 'Internal Knowledge Intake 2026',
      sourceDocId: 'doc-internal-intake',
      status: 'Review',
      author: 'Admin Support',
    });
    addToast('Converted to FAQ', 'New draft FAQ created in Review queue.', 'success');
  };

  const ignoreUnansweredQuestion = (id: string) => {
    setUnansweredQuestions(prev => prev.map(q => (q.id === id ? { ...q, status: 'Ignored' } : q)));
    addToast('Query Ignored', 'Item flagged as ignored.', 'info');
  };

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  const createTicket = (
    subject: string,
    description: string,
    category: string,
    priority: SupportTicket['priority']
  ) => {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      ticketNumber: `TICK-${num}`,
      subject,
      description,
      category,
      priority,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userEmail: 'user@example.com',
      userName: 'Current User',
      assignedAgent: 'Support Team',
      responses: [
        {
          id: `resp-${Date.now()}`,
          sender: 'user',
          senderName: 'Current User',
          message: description,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setTickets(prev => [newTicket, ...prev]);
    addToast(
      'Ticket Created',
      `Your ticket ${newTicket.ticketNumber} has been logged. An agent will reply shortly.`,
      'success'
    );
  };

  const replyToTicket = (ticketId: string, message: string, sender: 'user' | 'agent' = 'user') => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const newResp = {
            id: `resp-${Date.now()}`,
            sender,
            senderName: sender === 'user' ? t.userName : (t.assignedAgent || 'Support Specialist'),
            message,
            timestamp: new Date().toISOString(),
          };
          return {
            ...t,
            status: sender === 'user' ? 'In Progress' : 'Waiting for User',
            updatedAt: new Date().toISOString(),
            responses: [...t.responses, newResp],
          };
        }
        return t;
      })
    );
    addToast('Message Sent', 'Your reply has been added to the ticket history.', 'info');
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
    addToast('Status Updated', `Ticket marked as ${status}`, 'info');
  };

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All marked as read.', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Chat Sessions State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('ai_faq_chat_sessions');
      return saved ? JSON.parse(saved) : [DEFAULT_FIRST_SESSION];
    } catch {
      return [DEFAULT_FIRST_SESSION];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(
    chatSessions[0]?.id || DEFAULT_FIRST_SESSION.id
  );

  useEffect(() => {
    if (preferences.retainChatHistory) {
      try {
        localStorage.setItem('ai_faq_chat_sessions', JSON.stringify(chatSessions));
      } catch (e) {
        console.error('Failed to save chat sessions', e);
      }
    } else {
      localStorage.removeItem('ai_faq_chat_sessions');
    }
  }, [chatSessions, preferences.retainChatHistory]);

  const createNewChatSession = (initialMessage?: string): string => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: initialMessage ? (initialMessage.length > 35 ? initialMessage.slice(0, 32) + '...' : initialMessage) : 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: "Hi! I'm your AI FAQ Assistant. How can I help you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 'high',
          confidenceLabel: 'Verified Answer',
          suggestedFollowUps: [
            'How do I create an account?',
            'What payment methods are supported?',
            'How is my data protected?',
          ],
        },
      ],
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    return newId;
  };

  const addChatMessage = (sessionId: string, message: ChatMessage) => {
    setChatSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          const updatedMessages = [...s.messages, message];
          let updatedTitle = s.title;
          if (s.title === 'New Conversation' && message.role === 'user') {
            updatedTitle = message.content.length > 35 ? message.content.slice(0, 32) + '...' : message.content;
          }
          return {
            ...s,
            title: updatedTitle,
            updatedAt: new Date().toISOString(),
            messages: updatedMessages,
          };
        }
        return s;
      })
    );
  };

  const updateChatMessage = (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => {
    setChatSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            messages: s.messages.map(m => (m.id === messageId ? { ...m, ...updates } : m)),
          };
        }
        return s;
      })
    );
  };

  const deleteChatSession = (id: string) => {
    setChatSessions(prev => {
      const remaining = prev.filter(s => s.id !== id);
      if (remaining.length === 0) {
        const fresh = [DEFAULT_FIRST_SESSION];
        setActiveSessionId(DEFAULT_FIRST_SESSION.id);
        return fresh;
      }
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
    addToast('Chat Removed', 'Conversation deleted from history.', 'info');
  };

  const renameChatSession = (id: string, newTitle: string) => {
    setChatSessions(prev =>
      prev.map(s => (s.id === id ? { ...s, title: newTitle.trim() || 'Conversation' } : s))
    );
    addToast('Renamed', 'Conversation title updated.', 'success');
  };

  const clearAllChats = () => {
    setChatSessions([DEFAULT_FIRST_SESSION]);
    setActiveSessionId(DEFAULT_FIRST_SESSION.id);
    addToast('History Cleared', 'All conversation history has been cleared.', 'info');
  };

  // Saved Items State
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai_faq_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_faq_saved', JSON.stringify(savedItems));
    } catch (e) {
      console.error('Failed to store saved items', e);
    }
  }, [savedItems]);

  const toggleSaveFaq = (faq: FAQItem) => {
    setSavedItems(prev => {
      const exists = prev.some(item => item.faqId === faq.id);
      if (exists) {
        addToast('Removed from Saved', `"${faq.question}" removed.`, 'info');
        return prev.filter(item => item.faqId !== faq.id);
      } else {
        addToast('Saved FAQ', `"${faq.question}" added to your saved collection.`, 'success');
        return [
          {
            id: `save-${Date.now()}`,
            type: 'faq',
            title: faq.question,
            snippet: faq.shortAnswer,
            category: faq.category,
            savedAt: new Date().toISOString(),
            faqId: faq.id,
            source: faq.sourceDocument,
          },
          ...prev,
        ];
      }
    });
  };

  const saveAiAnswer = (question: string, answer: string, sourceTitle?: string) => {
    setSavedItems(prev => [
      {
        id: `save-ans-${Date.now()}`,
        type: 'ai-answer',
        title: question,
        snippet: answer,
        savedAt: new Date().toISOString(),
        source: sourceTitle || 'AI Verified Answer',
      },
      ...prev,
    ]);
    addToast('Answer Saved', 'Added to your saved AI answers.', 'success');
  };

  const removeSavedItem = (id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
    addToast('Removed', 'Item removed from saved.', 'info');
  };

  const isFaqSaved = (faqId: string) => {
    return savedItems.some(i => i.faqId === faqId);
  };

  // Modals & Popups
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState<boolean>(false);
  const [escalationQuery, setEscalationQuery] = useState<string>('');
  const [selectedSourceForModal, setSelectedSourceForModal] = useState<SourceCitation | null>(null);

  // Global Keyboard Shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('fast_faq_user');
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('fast_faq_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('fast_faq_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const login = (email: string, pass: string): { success: boolean; message?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const adminEmail = ADMIN_CREDENTIALS.email.toLowerCase();

    // Check admin credentials
    if (trimmedEmail === adminEmail) {
      if (pass === ADMIN_CREDENTIALS.password) {
        const adminUser: AuthUser = {
          id: 'admin-1',
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: 'admin',
          isAdmin: true,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          lastLogin: new Date().toISOString(),
        };
        setCurrentUser(adminUser);
        addToast('Welcome Admin', 'Logged in as Madhan Sudha (Administrator).', 'success');
        return { success: true };
      } else {
        return { success: false, message: 'Incorrect password for administrator account.' };
      }
    }

    // Standard user login
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!pass || pass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    const standardUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: trimmedEmail,
      name: trimmedEmail.split('@')[0].replace(/[._-]/g, ' '),
      role: 'user',
      isAdmin: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedEmail)}`,
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(standardUser);
    addToast('Welcome Back', `Logged in as ${standardUser.name}.`, 'success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Signed Out', 'You have been signed out successfully.', 'info');
  };

  // Helper Actions
  const askQuestionInChat = (question: string) => {
    setCurrentView('chat');
    // We will trigger a send event or load into active session
    window.dispatchEvent(new CustomEvent('ai-ask-query', { detail: { question } }));
  };

  const viewFaqDetail = (faqId: string) => {
    setSelectedFaqId(faqId);
    setCurrentView('faq-detail');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedFaqId,
        setSelectedFaqId,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        theme,
        setTheme,
        effectiveTheme,
        userLanguage,
        setUserLanguage,
        preferences,
        updatePreferences,
        faqs,
        setFaqs,
        addFaq,
        updateFaq,
        deleteFaq,
        rateFaq,
        knowledgeDocs,
        addKnowledgeDoc,
        updateKnowledgeDoc,
        unansweredQuestions,
        convertUnansweredToFaq,
        ignoreUnansweredQuestion,
        tickets,
        createTicket,
        replyToTicket,
        updateTicketStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        chatSessions,
        activeSessionId,
        setActiveSessionId,
        createNewChatSession,
        addChatMessage,
        updateChatMessage,
        deleteChatSession,
        renameChatSession,
        clearAllChats,
        savedItems,
        toggleSaveFaq,
        saveAiAnswer,
        removeSavedItem,
        isFaqSaved,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isProfileOpen,
        setIsProfileOpen,
        isTicketModalOpen,
        setIsTicketModalOpen,
        isEscalationModalOpen,
        setIsEscalationModalOpen,
        escalationQuery,
        setEscalationQuery,
        selectedSourceForModal,
        setSelectedSourceForModal,
        toasts,
        addToast,
        removeToast,
        askQuestionInChat,
        viewFaqDetail,
        currentUser,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
