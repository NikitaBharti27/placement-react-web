import { createSlice } from '@reduxjs/toolkit'

/**
 * Status constants for question palette navigation
 */
export const QUESTION_STATUS = {
  NOT_VISITED: 'NOT_VISITED',
  VISITED: 'VISITED',
  ANSWERED: 'ANSWERED',
  MARKED_FOR_REVIEW: 'MARKED_FOR_REVIEW',
  ANSWERED_AND_MARKED: 'ANSWERED_AND_MARKED',
}

const DRAFT_KEY_PREFIX = 'placeprep_exam_draft_'
const SUBMITTED_KEY = 'placeprep_submitted_assessments'

const loadDraftFromStorage = (assessmentId) => {
  try {
    const raw = sessionStorage.getItem(`${DRAFT_KEY_PREFIX}${assessmentId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const saveDraftToStorage = (assessmentId, payload) => {
  try {
    sessionStorage.setItem(`${DRAFT_KEY_PREFIX}${assessmentId}`, JSON.stringify(payload))
  } catch {
    // Ignore storage quota issues cleanly
  }
}

export const clearDraftFromStorage = (assessmentId) => {
  try {
    sessionStorage.removeItem(`${DRAFT_KEY_PREFIX}${assessmentId}`)
  } catch {
    // Ignore cleanly
  }
}

export const getSubmittedReceipts = () => {
  try {
    const raw = sessionStorage.getItem(SUBMITTED_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export const saveSubmittedReceipt = (assessmentId, receipt) => {
  try {
    const existing = getSubmittedReceipts()
    existing[assessmentId] = receipt
    sessionStorage.setItem(SUBMITTED_KEY, JSON.stringify(existing))
  } catch {
    // Ignore cleanly
  }
}

const buildDefaultAnswer = (q) => {
  if (q.type === 'MCQ') {
    return { selectedOptionId: null }
  }
  if (q.type === 'SIMULATION') {
    const defaultLang = 'python'
    return {
      language: defaultLang,
      code: q.starterCode?.[defaultLang] || '',
      customInput: '',
    }
  }
  if (q.type === 'SQL_TASK') {
    return {
      query: q.starterQuery || '',
    }
  }
  if (q.type === 'UI_TASK') {
    return {
      html: q.starterHtml || '',
      css: q.starterCss || '',
      js: q.starterJs || '',
    }
  }
  if (q.type === 'GAMIFIED') {
    return {
      gameType: q.gameType,
      rawEvents: [],
      outcome: null,
      completed: false,
    }
  }
  return {}
}

/**
 * Single source of truth for evaluating whether a question answer contains substantive work.
 */
const hasSubstantiveAnswer = (answer = {}, question = null) => {
  if (!answer) return false
  if (answer.selectedOptionId) return true
  if (typeof answer.code === 'string' && answer.code.trim().length > 0) {
    if (question?.starterCode?.[answer.language || 'python'] === answer.code) {
      return Boolean(answer.hasExecuted)
    }
    return true
  }
  if (typeof answer.query === 'string' && answer.query.trim().length > 0) {
    if (question?.starterQuery === answer.query) {
      return Boolean(answer.hasExecuted)
    }
    return true
  }
  if (
    typeof answer.html === 'string' ||
    typeof answer.css === 'string' ||
    typeof answer.js === 'string'
  ) {
    const modifiedStarter =
      question &&
      (answer.html !== (question.starterHtml || '') ||
        answer.css !== (question.starterCss || '') ||
        answer.js !== (question.starterJs || ''))
    return Boolean(modifiedStarter || answer.hasVerified)
  }
  if (answer.completed || (Array.isArray(answer.rawEvents) && answer.rawEvents.length > 0)) {
    return true
  }
  return false
}

const initialState = {
  activeAssessment: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  questionStatus: {},
  timer: {
    serverDeadline: null,
    serverTimeOffset: 0,
    remainingSeconds: 0,
    isTimeUp: false,
    isSynced: false,
    lastSyncTime: null,
  },
  execution: {},
  submission: {
    isSubmitting: false,
    isSubmitted: false,
    isAutoExpired: false,
    jobId: null,
    submittedAt: null,
    message: null,
    error: null,
  },
  isLoading: false,
  error: null,
}

export const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    examStartLoading: (state) => {
      state.isLoading = true
      state.error = null
    },
    examLoadingFailed: (state, action) => {
      state.isLoading = false
      state.error = action.payload || 'Failed to load assessment'
    },
    setAssessment: (state, action) => {
      const { assessment, forceReset = false } = action.payload?.assessment
        ? action.payload
        : { assessment: action.payload, forceReset: false }

      state.isLoading = false
      state.error = null
      state.activeAssessment = assessment
      state.questions = assessment.questions || []
      state.execution = {}

      if (forceReset) {
        clearDraftFromStorage(assessment.id)
      }

      const savedDraft = forceReset ? null : loadDraftFromStorage(assessment.id)
      const clientNow = Date.now()
      const serverNow = assessment.serverCurrentTime || clientNow
      const offset = serverNow - clientNow
      const deadline =
        savedDraft?.serverDeadline ||
        assessment.serverDeadline ||
        clientNow + (assessment.durationMinutes || 60) * 60 * 1000

      const remaining = Math.max(0, Math.floor((deadline - (clientNow + offset)) / 1000))

      state.timer = {
        serverDeadline: deadline,
        serverTimeOffset: offset,
        remainingSeconds: remaining,
        isTimeUp: remaining <= 0,
        isSynced: true,
        lastSyncTime: clientNow,
      }

      const initialAnswers = {}
      const initialStatus = {}

      state.questions.forEach((q, idx) => {
        initialAnswers[q.id] = savedDraft?.answers?.[q.id]
          ? { ...buildDefaultAnswer(q), ...savedDraft.answers[q.id] }
          : buildDefaultAnswer(q)

        initialStatus[q.id] =
          savedDraft?.questionStatus?.[q.id] ||
          (idx === 0 ? QUESTION_STATUS.VISITED : QUESTION_STATUS.NOT_VISITED)
      })

      state.currentQuestionIndex =
        typeof savedDraft?.currentQuestionIndex === 'number' &&
        savedDraft.currentQuestionIndex < state.questions.length
          ? savedDraft.currentQuestionIndex
          : 0
      state.answers = initialAnswers
      state.questionStatus = initialStatus
      state.submission = {
        isSubmitting: false,
        isSubmitted: false,
        isAutoExpired: false,
        jobId: null,
        submittedAt: null,
        message: null,
        error: null,
      }
    },

    selectQuestionIndex: (state, action) => {
      const newIndex = action.payload
      if (newIndex >= 0 && newIndex < state.questions.length) {
        state.currentQuestionIndex = newIndex
        const qId = state.questions[newIndex].id
        if (state.questionStatus[qId] === QUESTION_STATUS.NOT_VISITED) {
          state.questionStatus[qId] = QUESTION_STATUS.VISITED
        }
      }
    },

    saveAnswer: (state, action) => {
      if (state.timer.isTimeUp || state.submission.isSubmitted) return
      const { questionId, answerData } = action.payload
      const merged = {
        ...state.answers[questionId],
        ...answerData,
      }
      state.answers[questionId] = merged

      const question = state.questions.find((item) => item.id === questionId) || null
      const currentStatus = state.questionStatus[questionId]
      const hasContent = hasSubstantiveAnswer(merged, question)

      if (
        currentStatus === QUESTION_STATUS.MARKED_FOR_REVIEW ||
        currentStatus === QUESTION_STATUS.ANSWERED_AND_MARKED
      ) {
        state.questionStatus[questionId] = hasContent
          ? QUESTION_STATUS.ANSWERED_AND_MARKED
          : QUESTION_STATUS.MARKED_FOR_REVIEW
      } else {
        state.questionStatus[questionId] = hasContent
          ? QUESTION_STATUS.ANSWERED
          : QUESTION_STATUS.VISITED
      }
    },

    toggleMarkForReview: (state, action) => {
      if (state.timer.isTimeUp || state.submission.isSubmitted) return
      const questionId = action.payload
      const currentStatus = state.questionStatus[questionId]
      const currentAnswer = state.answers[questionId]
      const question = state.questions.find((item) => item.id === questionId) || null
      const isAnswered = hasSubstantiveAnswer(currentAnswer, question)

      if (
        currentStatus === QUESTION_STATUS.MARKED_FOR_REVIEW ||
        currentStatus === QUESTION_STATUS.ANSWERED_AND_MARKED
      ) {
        state.questionStatus[questionId] = isAnswered
          ? QUESTION_STATUS.ANSWERED
          : QUESTION_STATUS.VISITED
      } else {
        state.questionStatus[questionId] = isAnswered
          ? QUESTION_STATUS.ANSWERED_AND_MARKED
          : QUESTION_STATUS.MARKED_FOR_REVIEW
      }
    },

    clearAnswer: (state, action) => {
      if (state.timer.isTimeUp || state.submission.isSubmitted) return
      const questionId = action.payload
      const q = state.questions.find((item) => item.id === questionId)
      if (!q) return

      state.answers[questionId] = buildDefaultAnswer(q)
      state.questionStatus[questionId] = QUESTION_STATUS.VISITED
    },

    tickTimer: (state) => {
      if (state.timer.isTimeUp || !state.timer.serverDeadline) return

      const clientNow = Date.now()
      const serverEstimatedNow = clientNow + state.timer.serverTimeOffset
      const remaining = Math.max(
        0,
        Math.floor((state.timer.serverDeadline - serverEstimatedNow) / 1000),
      )

      state.timer.remainingSeconds = remaining
      if (remaining <= 0) {
        state.timer.isTimeUp = true
      }
    },

    updateAuthoritativeServerTime: (state, action) => {
      const { serverCurrentTime } = action.payload
      const clientNow = Date.now()
      const offset = serverCurrentTime - clientNow
      state.timer.serverTimeOffset = offset
      state.timer.lastSyncTime = clientNow
      state.timer.isSynced = true

      if (!state.timer.serverDeadline) return
      const serverEstimatedNow = clientNow + offset
      const remaining = Math.max(
        0,
        Math.floor((state.timer.serverDeadline - serverEstimatedNow) / 1000),
      )
      state.timer.remainingSeconds = remaining
      if (remaining <= 0) {
        state.timer.isTimeUp = true
      }
    },

    // Dev helper: shorten deadline to N seconds to verify authoritative auto-submit
    setRemainingSecondsDev: (state, action) => {
      const seconds = Math.max(1, Number(action.payload) || 5)
      const clientNow = Date.now()
      state.timer.serverDeadline = clientNow + state.timer.serverTimeOffset + seconds * 1000
      state.timer.remainingSeconds = seconds
      state.timer.isTimeUp = false
    },

    executionStart: (state, action) => {
      const { questionId } = action.payload
      state.execution[questionId] = {
        isRunning: true,
        stdout: '',
        stderr: '',
        testCaseResults: [],
        sqlResult: null,
        error: null,
      }
    },

    executionSuccess: (state, action) => {
      const { questionId, results } = action.payload
      state.execution[questionId] = {
        isRunning: false,
        ...results,
        error: null,
      }
    },

    executionFailed: (state, action) => {
      const { questionId, error } = action.payload
      state.execution[questionId] = {
        isRunning: false,
        error: error || 'Execution failed',
        stdout: '',
        stderr: error,
      }
    },

    submissionStart: (state, action) => {
      state.submission.isSubmitting = true
      state.submission.isAutoExpired = Boolean(action.payload?.isAutoSubmit)
      state.submission.error = null
    },

    submissionSuccess: (state, action) => {
      const { jobId, submittedAt, message, assessmentId } = action.payload
      state.submission.isSubmitting = false
      state.submission.isSubmitted = true
      state.submission.jobId = jobId
      state.submission.submittedAt = submittedAt
      state.submission.message = message
      state.submission.error = null

      if (assessmentId) {
        clearDraftFromStorage(assessmentId)
        saveSubmittedReceipt(assessmentId, {
          jobId,
          submittedAt,
          message,
        })
      }
    },

    submissionFailed: (state, action) => {
      state.submission.isSubmitting = false
      state.submission.error = action.payload || 'Submission failed'
    },

    resetExamSession: () => initialState,
  },
})

export const {
  examStartLoading,
  examLoadingFailed,
  setAssessment,
  selectQuestionIndex,
  saveAnswer,
  toggleMarkForReview,
  clearAnswer,
  tickTimer,
  updateAuthoritativeServerTime,
  setRemainingSecondsDev,
  executionStart,
  executionSuccess,
  executionFailed,
  submissionStart,
  submissionSuccess,
  submissionFailed,
  resetExamSession,
} = examSlice.actions

export default examSlice.reducer
