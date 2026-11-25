import { assessmentApi } from '../../api/assessmentApi'
import {
  examStartLoading,
  examLoadingFailed,
  setAssessment,
  updateAuthoritativeServerTime,
  executionStart,
  executionSuccess,
  executionFailed,
  submissionStart,
  submissionSuccess,
  submissionFailed,
} from './examSlice'

/**
 * Fetch and initialize assessment by ID
 */
export const loadAssessment = (assessmentId) => async (dispatch) => {
  dispatch(examStartLoading())
  try {
    const data = await assessmentApi.getAssessmentById(assessmentId)
    dispatch(setAssessment(data))
    return { success: true, data }
  } catch (error) {
    const msg = error.message || 'Failed to initialize assessment'
    dispatch(examLoadingFailed(msg))
    return { success: false, error: msg }
  }
}

/**
 * Sync server-authoritative timer
 */
export const syncExamTimer = (assessmentId) => async (dispatch) => {
  try {
    const timeData = await assessmentApi.getAuthoritativeTime(assessmentId)
    if (timeData?.serverCurrentTime) {
      dispatch(updateAuthoritativeServerTime(timeData))
    }
  } catch (err) {
    console.warn('Authoritative timer sync ping failed; using calibrated drift estimate', err)
  }
}

/**
 * Execute simulation code in isolated Docker Sandbox
 */
export const executeCode =
  ({ assessmentId, questionId, code, language, customInput }) =>
  async (dispatch) => {
    dispatch(executionStart({ questionId }))
    try {
      const results = await assessmentApi.runCodeSandbox({
        assessmentId,
        questionId,
        code,
        language,
        customInput,
      })
      dispatch(executionSuccess({ questionId, results }))
      return { success: true, results }
    } catch (error) {
      const msg = error.message || 'Sandbox execution error'
      dispatch(executionFailed({ questionId, error: msg }))
      return { success: false, error: msg }
    }
  }

/**
 * Execute SQL Query
 */
export const executeSql =
  ({ assessmentId, questionId, query }) =>
  async (dispatch) => {
    dispatch(executionStart({ questionId }))
    try {
      const results = await assessmentApi.runSqlQuery({
        assessmentId,
        questionId,
        query,
      })
      dispatch(executionSuccess({ questionId, results }))
      return { success: true, results }
    } catch (error) {
      const msg = error.message || 'SQL execution failed'
      dispatch(executionFailed({ questionId, error: msg }))
      return { success: false, error: msg }
    }
  }

/**
 * Final submit assessment
 */
export const finalizeSubmission =
  (assessmentId) => async (dispatch, getState) => {
    const state = getState()
    const answers = state.exam.answers

    dispatch(submissionStart())
    try {
      const result = await assessmentApi.submitAssessment({
        assessmentId,
        answers,
        proctoringMetadata: {
          clientTimestamp: new Date().toISOString(),
          timeRemainingSeconds: state.exam.timer.remainingSeconds,
          answeredCount: Object.keys(answers).length,
        },
      })
      dispatch(submissionSuccess(result))
      return { success: true, result }
    } catch (error) {
      const msg = error.message || 'Submission failed'
      dispatch(submissionFailed(msg))
      return { success: false, error: msg }
    }
  }
