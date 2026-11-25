import { Badge } from '../../../components/ui/Badge';
import {
  DIFFICULTY_BADGE_MAP,
  QUESTION_TYPE_META,
} from '../types/assessmentTypes';
import { Award, Layers, Tag } from 'lucide-react';

/**
 * QuestionMetaHeader - Shared metadata bar rendered above every question format
 * (MCQ, Simulation, SQL Task, UI Task) to display TopicTag, Difficulty, Type, and Marks.
 */
export function QuestionMetaHeader({ question, questionNumber, totalQuestions }) {
  if (!question) return null;

  const typeMeta = QUESTION_TYPE_META[question.type] || {
    label: question.type,
    badgeVariant: 'neutral',
  };
  const diffMeta = DIFFICULTY_BADGE_MAP[question.difficulty] || {
    label: question.difficulty || 'Standard',
    variant: 'neutral',
  };

  return (
    <div className="space-y-3 pb-4 border-b border-slate-800/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200">
            Question {questionNumber || question.order} / {totalQuestions}
          </span>
          <Badge variant={typeMeta.badgeVariant} size="sm">
            {typeMeta.label}
          </Badge>
          <Badge variant={diffMeta.variant} size="sm">
            {diffMeta.label}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{question.marks} Marks</span>
        </div>
      </div>

      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
        {question.title}
      </h2>

      {question.topicTag && (
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/50 border border-indigo-800/40 text-indigo-300">
            <Layers className="w-3 h-3" />
            <span>Subject: {question.topicTag.subject}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <Tag className="w-3 h-3 text-cyan-400" />
            <span>TopicTag: {question.topicTag.topic}</span>
          </span>
        </div>
      )}
    </div>
  );
}
