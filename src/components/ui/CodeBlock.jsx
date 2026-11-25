import { useState } from 'react';
import { cn } from '../../utils/cn';
import { Check, Copy, Terminal } from 'lucide-react';

/**
 * CodeBlock - Accessible read-only code and I/O snippet viewer with copy support.
 * Used across MCQ snippets, Simulation Story sample test cases, and SQL references.
 */
export function CodeBlock({
  code = '',
  title,
  language,
  showLineNumbers = false,
  copyable = true,
  compact = false,
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Gracefully ignore clipboard errors in restricted environments
    }
  };

  const lines = String(code).split('\n');

  return (
    <div
      className={cn(
        'rounded-xl bg-slate-950/90 border border-slate-800/90 overflow-hidden text-left shadow-inner',
        className
      )}
    >
      {(title || language || copyable) && (
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/80">
          <div className="flex items-center gap-2 min-w-0">
            <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            {title && (
              <span className="text-xs font-medium text-slate-300 truncate">
                {title}
              </span>
            )}
            {language && (
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                {language}
              </span>
            )}
          </div>

          {copyable && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Copied to clipboard' : 'Copy snippet'}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-100 px-2 py-1 rounded-md hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      <pre
        className={cn(
          'overflow-x-auto font-mono text-xs leading-relaxed text-slate-200',
          compact ? 'p-3' : 'p-4'
        )}
      >
        <code>
          {showLineNumbers
            ? lines.map((line, index) => (
                <div key={index} className="flex">
                  <span className="select-none w-7 shrink-0 text-right pr-3 text-slate-600">
                    {index + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">{line || ' '}</span>
                </div>
              ))
            : code}
        </code>
      </pre>
    </div>
  );
}
