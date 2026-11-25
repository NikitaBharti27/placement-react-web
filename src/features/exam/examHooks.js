import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import {
  selectQuestionIndex,
  saveAnswer,
  toggleMarkForReview,
  clearAnswer,
  tickTimer,
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
    currentQuestion && exam.execution
      ? exam.execution[currentQuestion.id]
      : null

  const goToQuestion = useCallback(
    (index) => {
      dispatch(selectQuestionIndex(index))
    },
    [dispatch]
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
    [dispatch]
  )

  const markForReview = useCallback(
    (questionId) => {
      dispatch(toggleMarkForReview(questionId))
    },
    [dispatch]
  )

  const resetCurrentAnswer = useCallback(
    (questionId) => {
      dispatch(clearAnswer(questionId))
    },
    [dispatch]
  )

  const runCode = useCallback(
    (params) => dispatch(executeCode(params)),
    [dispatch]
  )

  const runSql = useCallback(
    (params) => dispatch(executeSql(params)),
    [dispatch]
  )

  const submitExam = useCallback(
    (assessmentId) => dispatch(finalizeSubmission(assessmentId)),
    [dispatch]
  )

  const startExam = useCallback(
    (assessmentId) => dispatch(loadAssessment(assessmentId)),
    [dispatch]
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
  }
}

/**
 * Hook for Server-Authoritative Timer Synchronization
 */
export const useExamTimer = (assessmentId) => {
  const dispatch = useDispatch()
  const timer = useSelector((state) => state.exam.timer)

  // Periodic 1-second countdown tick
  useEffect(() => {
    if (!timer.serverDeadline || timer.isTimeUp) return

    const interval = setInterval(() => {
      dispatch(tickTimer())
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch, timer.serverDeadline, timer.isTimeUp])

  // Periodic Authoritative Server Sync Heartbeat (every 45s or visibility regain)
  useEffect(() => {
    if (!assessmentId || timer.isTimeUp) return

    const syncPing = () => {
      dispatch(syncExamTimer(assessmentId))
    }

    const syncInterval = setInterval(syncPing, 45000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncPing()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(syncInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [dispatch, assessmentId, timer.isTimeUp])

  // Format remaining seconds into HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const paddedMins = String(mins).padStart(2, '0')
    const paddedSecs = String(secs).padStart(2, '0')

    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${paddedMins}:${paddedSecs}`
    }
    return `${paddedMins}:${paddedSecs}`
  }

  const isWarning = timer.remainingSeconds > 0 && timer.remainingSeconds <= 600 // <= 10 mins
  const isCritical = timer.remainingSeconds > 0 && timer.remainingSeconds <= 120 // <= 2 mins

  return {
    ...timer,
    formattedTime: formatTime(timer.remainingSeconds),
    isWarning,
    isCritical,
  }
}
