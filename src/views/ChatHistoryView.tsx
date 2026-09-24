import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  History,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Download,
  Plus,
} from 'lucide-react';

export const ChatHistoryView: React.FC = () => {
  const {
    chatSessions,
    setActiveSessionId,
    setCurrentView,
    deleteChatSession,
    renameChatSession,
    createNewChatSession,
    clearAllChats,
    addToast,
  } = useApp();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      renameChatSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleOpenSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setCurrentView('chat');
  };

  const handleExportSession = (session: any) => {
    const text = `CONVERSATION TRANSCRIPT: ${session.title}
Created: ${new Date(session.createdAt).toLocaleString()}
Messages: ${session.messages.length}

${session.messages
  .map(
    (m: any) =>
      `[${m.role.toUpperCase()}] (${m.timestamp})\n${m.content}\n${
        m.confidence ? `Status: ${m.confidenceLabel || m.confidence}\n` : ''
      }`
  )
  .join('\n----------------------------------------\n\n')}
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${session.title.slice(0, 20).replace(/\s+/g, '_')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Exported', 'Conversation transcript downloaded.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Conversation Logs
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
            Chat History
          </h1>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
            Review, continue, or export your contextual conversations with the assistant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newId = createNewChatSession();
              setCurrentView('chat');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
          {chatSessions.length > 1 && (
            <button
              onClick={clearAllChats}
              className="px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* List of Sessions */}
      <div className="space-y-3">
        {chatSessions.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 space-y-3">
            <History className="w-8 h-8 text-[#6E6E73] mx-auto opacity-50" />
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              No conversation history
            </h3>
            <button
              onClick={() => {
                createNewChatSession();
                setCurrentView('chat');
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl"
            >
              Start Conversation
            </button>
          </div>
        ) : (
          chatSessions.map(session => {
            const isEditing = editingId === session.id;
            const messageCount = session.messages.length;
            const lastMessage = session.messages[session.messages.length - 1];

            return (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-blue-500 bg-white dark:bg-neutral-900 text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-hidden"
                          autoFocus
                        />
                        <button
                          onClick={() => saveRename(session.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-[#6E6E73] hover:bg-neutral-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                          {session.title}
                        </h3>
                        <button
                          onClick={() => startRename(session.id, session.title)}
                          className="p-1 text-[#6E6E73] hover:text-[#1D1D1F] rounded"
                          title="Rename conversation"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1 truncate">
                      {lastMessage ? `${lastMessage.role === 'user' ? 'You: ' : 'AI: '}${lastMessage.content}` : 'No messages'}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                      <span className="tabular-nums font-mono">{messageCount} messages</span>
                      <span>·</span>
                      <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleExportSession(session)}
                    className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Export transcript"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteChatSession(session.id)}
                    className="p-2 text-[#6E6E73] hover:text-rose-600 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenSession(session.id)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <span>Open Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
