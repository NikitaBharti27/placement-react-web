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
    jobId: null,
    submittedAt: null,
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
      const assessment = action.payload
      state.isLoading = false
      state.error = null
      state.activeAssessment = assessment
      state.questions = assessment.questions || []
      state.currentQuestionIndex = 0

      // Calculate server time offset
      const clientNow = Date.now()
      const serverNow = assessment.serverCurrentTime || clientNow
      const offset = serverNow - clientNow
      const deadline = assessment.serverDeadline || clientNow + (assessment.durationMinutes || 60) * 60 * 1000

      state.timer = {
        serverDeadline: deadline,
        serverTimeOffset: offset,
        remainingSeconds: Math.max(0, Math.floor((deadline - (clientNow + offset)) / 1000)),
        isTimeUp: false,
        isSynced: true,
        lastSyncTime: clientNow,
      }

      // Initialize answers and statuses for all questions
      const initialAnswers = {}
      const initialStatus = {}

      state.questions.forEach((q, idx) => {
        initialStatus[q.id] = idx === 0 ? QUESTION_STATUS.VISITED : QUESTION_STATUS.NOT_VISITED

        if (q.type === 'MCQ') {
          initialAnswers[q.id] = { selectedOptionId: null }
        } else if (q.type === 'SIMULATION') {
          const defaultLang = 'python'
          initialAnswers[q.id] = {
            language: defaultLang,
            code: q.starterCode?.[defaultLang] || '',
            customInput: '',
          }
        } else if (q.type === 'SQL_TASK') {
          initialAnswers[q.id] = {
            query: q.starterQuery || '',
          }
        } else if (q.type === 'UI_TASK') {
          initialAnswers[q.id] = {
            html: q.starterHtml || '',
            css: q.starterCss || '',
            js: q.starterJs || '',
          }
        }
      })

      state.answers = initialAnswers
      state.questionStatus = initialStatus
      state.submission = {
        isSubmitting: false,
        isSubmitted: false,
        jobId: null,
        submittedAt: null,
        error: null,
      }
    },

    selectQuestionIndex: (state, action) => {
      const newIndex = action.payload
      if (newIndex >= 0 && newIndex < state.questions.length) {
        state.currentQuestionIndex = newIndex
        const qId = state.questions[newIndex].id
        const currentStatus = state.questionStatus[qId]
        if (currentStatus === QUESTION_STATUS.NOT_VISITED) {
          state.questionStatus[qId] = QUESTION_STATUS.VISITED
        }
      }
    },

    saveAnswer: (state, action) => {
      const { questionId, answerData } = action.payload
      state.answers[questionId] = {
        ...state.answers[questionId],
        ...answerData,
      }

      // Update question status intelligently
      const currentStatus = state.questionStatus[questionId]
      const hasContent = Boolean(
        answerData.selectedOptionId ||
          answerData.code ||
          answerData.query ||
          answerData.html ||
          answerData.css
      )

      if (currentStatus === QUESTION_STATUS.MARKED_FOR_REVIEW) {
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
      const questionId = action.payload
      const currentStatus = state.questionStatus[questionId]
      const currentAnswer = state.answers[questionId]

      const isAnswered =
        currentAnswer?.selectedOptionId ||
        (currentAnswer?.code && currentAnswer.code.trim().length > 0) ||
        (currentAnswer?.query && currentAnswer.query.trim().length > 0) ||
        (currentAnswer?.html && currentAnswer.html.trim().length > 0)

      if (
        currentStatus === QUESTION_STATUS.MARKED_FOR_REVIEW ||
        currentStatus === QUESTION_STATUS.ANSWERED_AND_MARKED
      ) {
        // Unmark
        state.questionStatus[questionId] = isAnswered
          ? QUESTION_STATUS.ANSWERED
          : QUESTION_STATUS.VISITED
      } else {
        // Mark
        state.questionStatus[questionId] = isAnswered
          ? QUESTION_STATUS.ANSWERED_AND_MARKED
          : QUESTION_STATUS.MARKED_FOR_REVIEW
      }
    },

    clearAnswer: (state, action) => {
      const questionId = action.payload
      const q = state.questions.find((item) => item.id === questionId)
      if (!q) return

      if (q.type === 'MCQ') {
        state.answers[questionId] = { selectedOptionId: null }
      } else if (q.type === 'SIMULATION') {
        const lang = state.answers[questionId]?.language || 'python'
        state.answers[questionId] = {
          language: lang,
          code: q.starterCode?.[lang] || '',
          customInput: '',
        }
      } else if (q.type === 'SQL_TASK') {
        state.answers[questionId] = { query: q.starterQuery || '' }
      } else if (q.type === 'UI_TASK') {
        state.answers[questionId] = {
          html: q.starterHtml || '',
          css: q.starterCss || '',
          js: q.starterJs || '',
        }
      }

      state.questionStatus[questionId] = QUESTION_STATUS.VISITED
    },

    // Timer sync reducers
    tickTimer: (state) => {
      if (state.timer.isTimeUp) return

      const clientNow = Date.now()
      const serverEstimatedNow = clientNow + state.timer.serverTimeOffset
      const remaining = Math.max(
        0,
        Math.floor((state.timer.serverDeadline - serverEstimatedNow) / 1000)
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

      const serverEstimatedNow = clientNow + offset
      const remaining = Math.max(
        0,
        Math.floor((state.timer.serverDeadline - serverEstimatedNow) / 1000)
      )
      state.timer.remainingSeconds = remaining
      if (remaining <= 0) {
        state.timer.isTimeUp = true
      }
    },

    // Code & SQL Execution Reducers
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

    // Submission Reducers
    submissionStart: (state) => {
      state.submission.isSubmitting = true
      state.submission.error = null
    },

    submissionSuccess: (state, action) => {
      state.submission.isSubmitting = false
      state.submission.isSubmitted = true
      state.submission.jobId = action.payload.jobId
      state.submission.submittedAt = action.payload.submittedAt
      state.submission.message = action.payload.message
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
  executionStart,
  executionSuccess,
  executionFailed,
  submissionStart,
  submissionSuccess,
  submissionFailed,
  resetExamSession,
} = examSlice.actions

export default examSlice.reducer
