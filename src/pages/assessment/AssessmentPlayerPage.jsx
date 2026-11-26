import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useActiveExam, useExamTimer } from '../../features/exam/examHooks'
import ExamHeader from '../../components/assessment/ExamHeader'
import QuestionPalette from '../../components/assessment/QuestionPalette'
import SubmissionModal from '../../components/assessment/SubmissionModal'
import McqWorkspace from '../../components/assessment/formats/McqWorkspace'
import SimulationWorkspace from '../../components/assessment/formats/SimulationWorkspace'
import SqlTaskWorkspace from '../../components/assessment/formats/SqlTaskWorkspace'
import UiTaskWorkspace from '../../components/assessment/formats/UiTaskWorkspace'
import GamifiedWorkspace from '../../components/assessment/formats/GamifiedWorkspace'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Modal from '../../components/ui/Modal'
import { ROUTES } from '../../routes/paths'
import { AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'

/**
 * Assessment Player Page (Split-Screen Multi-Format Evaluation Engine)
 */
export const AssessmentPlayerPage = () => {
  const { assessmentId = 'tcs-nqt-tech-01' } = useParams()
  const navigate = useNavigate()

  const {
    activeAssessment,
    questions,
    currentQuestionIndex,
    currentQuestion,
    currentAnswer,
    currentStatus,
    currentExecution,
    questionStatus,
    isLoading,
    error,
    startExam,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    updateAnswer,
    markForReview,
    resetCurrentAnswer,
    runCode,
    runSql,
    submitExam,
    simulateExpiryDev,
    submission,
  } = useActiveExam()

  const { formattedTime, isTimeUp } = useExamTimer(assessmentId)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false)
  const autoSubmitTriggeredRef = useRef(false)

  useEffect(() => {
    autoSubmitTriggeredRef.current = false
    startExam(assessmentId)
  }, [assessmentId, startExam])

  const handleTimeExpired = useCallback(() => {
    if (autoSubmitTriggeredRef.current || submission.isSubmitted) return
    autoSubmitTriggeredRef.current = true
    setIsPaletteOpen(false)
    setIsInstructionsOpen(false)
    setIsSubmitModalOpen(true)
    submitExam(assessmentId, { isAutoSubmit: true })
  }, [assessmentId, submitExam, submission.isSubmitted])

  const handleAnswerChange = useCallback(
    (answerData) => {
      if (currentQuestion && !isTimeUp && !submission.isSubmitted) {
        updateAnswer(currentQuestion.id, answerData)
      }
    },
    [currentQuestion, updateAnswer, isTimeUp, submission.isSubmitted],
  )

  const handleClearAnswer = useCallback(() => {
    if (currentQuestion && !isTimeUp && !submission.isSubmitted) {
      resetCurrentAnswer(currentQuestion.id)
    }
  }, [currentQuestion, resetCurrentAnswer, isTimeUp, submission.isSubmitted])

  const handleConfirmSubmit = async () => {
    await submitExam(assessmentId, { isAutoSubmit: isTimeUp })
  }

  const handleReturnToDashboard = () => {
    setIsSubmitModalOpen(false)
    navigate(ROUTES.STUDENT.DASHBOARD)
  }

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-200 space-y-4">
        <LoadingSpinner size="lg" />
        <div className="text-sm font-mono text-cyan-400 animate-pulse">
          Initializing Isolated Sandbox &amp; Syncing Server Clock...
        </div>
      </div>
    )
  }

  if (error || !activeAssessment) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full text-center space-y-4 text-slate-200">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Assessment Error</h2>
          <p className="text-xs text-slate-400">
            {error || 'Unable to load assessment specifications.'}
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.STUDENT.DASHBOARD)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    )
  }

  const isLocked = isTimeUp || submission.isSubmitted

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden font-sans">
      <ExamHeader
        assessment={activeAssessment}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        currentStatus={currentStatus}
        isLocked={isLocked}
        onPrev={prevQuestion}
        onNext={nextQuestion}
        onMarkForReview={() => currentQuestion && markForReview(currentQuestion.id)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
        onTogglePalette={() => setIsPaletteOpen((prev) => !prev)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onTimeExpired={handleTimeExpired}
        onSimulateExpiryDev={() => simulateExpiryDev(5)}
        isPaletteOpen={isPaletteOpen}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 h-full overflow-hidden">
          {currentQuestion?.type === 'MCQ' && (
            <McqWorkspace
              key={currentQuestion.id}
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
              onClearAnswer={handleClearAnswer}
            />
          )}

          {currentQuestion?.type === 'SIMULATION' && (
            <SimulationWorkspace
              key={currentQuestion.id}
              question={currentQuestion}
              answer={currentAnswer}
              executionState={currentExecution}
              onAnswerChange={handleAnswerChange}
              onRunCode={runCode}
              assessmentId={activeAssessment.id}
            />
          )}

          {currentQuestion?.type === 'SQL_TASK' && (
            <SqlTaskWorkspace
              key={currentQuestion.id}
              question={currentQuestion}
              answer={currentAnswer}
              executionState={currentExecution}
              onAnswerChange={handleAnswerChange}
              onRunSql={runSql}
              assessmentId={activeAssessment.id}
            />
          )}

          {currentQuestion?.type === 'UI_TASK' && (
            <UiTaskWorkspace
              key={currentQuestion.id}
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
            />
          )}

          {currentQuestion?.type === 'GAMIFIED' && (
            <GamifiedWorkspace
              key={currentQuestion.id}
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
            />
          )}

          {!['MCQ', 'SIMULATION', 'SQL_TASK', 'UI_TASK', 'GAMIFIED'].includes(
            currentQuestion?.type,
          ) && (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Question format {currentQuestion?.type} will be loaded in the next evaluation phase.
            </div>
          )}
        </main>

        {isPaletteOpen && (
          <div className="absolute right-0 top-0 bottom-0 z-30 shadow-2xl">
            <QuestionPalette
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              questionStatus={questionStatus}
              onSelectQuestion={(idx) => {
                goToQuestion(idx)
                setIsPaletteOpen(false)
              }}
              onClose={() => setIsPaletteOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Assessment Rules & Instructions Modal */}
      <Modal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title={activeAssessment.title}
        description={`${activeAssessment.companyTrack} • ${activeAssessment.durationMinutes} Minutes • ${activeAssessment.totalMarks} Marks`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Server-authoritative timer and isolated sandbox execution are active. Closing or
              refreshing the tab preserves your draft without extending the server deadline.
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Assessment Instructions
            </h4>
            <ul className="space-y-2">
              {(activeAssessment.instructions || []).map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={() => {
                  setIsInstructionsOpen(false)
                  startExam(assessmentId, { forceReset: true })
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
              >
                Reset Attempt (Dev)
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsInstructionsOpen(false)}
              className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition cursor-pointer"
            >
              Resume Assessment
            </button>
          </div>
        </div>
      </Modal>

      {/* Pre-Submission Confirmation Modal */}
      <SubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        questions={questions}
        questionStatus={questionStatus}
        remainingTimeFormatted={formattedTime}
        isSubmitting={submission.isSubmitting}
        isAutoExpired={submission.isAutoExpired || isTimeUp}
        submissionError={submission.error}
        submissionResult={submission.isSubmitted ? submission : null}
        onNavigateDashboard={handleReturnToDashboard}
      />
    </div>
  )
}

export default AssessmentPlayerPage
