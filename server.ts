import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_FAQS, INITIAL_KNOWLEDGE_DOCUMENTS } from './src/data/knowledgeBase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini API SDK on server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper: Enhanced Deterministic Grounded FAQ Matcher Fallback
function matchFaqLocally(query: string, language: string = 'en') {
  const normalized = query.toLowerCase().replace(/[^\w\s\u0B80-\u0BFF\u0900-\u097F]/g, ' ');
  const stopWords = new Set([
    'how', 'what', 'where', 'when', 'why', 'who', 'which', 'can', 'could', 'would', 'should',
    'does', 'do', 'did', 'is', 'are', 'am', 'was', 'were', 'the', 'a', 'an', 'and', 'or', 'to',
    'in', 'for', 'of', 'with', 'on', 'at', 'about', 'by', 'my', 'your', 'i', 'me', 'we', 'you',
    'please', 'tell', 'want', 'know', 'get', 'help'
  ]);

  const rawWords = normalized.split(/\s+/).filter(w => w.length >= 2);
  const meaningfulWords = rawWords.filter(w => !stopWords.has(w));
  const words = meaningfulWords.length > 0 ? meaningfulWords : rawWords;

  // Domain synonym expansions
  const synonyms: Record<string, string[]> = {
    password: ['passcode', 'passkey', 'pw', 'credentials', 'login', 'reset', 'forgot', 'access', 'locked', 'கடவுச்சொல்', 'पासवर्ड'],
    payment: ['pay', 'bill', 'billing', 'card', 'visa', 'mastercard', 'charge', 'invoice', 'checkout', 'receipt', 'பணம்', 'भुगतान'],
    refund: ['moneyback', 'return', 'cancel', 'reimbursement', 'credit', 'ரீஃபண்ட்', 'रिफंड'],
    order: ['track', 'tracking', 'shipment', 'delivery', 'shipped', 'shipping', 'package', 'arrival', 'ஆர்டர்', 'ऑर्डर'],
    support: ['agent', 'human', 'specialist', 'contact', 'call', 'ticket', 'helpdesk', 'உதவி', 'सहायता'],
    security: ['2fa', 'two-factor', 'mfa', 'authenticator', 'hack', 'breach', 'safe', 'பாதுகாப்பு', 'सुरक्षा'],
    privacy: ['gdpr', 'export', 'delete', 'download', 'retention', 'data', 'தனியுரிமை', 'गोपनीयता'],
  };

  let bestFaq = null;
  let bestScore = 0;

  for (const faq of INITIAL_FAQS) {
    let score = 0;
    const fq = faq.question.toLowerCase();
    const fa = faq.answer.toLowerCase();
    const fShort = faq.shortAnswer.toLowerCase();

    // Direct question or answer match
    if (fq.includes(normalized) || normalized.includes(fq)) {
      score += 20;
    }

    // Keyword matches
    for (const kw of faq.keywords) {
      const kwLower = kw.toLowerCase();
      if (normalized.includes(kwLower) || kwLower.includes(normalized)) {
        score += 8;
      }
      for (const w of words) {
        if (kwLower.includes(w) || w.includes(kwLower)) {
          score += 5;
        }
      }
    }

    // Meaningful words overlap in question, answer, and short summary
    for (const w of words) {
      if (fq.includes(w)) score += 4;
      if (fShort.includes(w)) score += 3;
      if (fa.includes(w)) score += 1;

      // Synonym expansion matching
      for (const [canonical, syns] of Object.entries(synonyms)) {
        if (syns.includes(w) || w === canonical) {
          if (fq.includes(canonical) || faq.keywords.some(k => k.toLowerCase().includes(canonical))) {
            score += 4;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestFaq = faq;
    }
  }

  // Determine confidence tier
  if (bestScore >= 6 && bestFaq) {
    return {
      confidence: 'high' as const,
      confidenceLabel: 'Verified Answer',
      answer: bestFaq.answer,
      source: {
        id: bestFaq.id,
        title: bestFaq.question,
        category: bestFaq.category,
        document: bestFaq.sourceDocument,
        lastUpdated: bestFaq.lastUpdated,
      },
      relatedFaqIds: bestFaq.relatedFaqIds,
      suggestedFollowUps: [
        'How long does this process usually take?',
        'Can I configure automated email updates for this?',
        'What if I encounter an error during the steps?',
      ],
    };
  } else if (bestScore >= 3 && bestFaq) {
    return {
      confidence: 'medium' as const,
      confidenceLabel: 'Related Information',
      answer: `While an exact match wasn't found, related verified information from our knowledge base on "${bestFaq.question}" indicates: ${bestFaq.shortAnswer}`,
      source: {
        id: bestFaq.id,
        title: bestFaq.question,
        category: bestFaq.category,
        document: bestFaq.sourceDocument,
        lastUpdated: bestFaq.lastUpdated,
      },
      relatedFaqIds: [bestFaq.id, ...bestFaq.relatedFaqIds].slice(0, 3),
      suggestedFollowUps: [
        'Would you like to speak to a human support agent?',
        'Browse related category FAQs',
        'Ask a different question',
      ],
    };
  } else {
    return {
      confidence: 'low' as const,
      confidenceLabel: 'Information Not Found',
      answer: "I couldn't find enough reliable information to answer this question accurately. Our policy strictly avoids fabricating dates, procedures, or policies. Would you like to connect with our support team or file a support ticket?",
      source: null,
      relatedFaqIds: ['faq-gen-1', 'faq-tech-3'],
      suggestedFollowUps: [
        'Contact Human Support',
        'Create a Support Ticket',
        'Search Knowledge Base Directory',
      ],
    };
  }
}

// Helper: Call Gemini with retry, 503 high-demand mitigation, and secondary model failover
async function generateGroundedResponse(
  ai: GoogleGenAI,
  contents: any[],
  systemPrompt: string,
  modelName = 'gemini-3.8-flash',
  attempt = 0
): Promise<{ text: string; modelUsed: string }> {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    return {
      text: response.text || '',
      modelUsed: modelName,
    };
  } catch (err: any) {
    const errorStr = `${err?.status || ''} ${err?.code || ''} ${err?.message || ''}`;
    const isHighDemandOrUnavailable =
      err?.status === 503 ||
      err?.code === 503 ||
      errorStr.includes('503') ||
      errorStr.includes('high demand') ||
      errorStr.includes('UNAVAILABLE') ||
      errorStr.includes('overloaded') ||
      errorStr.includes('429') ||
      errorStr.includes('RESOURCE_EXHAUSTED');

    if (isHighDemandOrUnavailable) {
      if (attempt === 0) {
        // Attempt 1: Switch to gemini-3.1-flash-lite immediately
        return generateGroundedResponse(ai, contents, systemPrompt, 'gemini-3.1-flash-lite', 1);
      } else if (attempt === 1) {
        // Attempt 2: Exponential backoff jitter (400ms) and retry with gemini-3.1-flash-lite
        await new Promise(resolve => setTimeout(resolve, 400));
        return generateGroundedResponse(ai, contents, systemPrompt, 'gemini-3.1-flash-lite', 2);
      }
    }

    throw err;
  }
}

// API Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!aiClient,
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const {
    message = '',
    history = [],
    language = 'en',
    style = 'standard',
    personality = 'friendly',
    category = 'all',
    mode = 'general', // 'general' (Fast FAQ mode), 'faq' (Knowledge Base mode), or 'auto'
  } = req.body;

  if (!message.trim()) {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  // Filter or prioritize knowledge base context
  const kbContext = INITIAL_FAQS.map(f => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
    source: f.sourceDocument,
    lastUpdated: f.lastUpdated,
  }));

  const localFallback = matchFaqLocally(message, language);

  if (!aiClient) {
    // If no GEMINI_API_KEY is available in local env, use grounded local matcher
    res.json({
      ...localFallback,
      responseTimeMs: Date.now() - startTime,
      modelUsed: 'grounded-kb-engine',
    });
    return;
  }

  try {
    let systemPrompt = '';

    if (mode === 'general') {
      systemPrompt = `You are Fast FAQ, an advanced, highly capable AI Assistant built to answer ANY question with absolute accuracy, depth, and clarity.
You can answer any topic: programming, coding, debugging, math, science, history, geography, business, everyday questions, general knowledge, problem-solving, and language translation.

Core Guidelines:
1. Correctness: Always give the correct, factual, and most helpful answer to whatever question the user asks. Never refuse general knowledge questions.
2. Markdown Formatting: Use clean Markdown: bold headings, bullet points, clean lists, and syntax-highlighted code blocks (\`\`\`typescript, \`\`\`python, \`\`\`bash, etc.) where applicable.
3. Language: Answer fluently in ${language.toUpperCase()} (e.g., 'en' for English, 'ta' for Tamil, 'hi' for Hindi, 'es' for Spanish, etc.).
4. Style: ${style}, tone: ${personality}, clear and direct.
5. Provide 3 smart follow-up suggestions in suggestedFollowUps.

Output format:
You MUST return ONLY valid JSON matching this schema:
{
  "answer": string,
  "confidence": "high",
  "confidenceLabel": "Fast FAQ Intelligence",
  "source": null,
  "relatedFaqIds": [],
  "suggestedFollowUps": string[]
}`;
    } else {
      systemPrompt = `You are Fast FAQ, an intelligent AI Assistant and Knowledge Guide.
Your mission is to answer ANY question the user asks with accuracy, correctness, and helpfulness.

KNOWLEDGE BASE:
${JSON.stringify(kbContext, null, 2)}

INSTRUCTIONS:
1. Always Answer Correctly:
   - For ANY question the user asks, provide the correct, reliable, and complete answer.
   - If the question relates to platform FAQs or company policies (returns, shipping, refunds, warranties, accounts, security, API integration, billing), ground the answer in the provided KNOWLEDGE BASE, assign "confidence": "high", "confidenceLabel": "Verified Answer", and include the matched source object in "source".
   - If the question is about ANY OTHER topic (science, coding, math, general knowledge, history, everyday questions, advice, tech, health, etc.), provide a thorough, accurate, and completely correct answer using your deep general knowledge! Assign "confidence": "high", "confidenceLabel": "Fast FAQ Answer", and set "source": null.
   - DO NOT refuse to answer or say "I couldn't find enough information" for general questions. Always provide the correct answer.
2. Formatting:
   - Format with clean Markdown: bold titles, bullet points, and code blocks with language tags when relevant.
3. Language:
   - Answer in ${language.toUpperCase()} (e.g. if 'ta' -> Tamil, 'hi' -> Hindi, 'en' -> English).
4. Tone & Style:
   - Style: ${style}, Personality: ${personality}, thoughtful, polite, and precise.
5. Output format:
   You MUST return ONLY valid JSON matching this schema:
   {
     "answer": string,
     "confidence": "high" | "medium",
     "confidenceLabel": "Verified Answer" | "Fast FAQ Answer" | "Related Information",
     "source": {
       "id": string,
       "title": string,
       "category": string,
       "document": string,
       "lastUpdated": string
     } | null,
     "relatedFaqIds": string[],
     "suggestedFollowUps": string[]
   }`;
    }

    // Format conversation history
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-4)) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const { text, modelUsed } = await generateGroundedResponse(
      aiClient,
      contents,
      systemPrompt,
      'gemini-3.8-flash'
    );

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = localFallback;
    }

    res.json({
      ...parsed,
      responseTimeMs: Date.now() - startTime,
      modelUsed,
    });
  } catch (err: any) {
    // Graceful fallback to verified local knowledge base
    res.json({
      ...localFallback,
      responseTimeMs: Date.now() - startTime,
      modelUsed: 'grounded-kb-engine-fallback',
      statusNote: 'Delivered from grounded knowledge base while AI model was busy.',
    });
  }
});

// Admin playground test endpoint
app.post('/api/ai/test-answer', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'Question is required' });
    return;
  }

  const result = matchFaqLocally(question);
  res.json({
    ...result,
    responseTimeMs: Date.now() - startTime,
    testedAt: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`AI FAQ Assistant server running on http://localhost:${PORT}`);
  });
}

startServer();
