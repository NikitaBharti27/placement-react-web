import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  Building,
  HelpCircle,
} from 'lucide-react'
import ServerExamTimer from './timer/ServerExamTimer'
import { QUESTION_STATUS } from '../../features/exam/examSlice'

/**
 * Top Exam Navigation & Header Bar
 */
export const ExamHeader = ({
  assessment,
  currentQuestionIndex,
  totalQuestions,
  currentStatus,
  onPrev,
  onNext,
  onMarkForReview,
  onSubmitClick,
  onTogglePalette,
  isPaletteOpen,
}) => {
  const isMarked =
    currentStatus === QUESTION_STATUS.MARKED_FOR_REVIEW ||
    currentStatus === QUESTION_STATUS.ANSWERED_AND_MARKED

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex items-center justify-between gap-4 z-20 shrink-0">
      {/* Left: Assessment Title & Track */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs shadow-md">
            <Building className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {assessment?.title || 'Placement Assessment'}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                {assessment?.companyTrack || 'Campus MNC Drive'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Question <span className="text-white font-bold">{currentQuestionIndex + 1}</span> of{' '}
              <span className="text-white font-bold">{totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Server-Authoritative Timer */}
      <div className="shrink-0">
        <ServerExamTimer
          assessmentId={assessment?.id}
          onTimeExpired={() => {
            console.warn('Authoritative deadline reached — triggering auto-lock')
          }}
        />
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Mark for review toggle */}
        <button
          type="button"
          onClick={onMarkForReview}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
            isMarked
              ? 'bg-purple-900/80 text-purple-200 border border-purple-600 shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
          title="Flag this question to review before final submission"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-current text-purple-300' : ''}`} />
          <span className="hidden md:inline">{isMarked ? 'Marked' : 'Mark for Review'}</span>
        </button>

        {/* Prev / Next buttons */}
        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentQuestionIndex === 0}
            className="p-1 rounded text-slate-300 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition"
            title="Previous Question"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="p-1 rounded text-slate-300 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition"
            title="Next Question"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle Question Grid / Palette */}
        <button
          type="button"
          onClick={onTogglePalette}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
            isPaletteOpen
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="Toggle Question Palette"
        >
          <HelpCircle className="w-3.5 h-3.5 inline mr-1" />
          <span className="hidden sm:inline">Palette</span>
        </button>

        {/* Final Submit Button */}
        <button
          type="button"
          onClick={onSubmitClick}
          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition active:scale-95"
        >
          <span>Submit</span>
          <Send className="w-3 h-3" />
        </button>
      </div>
    </header>
  )
}

export default ExamHeader
