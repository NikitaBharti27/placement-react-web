import { useEffect } from 'react';
import { SplitPane } from '../../../components/ui/SplitPane';
import { CodeBlock } from '../../../components/ui/CodeBlock';
import { Badge } from '../../../components/ui/Badge';
import { Alert } from '../../../components/ui/Alert';
import { QuestionMetaHeader } from './QuestionMetaHeader';
import { cn } from '../../../utils/cn';
import { Check, CheckSquare, CircleDot, Lightbulb } from 'lucide-react';

/**
 * McqQuestionLayout - Split-screen MCQ assessment interface supporting both
 * single-choice and multi-select corporate test items.
 */
export function McqQuestionLayout({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionIds = [],
  onToggleOption,
}) {
  const allowMultiple = Boolean(question?.allowMultiple);

  useEffect(() => {
    if (!question?.options?.length || !onToggleOption) return undefined;

    const handleKeyDown = (event) => {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (document.querySelector('[role="dialog"]')) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const idx = Number(event.key) - 1;
      if (idx >= 0 && idx < question.options.length) {
        event.preventDefault();
        onToggleOption(question.id, question.options[idx].id, allowMultiple);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allowMultiple, onToggleOption, question]);

  if (!question) return null;

  const leftPane = (
    <div className="p-5 sm:p-7 space-y-5 text-left">
      <QuestionMetaHeader
        question={question}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />

      <div className="space-y-4">
        <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed whitespace-pre-line">
          {question.prompt}
        </p>

        {question.codeSnippet && (
          <CodeBlock
            title={question.codeSnippet.title}
            language={question.codeSnippet.language}
            code={question.codeSnippet.code}
            showLineNumbers
          />
        )}

        {question.hint && (
          <Alert variant="info" title="Context Note">
            <span className="inline-flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>{question.hint}</span>
            </span>
          </Alert>
        )}
      </div>
    </div>
  );

  const rightPane = (
    <div className="flex-1 overflow-y-auto p-5 sm:p-7 flex flex-col justify-between gap-6 text-left">
      <div className="space-y-4 max-w-2xl w-full mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            {allowMultiple ? (
              <CheckSquare className="w-4 h-4 text-purple-400" />
            ) : (
              <CircleDot className="w-4 h-4 text-indigo-400" />
            )}
            <h3 className="text-sm font-semibold text-white">
              {allowMultiple ? 'Select all applicable options' : 'Select the best answer'}
            </h3>
          </div>

          <Badge
            variant={selectedOptionIds.length > 0 ? 'success' : 'neutral'}
            size="sm"
          >
            {selectedOptionIds.length > 0
              ? `${selectedOptionIds.length} Selected`
              : 'No Option Selected'}
          </Badge>
        </div>

        <div
          role={allowMultiple ? 'group' : 'radiogroup'}
          aria-label={`Answer choices for ${question.title}`}
          className="space-y-3"
        >
          {(question.options || []).map((option, idx) => {
            const isSelected = selectedOptionIds.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                role={allowMultiple ? 'checkbox' : 'radio'}
                aria-checked={isSelected}
                onClick={() => onToggleOption(question.id, option.id, allowMultiple)}
                className={cn(
                  'w-full p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3.5 group cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-500/15'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                )}
              >
                {/* Option Letter / Selection Indicator */}
                <span
                  className={cn(
                    'w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors',
                    isSelected
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-950 border-slate-700 text-slate-300 group-hover:border-slate-500'
                  )}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : option.label || idx + 1}
                </span>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Option {option.label || idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                      Key {idx + 1}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'text-sm leading-relaxed',
                      isSelected ? 'text-white font-medium' : 'text-slate-200'
                    )}
                  >
                    {option.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl w-full mx-auto pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
        <span>
          {allowMultiple
            ? 'Multiple-choice question: partial or exact matching depends on track rubric.'
            : 'Single-choice question: click an option again to deselect.'}
        </span>
      </div>
    </div>
  );

  return (
    <SplitPane
      left={leftPane}
      right={rightPane}
      leftLabel="Question Prompt"
      rightLabel="Answer Choices"
      defaultLeftPercent={46}
    />
  );
}
