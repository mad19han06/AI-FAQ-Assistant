export type ViewMode =
  | 'landing'
  | 'chat'
  | 'faqs'
  | 'faq-detail'
  | 'categories'
  | 'saved'
  | 'history'
  | 'support'
  | 'admin'
  | 'login';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isAdmin: boolean;
  avatar?: string;
  lastLogin?: string;
}

export type AdminTab =
  | 'overview'
  | 'faqs'
  | 'unanswered'
  | 'knowledge-base'
  | 'playground'
  | 'feedback'
  | 'tickets'
  | 'audit';

export type ConfidenceTier = 'high' | 'medium' | 'low';

export interface SourceCitation {
  id: string;
  title: string;
  category: string;
  document: string;
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: ConfidenceTier;
  confidenceLabel?: string;
  source?: SourceCitation | null;
  relatedFaqIds?: string[];
  suggestedFollowUps?: string[];
  feedback?: 'helpful' | 'unhelpful' | null;
  feedbackComment?: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  archived?: boolean;
  category?: string;
}

export interface SavedItem {
  id: string;
  type: 'faq' | 'ai-answer' | 'conversation';
  title: string;
  snippet: string;
  category?: string;
  savedAt: string;
  faqId?: string;
  sessionId?: string;
  source?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  responseStyle: 'concise' | 'standard' | 'detailed';
  personality: 'professional' | 'friendly' | 'simple';
  voicePlayback: boolean;
  emailNotifications: boolean;
  retainChatHistory: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
