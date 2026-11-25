import { useState, useMemo } from 'react';
import { cn } from '../../../utils/cn';
import { Badge } from '../../../components/ui/Badge';
import { QUESTION_STATUS, QUESTION_TYPE_META } from '../types/assessmentTypes';
import { CheckCircle2, Flag, X } from 'lucide-react';

/**
 * QuestionNavigator - Collapsible question palette drawer/panel allowing quick
 * navigation across multi-format items with status filters & visual legend.
 */
export function QuestionNavigator({
  isOpen,
  onClose,
  questions = [],
  currentIndex,
  getQuestionStatus,
  summaryStats,
  onSelectQuestion,
}) {
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'UNANSWERED' | 'FLAGGED'

  const filteredQuestions = useMemo(() => {
    return questions
      .map((q, index) => ({
        question: q,
        index,
        status: getQuestionStatus(q),
      }))
      .filter((item) => {
        if (filterMode === 'FLAGGED') {
          return (
            item.status === QUESTION_STATUS.FLAGGED ||
            item.status === QUESTION_STATUS.ANSWERED_AND_FLAGGED
          );
        }
        if (filterMode === 'UNANSWERED') {
          return (
            item.status === QUESTION_STATUS.UNVISITED ||
            item.status === QUESTION_STATUS.FLAGGED
          );
        }
        return true;
      });
  }, [filterMode, getQuestionStatus, questions]);

  if (!isOpen) return null;

  const statusStyles = {
    [QUESTION_STATUS.CURRENT]:
      'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-500/40 shadow-md shadow-indigo-500/25',
    [QUESTION_STATUS.ANSWERED]:
      'bg-emerald-950/70 text-emerald-200 border-emerald-600/60 hover:border-emerald-400',
    [QUESTION_STATUS.FLAGGED]:
      'bg-amber-950/60 text-amber-200 border-amber-500/60 hover:border-amber-400',
    [QUESTION_STATUS.ANSWERED_AND_FLAGGED]:
      'bg-emerald-950/70 text-emerald-200 border-amber-500/80 ring-1 ring-amber-400/50',
    [QUESTION_STATUS.UNVISITED]:
      'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-600',
  };

  return (
    <aside
      aria-label="Question navigator palette"
      className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-l border-slate-800/90 bg-slate-950/95 backdrop-blur-xl flex flex-col max-h-[55vh] lg:max-h-none overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">Question Palette</h3>
          <p className="text-[11px] text-slate-400">
            {summaryStats.answered} answered • {summaryStats.flagged} flagged •{' '}
            {summaryStats.unanswered} remaining
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close question palette"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 border-b border-slate-800/60">
        {[
          { id: 'ALL', label: `All (${questions.length})` },
          { id: 'UNANSWERED', label: `Remaining (${summaryStats.unanswered})` },
          { id: 'FLAGGED', label: `Flagged (${summaryStats.flagged})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterMode(tab.id)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer',
              filterMode === tab.id
                ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/50'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Question Grid / List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filteredQuestions.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
            No questions match this filter.
          </div>
        ) : (
          filteredQuestions.map(({ question, index, status }) => {
            const typeMeta = QUESTION_TYPE_META[question.type] || {
              shortLabel: question.type,
              badgeVariant: 'neutral',
            };
            const isFlagged =
              status === QUESTION_STATUS.FLAGGED ||
              status === QUESTION_STATUS.ANSWERED_AND_FLAGGED;
            const isAnswered =
              status === QUESTION_STATUS.ANSWERED ||
              status === QUESTION_STATUS.ANSWERED_AND_FLAGGED;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => onSelectQuestion(index)}
                aria-current={index === currentIndex ? 'step' : undefined}
                className={cn(
                  'w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer',
                  statusStyles[status] || statusStyles[QUESTION_STATUS.UNVISITED]
                )}
              >
                <span className="w-7 h-7 rounded-lg bg-slate-950/60 border border-white/10 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  {index + 1}
                </span>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={typeMeta.badgeVariant} size="sm">
                      {typeMeta.shortLabel}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      {isAnswered && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {isFlagged && (
                        <Flag className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs font-medium leading-snug line-clamp-2">
                    {question.title}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Status Legend */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/50 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Marked Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          <span>Unanswered</span>
        </div>
      </div>
    </aside>
  );
}
