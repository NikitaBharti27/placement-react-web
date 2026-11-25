import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useActiveExam, useExamTimer } from '../../features/exam/examHooks'
import ExamHeader from '../../components/assessment/ExamHeader'
import QuestionPalette from '../../components/assessment/QuestionPalette'
import SubmissionModal from '../../components/assessment/SubmissionModal'
import McqWorkspace from '../../components/assessment/formats/McqWorkspace'
import SimulationWorkspace from '../../components/assessment/formats/SimulationWorkspace'
import SqlTaskWorkspace from '../../components/assessment/formats/SqlTaskWorkspace'
import UiTaskWorkspace from '../../components/assessment/formats/UiTaskWorkspace'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { ROUTES } from '../../routes/paths'
import { AlertCircle, ArrowLeft } from 'lucide-react'

/**
 * Assessment Player Page (Split-Screen Multi-Format Evaluation Engine)
 * Handles distraction-free full-screen testing, Monaco integration,
 * server-authoritative timer enforcement, and conditional rendering.
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
    submission,
  } = useActiveExam()

  const { formattedTime } = useExamTimer(assessmentId)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

  // Initialize exam data on load or param change
  useEffect(() => {
    startExam(assessmentId)
  }, [assessmentId, startExam])

  const handleAnswerChange = useCallback(
    (answerData) => {
      if (currentQuestion) {
        updateAnswer(currentQuestion.id, answerData)
      }
    },
    [currentQuestion, updateAnswer]
  )

  const handleClearAnswer = useCallback(() => {
    if (currentQuestion) {
      resetCurrentAnswer(currentQuestion.id)
    }
  }, [currentQuestion, resetCurrentAnswer])

  const handleConfirmSubmit = async () => {
    await submitExam(assessmentId)
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
          Initializing Isolated Sandbox & Syncing Server Clock...
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
          <p className="text-xs text-slate-400">{error || 'Unable to load assessment specifications.'}</p>
          <button
            onClick={() => navigate(ROUTES.STUDENT.DASHBOARD)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden font-sans select-none">
      {/* Top Authoritative Exam Header */}
      <ExamHeader
        assessment={activeAssessment}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        currentStatus={currentStatus}
        onPrev={prevQuestion}
        onNext={nextQuestion}
        onMarkForReview={() => currentQuestion && markForReview(currentQuestion.id)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
        onTogglePalette={() => setIsPaletteOpen((prev) => !prev)}
        isPaletteOpen={isPaletteOpen}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Dynamic Conditional Workspace Render */}
        <main className="flex-1 h-full overflow-hidden">
          {currentQuestion?.type === 'MCQ' && (
            <McqWorkspace
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
              onClearAnswer={handleClearAnswer}
            />
          )}

          {currentQuestion?.type === 'SIMULATION' && (
            <SimulationWorkspace
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
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
            />
          )}

          {/* Fallback for unrecognized or future type */}
          {!['MCQ', 'SIMULATION', 'SQL_TASK', 'UI_TASK'].includes(currentQuestion?.type) && (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Question format {currentQuestion?.type} will be loaded in the next evaluation phase.
            </div>
          )}
        </main>

        {/* Question Palette Sidebar (Overlay or docked) */}
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

      {/* Pre-Submission Confirmation Modal */}
      <SubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        questions={questions}
        questionStatus={questionStatus}
        remainingTimeFormatted={formattedTime}
        isSubmitting={submission.isSubmitting}
        submissionResult={submission.isSubmitted ? submission : null}
        onNavigateDashboard={handleReturnToDashboard}
      />
    </div>
  )
}

export default AssessmentPlayerPage
