import { createSlice } from '@reduxjs/toolkit'
import { GAME_TYPES } from '../../config/companyGamifiedCriteria'

const initialSessionState = {
  mode: 'idle', // 'idle' | 'consent' | 'ranked' | 'practice' | 'completed'
  companyId: 'accenture',
  consentAccepted: false,
  consentTimestamp: null,
  currentStageIndex: 0,
  stageResults: [],
  startedAtMs: null,
}

const initialState = {
  selectedCompanyId: 'accenture',
  practiceGameType: GAME_TYPES.PATH_FINDER,
  session: initialSessionState,
  rawEvents: [],
  proctoringAlerts: [],
  bestScoresByCompany: {},
  submission: {
    isSubmitting: false,
    result: null,
    error: null,
  },
}

export const gamifiedSlice = createSlice({
  name: 'gamified',
  initialState,
  reducers: {
    setSelectedCompany: (state, action) => {
      state.selectedCompanyId = action.payload
    },

    setPracticeGameType: (state, action) => {
      state.practiceGameType = action.payload
    },

    openConsentGate: (state, action) => {
      const companyId = action.payload || state.selectedCompanyId
      state.selectedCompanyId = companyId
      state.session = {
        ...initialSessionState,
        mode: 'consent',
        companyId,
      }
      state.rawEvents = []
      state.proctoringAlerts = []
      state.submission = { isSubmitting: false, result: null, error: null }
    },

    startRankedSession: (state, action) => {
      const { companyId, startedAtMs, consentTimestamp } = action.payload
      state.selectedCompanyId = companyId
      state.session = {
        mode: 'ranked',
        companyId,
        consentAccepted: true,
        consentTimestamp,
        currentStageIndex: 0,
        stageResults: [],
        startedAtMs,
      }
      state.rawEvents = []
      state.proctoringAlerts = []
      state.submission = { isSubmitting: false, result: null, error: null }
    },

    startPracticeSession: (state, action) => {
      const { companyId, gameType, startedAtMs } = action.payload
      state.selectedCompanyId = companyId
      state.practiceGameType = gameType
      state.session = {
        mode: 'practice',
        companyId,
        consentAccepted: false,
        consentTimestamp: null,
        currentStageIndex: 0,
        stageResults: [],
        startedAtMs,
      }
      state.rawEvents = []
      state.proctoringAlerts = []
      state.submission = { isSubmitting: false, result: null, error: null }
    },

    appendRawGameEvent: (state, action) => {
      const event = action.payload
      if (state.rawEvents.length >= 2000) {
        state.rawEvents.shift()
      }
      state.rawEvents.push(event)
    },

    recordStageOutcome: (state, action) => {
      const stageResult = action.payload
      const existingIdx = state.session.stageResults.findIndex(
        (r) => r.stageNumber === stageResult.stageNumber
      )
      if (existingIdx >= 0) {
        state.session.stageResults[existingIdx] = stageResult
      } else {
        state.session.stageResults.push(stageResult)
      }
    },

    advanceToNextStage: (state) => {
      state.session.currentStageIndex += 1
    },

    appendProctoringAlert: (state, action) => {
      state.proctoringAlerts.unshift(action.payload)
      if (state.proctoringAlerts.length > 50) {
        state.proctoringAlerts.pop()
      }
    },

    gamifiedSubmitStart: (state) => {
      state.submission.isSubmitting = true
      state.submission.error = null
    },

    gamifiedSubmitSuccess: (state, action) => {
      const verificationResult = action.payload
      state.submission.isSubmitting = false
      state.submission.result = verificationResult
      state.session.mode = 'completed'

      const scorecard = verificationResult?.authoritativeScorecard
      if (scorecard?.companyId && verificationResult?.scoreIntegrity !== 'TAMPER_DETECTED') {
        const prev = state.bestScoresByCompany[scorecard.companyId]
        if (!prev || scorecard.finalScore >= prev.finalScore) {
          state.bestScoresByCompany[scorecard.companyId] = {
            finalScore: scorecard.finalScore,
            qualified: scorecard.qualified,
            tierVerdict: scorecard.tierVerdict,
            verifiedAt: verificationResult.verifiedAt,
          }
        }
      }
    },

    gamifiedSubmitFailed: (state, action) => {
      state.submission.isSubmitting = false
      state.submission.error = action.payload || 'Score verification failed'
    },

    resetGamifiedSession: (state) => {
      state.session = {
        ...initialSessionState,
        companyId: state.selectedCompanyId,
      }
      state.rawEvents = []
      state.proctoringAlerts = []
      state.submission = { isSubmitting: false, result: null, error: null }
    },
  },
})

export const {
  setSelectedCompany,
  setPracticeGameType,
  openConsentGate,
  startRankedSession,
  startPracticeSession,
  appendRawGameEvent,
  recordStageOutcome,
  advanceToNextStage,
  appendProctoringAlert,
  gamifiedSubmitStart,
  gamifiedSubmitSuccess,
  gamifiedSubmitFailed,
  resetGamifiedSession,
} = gamifiedSlice.actions

export default gamifiedSlice.reducer
