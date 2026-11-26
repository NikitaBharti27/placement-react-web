import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setSelectedCompany,
  setPracticeGameType,
  openConsentGate,
  startRankedSession,
  startPracticeSession,
  appendRawGameEvent,
  recordStageOutcome,
  advanceToNextStage,
  appendProctoringAlert,
  resetGamifiedSession,
} from './gamifiedSlice'
import { submitCompanyGamifiedRound } from './gamifiedThunks'
import { getCompanyProfileById } from '../../config/companyGamifiedCriteria'

/**
 * Primary hook for managing Company-Specific Gamified Rounds,
 * raw interaction telemetry, and authoritative score verification.
 */
export const useGamifiedSession = () => {
  const dispatch = useDispatch()
  const gamified = useSelector((state) => state.gamified)

  const selectedCompany = getCompanyProfileById(gamified.selectedCompanyId)
  const sessionCompany = getCompanyProfileById(gamified.session.companyId)

  const selectCompany = useCallback(
    (companyId) => {
      dispatch(setSelectedCompany(companyId))
    },
    [dispatch]
  )

  const selectPracticeGame = useCallback(
    (gameType) => {
      dispatch(setPracticeGameType(gameType))
    },
    [dispatch]
  )

  const requestRankedStart = useCallback(
    (companyId) => {
      dispatch(openConsentGate(companyId))
    },
    [dispatch]
  )

  const acceptConsentAndStart = useCallback(
    (companyId) => {
      const now = Date.now()
      dispatch(
        startRankedSession({
          companyId: companyId || gamified.selectedCompanyId,
          startedAtMs: now,
          consentTimestamp: new Date(now).toISOString(),
        })
      )
    },
    [dispatch, gamified.selectedCompanyId]
  )

  const launchPracticeRound = useCallback(
    (companyId, gameType) => {
      dispatch(
        startPracticeSession({
          companyId,
          gameType,
          startedAtMs: Date.now(),
        })
      )
    },
    [dispatch]
  )

  const recordRawEvent = useCallback(
    ({ stageNumber = 1, gameType, action, payload = {} }) => {
      const now = Date.now()
      const baseStart = gamified.session.startedAtMs || now
      dispatch(
        appendRawGameEvent({
          id: `evt_${now}_${Math.random().toString(36).slice(2, 6)}`,
          stageNumber,
          gameType,
          action,
          payload,
          elapsedMs: Math.max(0, now - baseStart),
          timestamp: new Date(now).toISOString(),
        })
      )
    },
    [dispatch, gamified.session.startedAtMs]
  )

  const completeStage = useCallback(
    (stageResult) => {
      dispatch(recordStageOutcome(stageResult))
    },
    [dispatch]
  )

  const nextStage = useCallback(() => {
    dispatch(advanceToNextStage())
  }, [dispatch])

  const recordProctorAlert = useCallback(
    (alertType, detail) => {
      dispatch(
        appendProctoringAlert({
          id: `alt_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          type: alertType,
          detail,
          timestamp: new Date().toISOString(),
        })
      )
    },
    [dispatch]
  )

  const submitRankedRound = useCallback(
    ({ companyId, stageResultsOverride = null, claimedScore = null }) =>
      dispatch(
        submitCompanyGamifiedRound({
          companyId,
          stageResultsOverride,
          claimedScore,
        })
      ),
    [dispatch]
  )

  const exitSession = useCallback(() => {
    dispatch(resetGamifiedSession())
  }, [dispatch])

  return {
    ...gamified,
    selectedCompany,
    sessionCompany,
    selectCompany,
    selectPracticeGame,
    requestRankedStart,
    acceptConsentAndStart,
    launchPracticeRound,
    recordRawEvent,
    completeStage,
    nextStage,
    recordProctorAlert,
    submitRankedRound,
    exitSession,
  }
}

/**
 * Advisory Browser Proctoring Listener for Gamified Rounds.
 * Tracks tab switches, window focus loss, and copy/paste attempts in real time.
 */
export const useGamifiedProctor = ({ enabled, onAlert }) => {
  const onAlertRef = useRef(onAlert)

  useEffect(() => {
    onAlertRef.current = onAlert
  }, [onAlert])

  useEffect(() => {
    if (!enabled) return

    const emit = (type, detail) => {
      if (onAlertRef.current) {
        onAlertRef.current(type, detail)
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        emit('TAB_SWITCH', 'Candidate switched away from active gamified tab')
      }
    }

    const handleBlur = () => {
      emit('WINDOW_BLUR', 'Browser window lost focus during cognitive assessment')
    }

    const handleCopy = () => {
      emit('COPY_ATTEMPT', 'Clipboard copy triggered during gamified round')
    }

    const handlePaste = () => {
      emit('PASTE_ATTEMPT', 'Clipboard paste triggered during gamified round')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
    }
  }, [enabled])
}
