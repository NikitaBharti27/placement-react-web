import { Badge } from '../../../components/ui/Badge';
import { QuestionMetaHeader } from './QuestionMetaHeader';
import { cn } from '../../../utils/cn';
import { CheckCircle2, Circle, LayoutTemplate, Palette } from 'lucide-react';

/**
 * UiTaskLayout - Left-pane brief, design tokens, and acceptance checklist
 * for embedded UI modification tasks.
 */
export function UiTaskLayout({
  question,
  questionNumber,
  totalQuestions,
  currentCode = '',
  runResult = null,
}) {
  if (!question) return null;

  const criteriaChecks = (question.acceptanceCriteria || []).map((criterion) => {
    const resultMatch = runResult?.checks?.find((c) => c.id === criterion.id);
    const liveKeywordMatched = criterion.keywordMatch
      ? currentCode.toLowerCase().includes(criterion.keywordMatch.toLowerCase())
      : false;
    return {
      ...criterion,
      passed: resultMatch ? resultMatch.passed : liveKeywordMatched,
    };
  });

  return (
    <div className="p-5 sm:p-6 space-y-5 text-left">
      <QuestionMetaHeader
        question={question}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />

      {/* Task Brief */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <LayoutTemplate className="w-3.5 h-3.5" />
            UI Refactoring Brief
          </span>
          <Badge variant="warning" size="sm">
            React + Tailwind CSS
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {question.prompt}
        </p>
      </div>

      {/* Live Acceptance Criteria Checklist */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Acceptance Checklist
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            {criteriaChecks.filter((c) => c.passed).length}/{criteriaChecks.length} Satisfied
          </span>
        </div>

        <ul className="space-y-2.5">
          {criteriaChecks.map((item) => (
            <li
              key={item.id}
              className={cn(
                'p-3 rounded-lg border flex items-start gap-2.5 text-xs transition-colors',
                item.passed
                  ? 'bg-emerald-950/30 border-emerald-700/40 text-emerald-200'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300'
              )}
            >
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Design System Reference Tokens */}
      {question.designTokensHint?.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Design Tokens</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {question.designTokensHint.map((token, idx) => (
              <code
                key={idx}
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-indigo-300"
              >
                {token}
              </code>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
