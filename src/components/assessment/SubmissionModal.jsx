import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Send,
  Loader2,
  Clock,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { QUESTION_STATUS } from '../../features/exam/examSlice'

/**
 * Pre-Submission Confirmation & Auto-Deadline Receipt Modal
 */
export const SubmissionModal = ({ isOpen, ...props }) => {
  if (!isOpen) return null
  return <SubmissionModalContent {...props} />
}

const SubmissionModalContent = ({
  onClose,
  onConfirm,
  questions = [],
  questionStatus = {},
  remainingTimeFormatted = '',
  isSubmitting = false,
  isAutoExpired = false,
  submissionError = null,
  submissionResult = null,
  onNavigateDashboard,
}) => {
  const [acknowledged, setAcknowledged] = useState(false)

  let answeredCount = 0
  let markedCount = 0
  let unansweredCount = 0

  questions.forEach((q) => {
    const status = questionStatus[q.id]
    if (status === QUESTION_STATUS.ANSWERED || status === QUESTION_STATUS.ANSWERED_AND_MARKED) {
      answeredCount++
    } else {
      unansweredCount++
    }

    if (status === QUESTION_STATUS.MARKED_FOR_REVIEW || status === QUESTION_STATUS.ANSWERED_AND_MARKED) {
      markedCount++
    }
  })

  if (submissionResult) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      >
        <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {isAutoExpired
                ? 'Time Expired — Assessment Auto-Submitted'
                : 'Assessment Submitted Successfully!'}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your responses have been accepted into the transactional outbox pipeline and
              dispatched to the execution queue.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Async Job ID:</span>
              <span className="text-cyan-400 font-bold">{submissionResult.jobId}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Processing Queue:</span>
              <span className="text-emerald-400 font-bold">Upstash QStash + Celery Sandbox</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Submitted At:</span>
              <span className="text-slate-200">
                {submissionResult.submittedAt
                  ? new Date(submissionResult.submittedAt).toLocaleTimeString()
                  : 'Just now'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Questions Answered:</span>
              <span className="text-white font-bold">
                {answeredCount} of {questions.length}
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900 text-xs text-blue-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Your code execution scores and MCQ results will be aggregated into the Teacher Granular
              Heatmap and your AI Remediation profile.
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateDashboard}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-950 transition cursor-pointer"
          >
            <span>Return to Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl space-y-5 border border-slate-200">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isAutoExpired ? 'Authoritative Deadline Reached' : 'Confirm Exam Submission'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAutoExpired
                ? 'The server-authoritative clock has reached 00:00. Locking answers and dispatching to Upstash QStash...'
                : 'Please review your summary before finalizing. You cannot modify answers after submission.'}
            </p>
          </div>
        </div>

        {submissionError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{submissionError}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
            <div className="text-lg font-bold text-emerald-700">{answeredCount}</div>
            <div className="text-[11px] text-emerald-800 font-medium">Answered</div>
          </div>
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
            <div className="text-lg font-bold text-rose-700">{unansweredCount}</div>
            <div className="text-[11px] text-rose-800 font-medium">Unanswered</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
            <div className="text-lg font-bold text-purple-700">{markedCount}</div>
            <div className="text-[11px] text-purple-800 font-medium">Marked Review</div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Time Remaining:</span>
          </div>
          <span className="font-mono font-bold text-slate-900">
            {remainingTimeFormatted || '00:00'}
          </span>
        </div>

        {!isAutoExpired && unansweredCount > 0 && (
          <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
            You still have{' '}
            <strong>
              {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}
            </strong>
            . Are you sure you want to proceed?
          </div>
        )}

        {!isAutoExpired && (
          <label className="flex items-start space-x-2.5 text-xs text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              I confirm that I have reviewed my answers and am ready to submit my examination for
              automated grading.
            </span>
          </label>
        )}

        <div className="flex items-center justify-end space-x-3 pt-2">
          {!isAutoExpired && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel &amp; Return
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={(!acknowledged && !isAutoExpired) || isSubmitting}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting to Queue...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Confirm &amp; Submit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmissionModal
