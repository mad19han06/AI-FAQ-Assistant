export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  shortAnswer: string;
  category: string;
  keywords: string[];
  relatedFaqIds: string[];
  sourceDocument: string;
  sourceDocId: string;
  status: 'Published' | 'Approved' | 'Review' | 'Draft';
  lastUpdated: string;
  views: number;
  helpfulCount: number;
  unhelpfulCount: number;
  author: string;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: 'FAQ Document' | 'PDF Document' | 'DOCX Document' | 'Website Content' | 'Help Article' | 'Internal Documentation';
  status: 'Active' | 'Review' | 'Archived';
  lastIndexed: string;
  chunksCount: number;
  size: string;
  category: string;
  urlOrFilename: string;
  needsReview?: boolean;
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  date: string;
  frequency: number;
  categorySuggestion: string;
  status: 'New' | 'Under Review' | 'Converted to FAQ' | 'Ignored';
  sampleUserQuery: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Submitted' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  userEmail: string;
  userName: string;
  assignedAgent?: string;
  responses: Array<{
    id: string;
    sender: 'user' | 'agent' | 'system';
    senderName: string;
    message: string;
    timestamp: string;
  }>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'faq' | 'ticket' | 'system' | 'knowledge';
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'account',
    name: 'Account & Login',
    slug: 'account',
    description: 'Manage profiles, authentication, passwords, and security settings.',
    iconName: 'UserCheck',
    color: '#007AFF'
  },
  {
    id: 'payments',
    name: 'Payments & Billing',
    slug: 'payments',
    description: 'Billing cycles, payment methods, refund claims, and receipts.',
    iconName: 'CreditCard',
    color: '#34C759'
  },
  {
    id: 'orders',
    name: 'Orders & Subscriptions',
    slug: 'orders',
    description: 'Service renewals, order tracking, tier upgrades, and cancellations.',
    iconName: 'Package',
    color: '#FF9500'
  },
  {
    id: 'technical',
    name: 'Technical Support',
    slug: 'technical',
    description: 'Troubleshooting errors, browser compatibility, and app updates.',
    iconName: 'Cpu',
    color: '#5856D6'
  },
  {
    id: 'security',
    name: 'Security & Auth',
    slug: 'security',
    description: 'Two-factor authentication, encryption protocols, and incident reporting.',
    iconName: 'ShieldCheck',
    color: '#00C7BE'
  },
  {
    id: 'privacy',
    name: 'Privacy & Data',
    slug: 'privacy',
    description: 'Data exports, chat history storage, GDPR, and deletion requests.',
    iconName: 'Lock',
    color: '#AF52DE'
  },
  {
    id: 'general',
    name: 'General Services',
    slug: 'general',
    description: 'Platform features, uptime status, onboarding guides, and support hours.',
    iconName: 'HelpCircle',
    color: '#FF2D55'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-acc-1',
    question: 'How do I create an account?',
    shortAnswer: 'Click Get Started on the home screen, provide your email, set a secure passcode, and verify your email link.',
    answer: 'To create an account, click the "Get Started" or "Sign In" button in the upper right navigation. Enter your corporate or personal email address, generate a strong passkey or password with at least 8 characters, and confirm your email through the verification link sent to your inbox. Once verified, your account is immediately active.',
    category: 'account',
    keywords: ['create', 'register', 'sign up', 'join', 'new account', 'login setup'],
    relatedFaqIds: ['faq-acc-2', 'faq-acc-3', 'faq-sec-2'],
    sourceDocument: 'Account Management Handbook (Sec 1.2)',
    sourceDocId: 'doc-acc-handbook',
    status: 'Published',
    lastUpdated: '2026-03-15',
    views: 1420,
    helpfulCount: 384,
    unhelpfulCount: 6,
    author: 'Security & Auth Team'
  },
  {
    id: 'faq-acc-2',
    question: 'How do I reset my password?',
    shortAnswer: 'Select "Forgot Password" on the login screen, enter your email, and follow the one-time reset link sent to you.',
    answer: 'Go to the login screen and select "Forgot Password". Enter your registered email address. You will receive an email within 60 seconds containing a secure, single-use password reset link valid for 15 minutes. Open the link, specify your new password, and confirm. If you do not receive the email, check your spam filter or verify your account email address.',
    category: 'account',
    keywords: ['reset', 'password', 'forgot password', 'recover', 'access', 'cannot log in', 'locked out'],
    relatedFaqIds: ['faq-acc-1', 'faq-acc-4', 'faq-sec-2'],
    sourceDocument: 'Authentication & Credential Recovery Policy',
    sourceDocId: 'doc-auth-policy',
    status: 'Published',
    lastUpdated: '2026-04-02',
    views: 2890,
    helpfulCount: 820,
    unhelpfulCount: 14,
    author: 'Identity Engineering'
  },
  {
    id: 'faq-acc-3',
    question: 'How do I change my email?',
    shortAnswer: 'Navigate to Profile → Settings → Account Details, enter your new email, and confirm verification on both addresses.',
    answer: 'Open your Profile menu in the top bar and choose "Settings". In the Account section, click "Edit Email Address". For account security, you must enter your current password. Enter the new email address and confirm. Verification emails will be sent to both your original and new email addresses to prevent unauthorized takeovers.',
    category: 'account',
    keywords: ['change email', 'update email', 'new email', 'email address', 'transfer account'],
    relatedFaqIds: ['faq-acc-2', 'faq-sec-2'],
    sourceDocument: 'Account Management Handbook (Sec 2.4)',
    sourceDocId: 'doc-acc-handbook',
    status: 'Published',
    lastUpdated: '2026-02-18',
    views: 940,
    helpfulCount: 215,
    unhelpfulCount: 5,
    author: 'Account Operations'
  },
  {
    id: 'faq-acc-4',
    question: 'Why is my account locked?',
    shortAnswer: 'Accounts are temporarily locked after 5 consecutive failed login attempts for 30 minutes, or due to suspicious location flags.',
    answer: 'To protect your data against brute-force attacks, accounts are automatically restricted for 30 minutes following 5 consecutive failed authentication attempts. You can either wait for the 30-minute security window to expire or immediately unlock your access by using the "Forgot Password" self-service verification option.',
    category: 'account',
    keywords: ['locked', 'account locked', 'frozen', 'blocked', 'too many attempts', 'disabled'],
    relatedFaqIds: ['faq-acc-2', 'faq-sec-3'],
    sourceDocument: 'Risk Engine & Brute Force Prevention Doc',
    sourceDocId: 'doc-auth-policy',
    status: 'Published',
    lastUpdated: '2026-03-22',
    views: 1120,
    helpfulCount: 310,
    unhelpfulCount: 9,
    author: 'SecOps Team'
  },
  {
    id: 'faq-pay-1',
    question: 'What payment methods are supported?',
    shortAnswer: 'We accept all major credit cards (Visa, MasterCard, Amex), Apple Pay, Google Pay, and SEPA/ACH wire transfers.',
    answer: 'AI FAQ Assistant supports Visa, MasterCard, American Express, Apple Pay, Google Pay, and direct ACH/SEPA wire transfers for annual enterprise agreements. All transactions are securely processed through end-to-end PCI-DSS Level 1 tokenization. We do not store raw card numbers on our servers.',
    category: 'payments',
    keywords: ['payment', 'credit card', 'apple pay', 'billing methods', 'visa', 'mastercard', 'invoice payment'],
    relatedFaqIds: ['faq-pay-2', 'faq-pay-3'],
    sourceDocument: 'Global Billing & Currency Directory',
    sourceDocId: 'doc-billing-guide',
    status: 'Published',
    lastUpdated: '2026-03-10',
    views: 3150,
    helpfulCount: 740,
    unhelpfulCount: 11,
    author: 'Finance Department'
  },
  {
    id: 'faq-pay-2',
    question: 'How do I request a refund?',
    shortAnswer: 'Submit a refund request within 14 days of purchase via Settings → Billing or by opening a support ticket.',
    answer: 'We provide a 14-day hassle-free refund policy on initial subscriptions. To request a refund, go to Profile → Settings → Billing, select the invoice in question, and click "Request Refund". Alternatively, you can create a Support Ticket with the category "Payments" and your invoice number. Approved refunds are credited back to your original payment method in 3–5 business days.',
    category: 'payments',
    keywords: ['refund', 'money back', 'cancel subscription', 'return', 'reimbursement', 'dispute charge'],
    relatedFaqIds: ['faq-pay-1', 'faq-pay-3', 'faq-ord-2'],
    sourceDocument: 'Refund & Subscription Cancellation Terms',
    sourceDocId: 'doc-terms-conditions',
    status: 'Published',
    lastUpdated: '2026-03-28',
    views: 2420,
    helpfulCount: 650,
    unhelpfulCount: 19,
    author: 'Customer Advocacy'
  },
  {
    id: 'faq-pay-3',
    question: 'Where can I find my invoice?',
    shortAnswer: 'Invoices and tax receipts are available for download as PDFs in Settings → Billing History.',
    answer: 'All historical billing statements and VAT/tax invoices are generated in PDF format. Navigate to Settings → Billing History. Each statement lists date, transaction reference, tax breakdown, and a direct "Download PDF Invoice" button. You can also configure automated monthly invoice emails in your notification preferences.',
    category: 'payments',
    keywords: ['invoice', 'receipt', 'tax invoice', 'billing history', 'vat', 'statement', 'download receipt'],
    relatedFaqIds: ['faq-pay-1', 'faq-pay-2'],
    sourceDocument: 'Tax Compliance & Invoice Guide v3',
    sourceDocId: 'doc-billing-guide',
    status: 'Published',
    lastUpdated: '2026-02-14',
    views: 1850,
    helpfulCount: 490,
    unhelpfulCount: 7,
    author: 'Finance Department'
  },
  {
    id: 'faq-tech-1',
    question: "Why isn't the application loading?",
    shortAnswer: 'Ensure you have an active internet connection, clear your browser cache, or verify your browser supports modern ES2022 standards.',
    answer: 'If the app fails to load, first verify your network connection. Then try a hard refresh (Cmd+Shift+R on Mac, Ctrl+F5 on Windows). If the issue persists, clear your browser storage and cookies for this domain, or disable aggressive ad-blocking extensions that may block secure API calls. We support Safari 16+, Chrome 110+, Edge 110+, and Firefox 115+.',
    category: 'technical',
    keywords: ['not loading', 'blank screen', 'offline', 'error loading', 'cannot open', 'slow', 'cache'],
    relatedFaqIds: ['faq-tech-2', 'faq-tech-3'],
    sourceDocument: 'Browser Support Matrix & Diagnostics',
    sourceDocId: 'doc-tech-matrix',
    status: 'Published',
    lastUpdated: '2026-04-05',
    views: 2100,
    helpfulCount: 520,
    unhelpfulCount: 22,
    author: 'Platform Core Team'
  },
  {
    id: 'faq-tech-2',
    question: 'How do I update the application?',
    shortAnswer: 'Web apps update automatically on refresh; PWA users can tap the update banner or restart the app.',
    answer: 'The web application automatically detects newly deployed builds. When an update is ready, a quiet notification banner appears asking you to "Reload to apply update". If you installed the app to your home screen or dock as a PWA, closing and reopening the application will automatically cache the latest assets.',
    category: 'technical',
    keywords: ['update', 'new version', 'pwa update', 'refresh app', 'upgrade software'],
    relatedFaqIds: ['faq-tech-1'],
    sourceDocument: 'Deployment Release Notes & Service Worker Guide',
    sourceDocId: 'doc-tech-matrix',
    status: 'Published',
    lastUpdated: '2026-03-30',
    views: 890,
    helpfulCount: 270,
    unhelpfulCount: 3,
    author: 'DevOps & Release'
  },
  {
    id: 'faq-tech-3',
    question: 'What should I do if I receive an error?',
    shortAnswer: 'Note the error code, refresh the session, and use the Contact Support button to submit a ticket with details.',
    answer: 'If an error dialog appears, copy the error code or description shown. Refresh the page or click "Try Again". If the error reoccurs, click the "Contact Support" button directly below the message or open the Support Ticket modal. Our automated diagnostic telemetry flags server incidents in real time.',
    category: 'technical',
    keywords: ['error', 'bug', 'crash', 'problem', 'failure', 'something went wrong', 'exception'],
    relatedFaqIds: ['faq-tech-1', 'faq-gen-1'],
    sourceDocument: 'Client Error Codes & Diagnostic Reference',
    sourceDocId: 'doc-tech-matrix',
    status: 'Published',
    lastUpdated: '2026-04-01',
    views: 1340,
    helpfulCount: 405,
    unhelpfulCount: 12,
    author: 'Support Operations'
  },
  {
    id: 'faq-sec-1',
    question: 'How is my information protected?',
    shortAnswer: 'All data is encrypted in transit via TLS 1.3 and at rest with AES-256 GCM encryption on dedicated cloud infrastructure.',
    answer: 'We employ Apple-grade privacy-by-design architecture. Customer records and uploaded documents are encrypted at rest using AES-256-GCM with envelope key rotation. All client-server communications use TLS 1.3 with strict HTTP Strict Transport Security (HSTS). We perform continuous automated vulnerability audits and never sell or monetize user data.',
    category: 'security',
    keywords: ['security', 'encryption', 'privacy', 'aes-256', 'tls', 'safe', 'data protection'],
    relatedFaqIds: ['faq-sec-2', 'faq-priv-1'],
    sourceDocument: 'Enterprise Security Architecture Whitepaper',
    sourceDocId: 'doc-security-whitepaper',
    status: 'Published',
    lastUpdated: '2026-03-12',
    views: 3820,
    helpfulCount: 960,
    unhelpfulCount: 8,
    author: 'Chief Information Security Office'
  },
  {
    id: 'faq-sec-2',
    question: 'How do I enable two-factor authentication (2FA)?',
    shortAnswer: 'Go to Profile → Security → Two-Factor Authentication and link your preferred authenticator app via QR code.',
    answer: 'To protect your account with 2FA, open Settings and select the "Security" tab. Toggle "Two-Factor Authentication" on. Scan the presented QR code with your authenticator app (such as Apple Passwords, Google Authenticator, or 1Password), enter the 6-digit confirmation token, and safely store the emergency backup recovery codes shown on the screen.',
    category: 'security',
    keywords: ['2fa', 'two-factor', 'mfa', 'authenticator', 'totp', 'security code', 'protect account'],
    relatedFaqIds: ['faq-sec-1', 'faq-acc-2'],
    sourceDocument: 'Multi-Factor Authentication Standard',
    sourceDocId: 'doc-security-whitepaper',
    status: 'Published',
    lastUpdated: '2026-03-25',
    views: 2650,
    helpfulCount: 780,
    unhelpfulCount: 15,
    author: 'SecOps Team'
  },
  {
    id: 'faq-sec-3',
    question: 'How do I report suspicious activity?',
    shortAnswer: 'Immediately change your password, revoke active sessions under Security settings, and email security@company.internal.',
    answer: 'If you notice unfamiliar login notifications or unauthorized changes, immediately visit Settings → Security and click "Terminate All Other Sessions". Next, change your password and ensure 2FA is enabled. Finally, file an urgent priority Support Ticket or email our 24/7 Security Incident Response Team at security@company.internal.',
    category: 'security',
    keywords: ['suspicious', 'hack', 'unauthorized', 'compromised', 'phishing', 'breach', 'report'],
    relatedFaqIds: ['faq-sec-1', 'faq-sec-2', 'faq-acc-4'],
    sourceDocument: 'Security Incident Reporting & Response SLA',
    sourceDocId: 'doc-security-whitepaper',
    status: 'Published',
    lastUpdated: '2026-02-28',
    views: 780,
    helpfulCount: 195,
    unhelpfulCount: 2,
    author: 'Incident Response'
  },
  {
    id: 'faq-ord-1',
    question: 'How do I track my service order or subscription status?',
    shortAnswer: 'View your active plan, upcoming renewals, and order history in the Orders & Subscriptions panel.',
    answer: 'All active subscriptions and custom service engagements are tracked in real time. Click your avatar and select "Subscriptions & Orders". You can see current provisioning status, subscription term dates, plan limits, and upgrade or downgrade options with transparent prorated billing.',
    category: 'orders',
    keywords: ['track order', 'subscription status', 'renewal', 'plan', 'tier', 'service status'],
    relatedFaqIds: ['faq-ord-2', 'faq-pay-3'],
    sourceDocument: 'Service Level Agreement & Subscription Terms',
    sourceDocId: 'doc-terms-conditions',
    status: 'Published',
    lastUpdated: '2026-03-18',
    views: 1290,
    helpfulCount: 340,
    unhelpfulCount: 8,
    author: 'Customer Success'
  },
  {
    id: 'faq-ord-2',
    question: 'Can I cancel an order or subscription after submission?',
    shortAnswer: 'Yes, you can cancel your subscription at any time without penalty; benefits continue until the end of your billing cycle.',
    answer: 'You may cancel any recurring subscription at any moment from Settings → Billing → Cancel Plan. You will retain full access to all features until the end of your prepaid billing period, with no subsequent charges. For custom deployment orders, cancellations are permitted within 24 hours of order placement before hardware or server resources are provisioned.',
    category: 'orders',
    keywords: ['cancel order', 'cancel subscription', 'stop renewal', 'downgrade', 'unsubscribe'],
    relatedFaqIds: ['faq-ord-1', 'faq-pay-2'],
    sourceDocument: 'Refund & Subscription Cancellation Terms',
    sourceDocId: 'doc-terms-conditions',
    status: 'Published',
    lastUpdated: '2026-03-14',
    views: 1980,
    helpfulCount: 510,
    unhelpfulCount: 14,
    author: 'Customer Advocacy'
  },
  {
    id: 'faq-priv-1',
    question: 'What privacy controls are available?',
    shortAnswer: 'You can disable AI query retention, clear chat history, export your data in JSON/PDF, or request permanent deletion.',
    answer: 'We believe privacy is a fundamental human right. Under Profile → Settings → Privacy, you have granular controls: toggle conversation memory on or off, delete historical AI chat logs with one click, download an encrypted machine-readable export of all your records, and request full GDPR/CCPA account erasure.',
    category: 'privacy',
    keywords: ['privacy', 'data controls', 'chat history delete', 'gdpr', 'ccpa', 'erasure', 'export data'],
    relatedFaqIds: ['faq-priv-2', 'faq-sec-1'],
    sourceDocument: 'Comprehensive Privacy Policy & User Rights',
    sourceDocId: 'doc-privacy-charter',
    status: 'Published',
    lastUpdated: '2026-03-01',
    views: 2210,
    helpfulCount: 620,
    unhelpfulCount: 4,
    author: 'Legal & Privacy Counsel'
  },
  {
    id: 'faq-priv-2',
    question: 'Does the AI assistant store my chat queries?',
    shortAnswer: 'Queries are processed in transient memory to generate answers and are not used to train global public AI models.',
    answer: 'No. Your conversational queries are strictly processed to retrieve matching knowledge base passages and formulate answers. Customer conversation data is never sold, shared with advertising brokers, or used to train public foundation models without explicit organizational consent.',
    category: 'privacy',
    keywords: ['ai training', 'store chat', 'ai privacy', 'chat logs', 'llm training', 'confidential'],
    relatedFaqIds: ['faq-priv-1', 'faq-sec-1'],
    sourceDocument: 'Responsible AI & Data Retention Charter',
    sourceDocId: 'doc-privacy-charter',
    status: 'Published',
    lastUpdated: '2026-03-20',
    views: 2750,
    helpfulCount: 780,
    unhelpfulCount: 9,
    author: 'AI Safety & Governance'
  },
  {
    id: 'faq-gen-1',
    question: 'How can I contact support?',
    shortAnswer: 'You can reach human support via the Support Ticket portal, live chat during business hours, or emailing support@company.internal.',
    answer: 'If the AI assistant cannot resolve your question, our human specialist team is available. You can submit a Support Ticket directly in the app (with status tracking), initiate a live chat session (available Mon-Fri 8am-8pm EST), or email support@company.internal. Average ticket first-response time is under 18 minutes.',
    category: 'general',
    keywords: ['contact support', 'human agent', 'help desk', 'customer service', 'live chat', 'phone', 'ticket'],
    relatedFaqIds: ['faq-tech-3', 'faq-pay-2'],
    sourceDocument: 'Customer Support Escalation & SLAs',
    sourceDocId: 'doc-support-sla',
    status: 'Published',
    lastUpdated: '2026-04-01',
    views: 4100,
    helpfulCount: 1150,
    unhelpfulCount: 18,
    author: 'Customer Experience Lead'
  }
];

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-acc-handbook',
    name: 'Account Management Handbook 2026.pdf',
    type: 'PDF Document',
    status: 'Active',
    lastIndexed: '2026-04-02',
    chunksCount: 48,
    size: '2.4 MB',
    category: 'Account & Login',
    urlOrFilename: 'docs/account_handbook_v4.pdf'
  },
  {
    id: 'doc-auth-policy',
    name: 'Authentication & Credential Recovery Policy.docx',
    type: 'DOCX Document',
    status: 'Active',
    lastIndexed: '2026-04-02',
    chunksCount: 32,
    size: '1.1 MB',
    category: 'Account & Login',
    urlOrFilename: 'docs/auth_recovery_v3.docx'
  },
  {
    id: 'doc-billing-guide',
    name: 'Global Billing & Currency Directory.pdf',
    type: 'PDF Document',
    status: 'Active',
    lastIndexed: '2026-03-28',
    chunksCount: 64,
    size: '3.8 MB',
    category: 'Payments & Billing',
    urlOrFilename: 'docs/global_billing_2026.pdf'
  },
  {
    id: 'doc-terms-conditions',
    name: 'Refund & Subscription Terms of Service',
    type: 'Website Content',
    status: 'Active',
    lastIndexed: '2026-03-25',
    chunksCount: 28,
    size: '640 KB',
    category: 'Orders & Subscriptions',
    urlOrFilename: 'https://help.company.internal/legal/terms'
  },
  {
    id: 'doc-tech-matrix',
    name: 'Client Diagnostics & Browser Compatibility Matrix',
    type: 'Help Article',
    status: 'Active',
    lastIndexed: '2026-04-05',
    chunksCount: 36,
    size: '820 KB',
    category: 'Technical Support',
    urlOrFilename: 'https://help.company.internal/kb/browser-support'
  },
  {
    id: 'doc-security-whitepaper',
    name: 'Enterprise Security Architecture Whitepaper v4.pdf',
    type: 'PDF Document',
    status: 'Active',
    lastIndexed: '2026-03-12',
    chunksCount: 92,
    size: '5.2 MB',
    category: 'Security & Auth',
    urlOrFilename: 'docs/security_whitepaper_2026.pdf'
  },
  {
    id: 'doc-privacy-charter',
    name: 'Responsible AI & Data Retention Charter',
    type: 'Internal Documentation',
    status: 'Active',
    lastIndexed: '2026-03-20',
    chunksCount: 42,
    size: '1.4 MB',
    category: 'Privacy & Data',
    urlOrFilename: 'wiki://compliance/responsible_ai_charter'
  },
  {
    id: 'doc-legacy-api',
    name: 'Legacy On-Premises API Migration Notes (2025)',
    type: 'Internal Documentation',
    status: 'Review',
    lastIndexed: '2025-11-10',
    chunksCount: 18,
    size: '950 KB',
    category: 'Technical Support',
    urlOrFilename: 'wiki://eng/legacy_api_notes',
    needsReview: true
  }
];

export const INITIAL_UNANSWERED_QUESTIONS: UnansweredQuestion[] = [
  {
    id: 'unans-1',
    question: 'Can I pay my invoice using cryptocurrency or Bitcoin?',
    date: '2026-04-06',
    frequency: 34,
    categorySuggestion: 'payments',
    status: 'New',
    sampleUserQuery: 'Do you accept BTC, ETH or USDC stablecoins for billing?'
  },
  {
    id: 'unans-2',
    question: 'Can I use a physical YubiKey or WebAuthn hardware security key for login?',
    date: '2026-04-04',
    frequency: 28,
    categorySuggestion: 'security',
    status: 'Under Review',
    sampleUserQuery: 'Is FIDO2 / YubiKey hardware token supported for 2FA?'
  },
  {
    id: 'unans-3',
    question: 'Where is your regional office located in Tokyo or Singapore?',
    date: '2026-03-29',
    frequency: 19,
    categorySuggestion: 'general',
    status: 'New',
    sampleUserQuery: 'Physical address for Asia-Pacific APAC corporate headquarters'
  },
  {
    id: 'unans-4',
    question: 'How do I transfer organization team ownership to a new administrator email?',
    date: '2026-03-22',
    frequency: 41,
    categorySuggestion: 'account',
    status: 'Under Review',
    sampleUserQuery: 'Owner left the company, how to assign master admin role'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tick-101',
    ticketNumber: 'TICK-8492',
    subject: 'Cannot access workspace after domain email migration',
    description: 'Our team changed corporate domains from @company.io to @company.com yesterday and 4 users are receiving invalid SAML token errors.',
    category: 'Account & Login',
    priority: 'Urgent',
    status: 'In Progress',
    createdAt: '2026-04-06T10:14:00Z',
    updatedAt: '2026-04-06T11:30:00Z',
    userEmail: 'admin@acmecorp.com',
    userName: 'Elena Rostova',
    assignedAgent: 'Marcus Vance',
    responses: [
      {
        id: 'resp-1',
        sender: 'user',
        senderName: 'Elena Rostova',
        message: 'Our corporate SAML certificate was updated. Could you check if the SSO assertion matches on your identity provider config?',
        timestamp: '2026-04-06T10:14:00Z'
      },
      {
        id: 'resp-2',
        sender: 'agent',
        senderName: 'Marcus Vance',
        message: 'Hello Elena, our Identity Ops team is currently inspecting your SAML ACS endpoint configuration. We will synchronize the new certificate within the next 20 minutes.',
        timestamp: '2026-04-06T11:30:00Z'
      }
    ]
  },
  {
    id: 'tick-102',
    ticketNumber: 'TICK-8488',
    subject: 'Request for custom VAT invoice for European subsidiary',
    description: 'We require our EU VAT registration number (DE328194019) printed on the quarterly receipt for accounting compliance.',
    category: 'Payments & Billing',
    priority: 'Medium',
    status: 'Waiting for User',
    createdAt: '2026-04-05T14:22:00Z',
    updatedAt: '2026-04-05T16:05:00Z',
    userEmail: 'finance@berlin-tech.de',
    userName: 'Lukas Meyer',
    assignedAgent: 'Sarah Lin',
    responses: [
      {
        id: 'resp-3',
        sender: 'user',
        senderName: 'Lukas Meyer',
        message: 'Please update invoice #INV-2026-0391 with VAT DE328194019.',
        timestamp: '2026-04-05T14:22:00Z'
      },
      {
        id: 'resp-4',
        sender: 'agent',
        senderName: 'Sarah Lin',
        message: 'Hi Lukas, we generated an updated reverse-charge tax statement. Please confirm if the company legal address on file is up to date.',
        timestamp: '2026-04-05T16:05:00Z'
      }
    ]
  },
  {
    id: 'tick-103',
    ticketNumber: 'TICK-8450',
    subject: 'Automated data retention schedule clarification',
    description: 'Checking whether logs older than 90 days are deleted permanently or archived in cold Glacier storage.',
    category: 'Privacy & Data',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-04-01T09:00:00Z',
    updatedAt: '2026-04-02T15:10:00Z',
    userEmail: 'compliance@nordichealth.se',
    userName: 'Freja Lindqvist',
    assignedAgent: 'Marcus Vance',
    responses: [
      {
        id: 'resp-5',
        sender: 'user',
        senderName: 'Freja Lindqvist',
        message: 'Can you confirm the cryptographic erasure procedure after 90 days retention?',
        timestamp: '2026-04-01T09:00:00Z'
      },
      {
        id: 'resp-6',
        sender: 'agent',
        senderName: 'Marcus Vance',
        message: 'Confirmed! In compliance with GDPR Article 17, cryptographic keys for expired shards are shredded, rendering data permanently unrecoverable.',
        timestamp: '2026-04-02T15:10:00Z'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Knowledge Base Updated',
    message: 'Updated guidelines for Two-Factor Authentication & Account Recovery have been published.',
    type: 'knowledge',
    date: '10 minutes ago',
    read: false,
    actionUrl: '/faq/faq-sec-2'
  },
  {
    id: 'notif-2',
    title: 'Ticket #TICK-8492 Updated',
    message: 'Marcus Vance replied to your ticket "Cannot access workspace after domain email migration".',
    type: 'ticket',
    date: '1 hour ago',
    read: false,
    actionUrl: '/support'
  },
  {
    id: 'notif-3',
    title: 'System Maintenance Completed',
    message: 'Global edge cache optimization completed with zero downtime. Mean query latency improved by 35%.',
    type: 'system',
    date: 'Yesterday',
    read: true
  },
  {
    id: 'notif-4',
    title: 'New FAQ Added: Privacy Controls',
    message: 'Learn how to export conversational logs or configure zero-retention mode.',
    type: 'faq',
    date: '2 days ago',
    read: true,
    actionUrl: '/faq/faq-priv-1'
  }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' }
];
