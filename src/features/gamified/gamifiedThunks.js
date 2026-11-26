import { gamifiedApi } from '../../api/gamifiedApi'
import {
  gamifiedSubmitStart,
  gamifiedSubmitSuccess,
  gamifiedSubmitFailed,
} from './gamifiedSlice'

/**
 * Submit recorded raw gamified events to the backend for anti-tamper recalculation.
 * Supports optional claimedScore override for evaluating tamper detection.
 */
export const submitCompanyGamifiedRound =
  ({ companyId, stageResultsOverride = null, claimedScore = null }) =>
  async (dispatch, getState) => {
    const state = getState()
    const gamified = state.gamified
    const stageResults = stageResultsOverride || gamified.session.stageResults
    const rawEvents = gamified.rawEvents
    const proctoringAlerts = gamified.proctoringAlerts

    dispatch(gamifiedSubmitStart())
    try {
      const result = await gamifiedApi.submitGamifiedRound({
        companyId,
        stageResults,
        rawEvents,
        proctoringAlerts,
        claimedScore,
      })
      dispatch(gamifiedSubmitSuccess(result))
      return { success: true, result }
    } catch (error) {
      const msg = error.message || 'Unable to verify gamified round score'
      dispatch(gamifiedSubmitFailed(msg))
      return { success: false, error: msg }
    }
  }
