import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import {
  selectQuestionIndex,
  saveAnswer,
  toggleMarkForReview,
  clearAnswer,
  tickTimer,
  setRemainingSecondsDev,
  saveDraftToStorage,
} from './examSlice'
import {
  loadAssessment,
  syncExamTimer,
  executeCode,
  executeSql,
  finalizeSubmission,
} from './examThunks'

/**
 * Primary Custom Hook for Active Assessment
 */
export const useActiveExam = () => {
  const dispatch = useDispatch()
  const exam = useSelector((state) => state.exam)

  const currentQuestion =
    exam.questions && exam.questions.length > 0
      ? exam.questions[exam.currentQuestionIndex]
      : null

  const currentAnswer =
    currentQuestion && exam.answers ? exam.answers[currentQuestion.id] : null

  const currentStatus =
    currentQuestion && exam.questionStatus
      ? exam.questionStatus[currentQuestion.id]
      : null

  const currentExecution =
    currentQuestion && exam.execution ? exam.execution[currentQuestion.id] : null

  // Persist active draft progress across accidental page reloads
  useEffect(() => {
    const assessmentId = exam.activeAssessment?.id
    if (!assessmentId || exam.submission.isSubmitted) return

    saveDraftToStorage(assessmentId, {
      answers: exam.answers,
      questionStatus: exam.questionStatus,
      currentQuestionIndex: exam.currentQuestionIndex,
      serverDeadline: exam.timer.serverDeadline,
    })
  }, [
    exam.activeAssessment?.id,
    exam.answers,
    exam.questionStatus,
    exam.currentQuestionIndex,
    exam.timer.serverDeadline,
    exam.submission.isSubmitted,
  ])

  const goToQuestion = useCallback(
    (index) => {
      dispatch(selectQuestionIndex(index))
    },
    [dispatch],
  )

  const nextQuestion = useCallback(() => {
    if (exam.currentQuestionIndex < exam.questions.length - 1) {
      dispatch(selectQuestionIndex(exam.currentQuestionIndex + 1))
    }
  }, [dispatch, exam.currentQuestionIndex, exam.questions.length])

  const prevQuestion = useCallback(() => {
    if (exam.currentQuestionIndex > 0) {
      dispatch(selectQuestionIndex(exam.currentQuestionIndex - 1))
    }
  }, [dispatch, exam.currentQuestionIndex])

  const updateAnswer = useCallback(
    (questionId, answerData) => {
      dispatch(saveAnswer({ questionId, answerData }))
    },
    [dispatch],
  )

  const markForReview = useCallback(
    (questionId) => {
      dispatch(toggleMarkForReview(questionId))
    },
    [dispatch],
  )

  const resetCurrentAnswer = useCallback(
    (questionId) => {
      dispatch(clearAnswer(questionId))
    },
    [dispatch],
  )

  const runCode = useCallback((params) => dispatch(executeCode(params)), [dispatch])

  const runSql = useCallback((params) => dispatch(executeSql(params)), [dispatch])

  const submitExam = useCallback(
    (assessmentId, options) => dispatch(finalizeSubmission(assessmentId, options)),
    [dispatch],
  )

  const startExam = useCallback(
    (assessmentId, options) => dispatch(loadAssessment(assessmentId, options)),
    [dispatch],
  )

  const simulateExpiryDev = useCallback(
    (seconds = 5) => dispatch(setRemainingSecondsDev(seconds)),
    [dispatch],
  )

  return {
    ...exam,
    currentQuestion,
    currentAnswer,
    currentStatus,
    currentExecution,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    updateAnswer,
    markForReview,
    resetCurrentAnswer,
    runCode,
    runSql,
    submitExam,
    startExam,
    simulateExpiryDev,
  }
}

/**
 * Hook for Server-Authoritative Timer Synchronization
 */
export const useExamTimer = (assessmentId) => {
  const dispatch = useDispatch()
  const timer = useSelector((state) => state.exam.timer)

  useEffect(() => {
    if (!timer.serverDeadline || timer.isTimeUp) return

    const interval = setInterval(() => {
      dispatch(tickTimer())
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch, timer.serverDeadline, timer.isTimeUp])

  const syncNow = useCallback(() => {
    if (assessmentId && !timer.isTimeUp) {
      dispatch(syncExamTimer(assessmentId))
    }
  }, [dispatch, assessmentId, timer.isTimeUp])

  useEffect(() => {
    if (!assessmentId || timer.isTimeUp) return

    const syncInterval = setInterval(syncNow, 45000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncNow()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(syncInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [syncNow, assessmentId, timer.isTimeUp])

  const formatTime = (seconds) => {
    const safeSecs = Math.max(0, seconds || 0)
    const hrs = Math.floor(safeSecs / 3600)
    const mins = Math.floor((safeSecs % 3600) / 60)
    const secs = safeSecs % 60

    const paddedMins = String(mins).padStart(2, '0')
    const paddedSecs = String(secs).padStart(2, '0')

    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${paddedMins}:${paddedSecs}`
    }
    return `${paddedMins}:${paddedSecs}`
  }

  const isWarning = timer.remainingSeconds > 0 && timer.remainingSeconds <= 600
  const isCritical = timer.remainingSeconds > 0 && timer.remainingSeconds <= 120

  return {
    ...timer,
    formattedTime: formatTime(timer.remainingSeconds),
    isWarning,
    isCritical,
    syncNow,
  }
}
