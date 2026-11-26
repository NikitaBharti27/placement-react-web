/**
 * Shared helpers for PlacePrep Secure cognitive games.
 */

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

export function formatSecondsClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function computeSpeedScore(timeUsedSeconds, timeLimitSeconds) {
  if (!timeLimitSeconds || timeLimitSeconds <= 0) return 75
  const ratio = clamp(timeUsedSeconds / timeLimitSeconds, 0, 1)
  return Math.round(clamp((1 - ratio * 0.6) * 100, 20, 100))
}

export function buildGameOutcome({
  gameType,
  stageNumber = 1,
  accuracy = 0,
  speedScore = 75,
  efficiencyScore = 75,
  mistakes = 0,
  timeUsedSeconds = 0,
  timeLimitSeconds = 180,
  completed = true,
  summary = '',
  details = {},
}) {
  const safeAcc = Math.round(clamp(accuracy, 0, 100))
  const safeSpeed = Math.round(clamp(speedScore, 0, 100))
  const safeEff = Math.round(clamp(efficiencyScore, 0, 100))
  const score = Math.round(safeAcc * 0.55 + safeSpeed * 0.25 + safeEff * 0.2)

  return {
    gameType,
    stageNumber,
    score: clamp(score, 0, 100),
    accuracy: safeAcc,
    speedScore: safeSpeed,
    efficiencyScore: safeEff,
    mistakes: Math.max(0, Number(mistakes) || 0),
    timeUsedSeconds: Math.max(0, Math.round(timeUsedSeconds)),
    timeLimitSeconds,
    completed,
    summary,
    details,
  }
}
