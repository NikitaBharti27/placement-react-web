import { useState } from 'react'
import { Filter } from 'lucide-react'
import { QUESTION_STATUS } from '../../features/exam/examSlice'

/**
 * Question Palette / Grid Navigation Drawer
 */
export const QuestionPalette = ({
  questions = [],
  currentQuestionIndex,
  questionStatus = {},
  onSelectQuestion,
  onClose,
}) => {
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'ANSWERED' | 'UNANSWERED' | 'MARKED'

  // Calculate quick metrics
  let answeredCount = 0
  let markedCount = 0
  let notVisitedCount = 0

  questions.forEach((q) => {
    const status = questionStatus[q.id]
    if (status === QUESTION_STATUS.ANSWERED || status === QUESTION_STATUS.ANSWERED_AND_MARKED) {
      answeredCount++
    }
    if (status === QUESTION_STATUS.MARKED_FOR_REVIEW || status === QUESTION_STATUS.ANSWERED_AND_MARKED) {
      markedCount++
    }
    if (!status || status === QUESTION_STATUS.NOT_VISITED) {
      notVisitedCount++
    }
  })

  const filteredQuestions = questions.filter((q) => {
    const status = questionStatus[q.id]
    if (statusFilter === 'ANSWERED') {
      return status === QUESTION_STATUS.ANSWERED || status === QUESTION_STATUS.ANSWERED_AND_MARKED
    }
    if (statusFilter === 'UNANSWERED') {
      return status !== QUESTION_STATUS.ANSWERED && status !== QUESTION_STATUS.ANSWERED_AND_MARKED
    }
    if (statusFilter === 'MARKED') {
      return status === QUESTION_STATUS.MARKED_FOR_REVIEW || status === QUESTION_STATUS.ANSWERED_AND_MARKED
    }
    return true
  })

  const getStatusColor = (status, isCurrent) => {
    if (isCurrent) {
      return 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 font-bold'
    }
    switch (status) {
      case QUESTION_STATUS.ANSWERED:
        return 'bg-emerald-600 text-white font-semibold'
      case QUESTION_STATUS.ANSWERED_AND_MARKED:
        return 'bg-purple-600 text-white font-semibold ring-2 ring-purple-300'
      case QUESTION_STATUS.MARKED_FOR_REVIEW:
        return 'bg-purple-900/90 text-purple-200 border border-purple-500 font-semibold'
      case QUESTION_STATUS.VISITED:
        return 'bg-slate-700 text-slate-200 hover:bg-slate-600'
      case QUESTION_STATUS.NOT_VISITED:
      default:
        return 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700/60'
    }
  }

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-slate-800 flex flex-col z-20 shadow-2xl text-slate-200">
      {/* Palette Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Question Navigator</h3>
          <p className="text-[11px] text-slate-400">Jump directly to any section</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded"
          >
            Close
          </button>
        )}
      </div>

      {/* Summary Chips */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-emerald-950/50 border border-emerald-900/70 p-2 rounded-lg">
          <div className="text-emerald-400 font-bold text-base">{answeredCount}</div>
          <div className="text-[10px] text-slate-400">Answered</div>
        </div>
        <div className="bg-purple-950/50 border border-purple-900/70 p-2 rounded-lg">
          <div className="text-purple-300 font-bold text-base">{markedCount}</div>
          <div className="text-[10px] text-slate-400">Review</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
          <div className="text-slate-300 font-bold text-base">{notVisitedCount}</div>
          <div className="text-[10px] text-slate-400">Unvisited</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-2.5 border-b border-slate-800 flex items-center gap-1 text-[11px]">
        <Filter className="w-3 h-3 text-slate-400 ml-1 mr-1" />
        {['ALL', 'ANSWERED', 'UNANSWERED', 'MARKED'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
              statusFilter === f
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Questions Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-2.5">
          {filteredQuestions.map((q) => {
            const index = questions.findIndex((item) => item.id === q.id)
            const status = questionStatus[q.id]
            const isCurrent = index === currentQuestionIndex

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(index)}
                className={`w-11 h-11 rounded-xl text-xs flex flex-col items-center justify-center transition-all ${getStatusColor(
                  status,
                  isCurrent
                )}`}
                title={`Question ${index + 1}: ${q.type} - ${q.title}`}
              >
                <span>{index + 1}</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-80">
                  {q.type === 'SIMULATION'
                    ? 'CODE'
                    : q.type === 'SQL_TASK'
                    ? 'SQL'
                    : q.type === 'UI_TASK'
                    ? 'UI'
                    : 'MCQ'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Status Legend Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-400 font-sans">
        <div className="font-semibold text-slate-300 text-[10px] uppercase tracking-wider mb-1">
          Status Legend:
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-600" />
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-700" />
            <span>Visited / In-Progress</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" />
            <span>Not Visited</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionPalette
