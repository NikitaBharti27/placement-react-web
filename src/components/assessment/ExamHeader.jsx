import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  Building,
  HelpCircle,
  BookOpen,
  TimerReset,
} from 'lucide-react'
import ServerExamTimer from './timer/ServerExamTimer'
import { QUESTION_STATUS } from '../../features/exam/examSlice'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'

/**
 * Top Exam Navigation & Header Bar
 */
export const ExamHeader = ({
  assessment,
  currentQuestionIndex,
  totalQuestions,
  currentStatus,
  isLocked = false,
  onPrev,
  onNext,
  onMarkForReview,
  onSubmitClick,
  onTogglePalette,
  onOpenInstructions,
  onTimeExpired,
  onSimulateExpiryDev,
  isPaletteOpen,
}) => {
  const isMarked =
    currentStatus === QUESTION_STATUS.MARKED_FOR_REVIEW ||
    currentStatus === QUESTION_STATUS.ANSWERED_AND_MARKED

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex items-center justify-between gap-3 z-20 shrink-0 select-none">
      {/* Left: Assessment Title & Track */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs shadow-md shrink-0">
            <Building className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm truncate max-w-[160px] sm:max-w-xs md:max-w-sm">
                {assessment?.title || 'Placement Assessment'}
              </span>
              <Badge variant="primary" size="sm" dot className="hidden sm:inline-flex shrink-0">
                {assessment?.companyTrack || 'Campus MNC Drive'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>
                Question <strong className="text-white">{currentQuestionIndex + 1}</strong> of{' '}
                <strong className="text-white">{totalQuestions}</strong>
              </span>
              <span className="hidden md:inline">•</span>
              <div className="hidden md:block w-24">
                <ProgressBar
                  value={currentQuestionIndex + 1}
                  max={Math.max(1, totalQuestions)}
                  size="sm"
                  variant="indigo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Server-Authoritative Timer */}
      <div className="shrink-0">
        <ServerExamTimer assessmentId={assessment?.id} onTimeExpired={onTimeExpired} />
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        {onOpenInstructions && (
          <button
            type="button"
            onClick={onOpenInstructions}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            title="View Assessment Instructions & Rules"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Rules</span>
          </button>
        )}

        {import.meta.env.DEV && onSimulateExpiryDev && !isLocked && (
          <button
            type="button"
            onClick={onSimulateExpiryDev}
            className="hidden xl:inline-flex px-2 py-1.5 rounded-lg text-[11px] font-mono bg-amber-950/60 text-amber-300 hover:bg-amber-900/70 border border-amber-800/70 items-center gap-1 transition cursor-pointer"
            title="Dev Only: Fast-forward server timer to 5s remaining"
          >
            <TimerReset className="w-3 h-3" />
            <span>5s Test</span>
          </button>
        )}

        <button
          type="button"
          disabled={isLocked}
          onClick={onMarkForReview}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 ${
            isMarked
              ? 'bg-purple-900/80 text-purple-200 border border-purple-600 shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
          title="Flag this question to review before final submission"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-current text-purple-300' : ''}`} />
          <span className="hidden md:inline">{isMarked ? 'Marked' : 'Mark for Review'}</span>
        </button>

        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentQuestionIndex === 0}
            className="p-1 rounded text-slate-300 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition cursor-pointer"
            title="Previous Question"
            aria-label="Previous Question"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={currentQuestionIndex >= totalQuestions - 1}
            className="p-1 rounded text-slate-300 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition cursor-pointer"
            title="Next Question"
            aria-label="Next Question"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onTogglePalette}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
            isPaletteOpen
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="Toggle Question Palette"
        >
          <HelpCircle className="w-3.5 h-3.5 inline mr-1" />
          <span className="hidden sm:inline">Palette</span>
        </button>

        <button
          type="button"
          onClick={onSubmitClick}
          className="px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition active:scale-95 cursor-pointer"
        >
          <span>Submit</span>
          <Send className="w-3 h-3" />
        </button>
      </div>
    </header>
  )
}

export default ExamHeader
