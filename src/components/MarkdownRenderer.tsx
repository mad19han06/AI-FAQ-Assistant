import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Split by code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; lang?: string; text: string }> = [];

  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        text: content.slice(lastIndex, match.index),
      });
    }

    parts.push({
      type: 'code',
      lang: match[1] || 'plaintext',
      text: match[2].trimEnd(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      text: content.slice(lastIndex),
    });
  }

  const renderFormattedText = (textBlock: string) => {
    const lines = textBlock.split('\n');

    return (
      <div className="space-y-2 leading-relaxed">
        {lines.map((line, lIdx) => {
          // Empty line
          if (!line.trim()) {
            return <div key={lIdx} className="h-1.5" />;
          }

          // Heading 3
          if (line.startsWith('### ')) {
            return (
              <h4 key={lIdx} className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-3 mb-1">
                {renderInlineStyles(line.slice(4))}
              </h4>
            );
          }

          // Heading 2
          if (line.startsWith('## ')) {
            return (
              <h3 key={lIdx} className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mt-4 mb-2 pb-1 border-b border-neutral-200 dark:border-neutral-800">
                {renderInlineStyles(line.slice(3))}
              </h3>
            );
          }

          // Heading 1
          if (line.startsWith('# ')) {
            return (
              <h2 key={lIdx} className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mt-4 mb-2">
                {renderInlineStyles(line.slice(2))}
              </h2>
            );
          }

          // Bullet list (- or *)
          if (/^[-*]\s+/.test(line)) {
            const listText = line.replace(/^[-*]\s+/, '');
            return (
              <div key={lIdx} className="flex items-start gap-2 text-[14px] sm:text-[15px] my-1 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span className="flex-1">{renderInlineStyles(listText)}</span>
              </div>
            );
          }

          // Numbered list (1. 2.)
          const numMatch = line.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={lIdx} className="flex items-start gap-2.5 text-[14px] sm:text-[15px] my-1 pl-1">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 tabular-nums">
                  {numMatch[1]}.
                </span>
                <span className="flex-1">{renderInlineStyles(numMatch[2])}</span>
              </div>
            );
          }

          // Blockquote (> )
          if (line.startsWith('> ')) {
            return (
              <blockquote key={lIdx} className="pl-3 border-l-2 border-blue-500/60 my-2 text-neutral-600 dark:text-neutral-400 italic text-[14px]">
                {renderInlineStyles(line.slice(2))}
              </blockquote>
            );
          }

          // Standard paragraph line
          return (
            <p key={lIdx} className="text-[14px] sm:text-[15px]">
              {renderInlineStyles(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Helper for bold, italic, and inline code `code`
  const renderInlineStyles = (raw: string) => {
    // Split by inline code `...`
    const inlineCodeParts = raw.split(/(`[^`]+`)/g);

    return inlineCodeParts.map((part, pIdx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={pIdx}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono border border-neutral-200/50 dark:border-neutral-700/50"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Handle bold **text**
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={pIdx}>
          {boldParts.map((bPart, bIdx) => {
            if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length >= 4) {
              return (
                <strong key={bIdx} className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {bPart.slice(2, -2)}
                </strong>
              );
            }
            return bPart;
          })}
        </span>
      );
    });
  };

  let codeBlockCounter = 0;

  return (
    <div className="markdown-body space-y-3">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          const currentCodeIdx = codeBlockCounter++;
          const isCopied = copiedCodeIndex === currentCodeIdx;

          return (
            <div
              key={idx}
              className="my-3 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-[#1E1E22] text-neutral-100 shadow-sm"
            >
              {/* Code block header */}
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#28282C] text-xs text-neutral-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="uppercase tracking-wider text-[11px] font-medium">{part.lang}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(part.text, currentCodeIdx)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-[11px]"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code content */}
              <pre className="p-3.5 overflow-x-auto text-[13px] font-mono leading-relaxed bg-[#161618] text-neutral-200 scrollbar-thin">
                <code>{part.text}</code>
              </pre>
            </div>
          );
        }

        return <div key={idx}>{renderFormattedText(part.text)}</div>;
      })}
    </div>
  );
};
