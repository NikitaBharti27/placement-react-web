import { useState, useEffect, useCallback, useRef } from 'react'
import { Eye, Check, X, Clock, RotateCcw, ArrowRight, Grid } from 'lucide-react'
import {
  buildGameOutcome,
  clamp,
  computeSpeedScore,
  formatSecondsClock,
} from './gameUtils'

function generatePatternRound(roundNumber, config) {
  const baseSize = config.gridSize || 4
  const maxSize = config.maxGridSize || 5
  const gridSize = roundNumber >= 3 && maxSize > baseSize ? maxSize : baseSize
  const totalCells = gridSize * gridSize
  const initialTargets = config.initialTargets || 4
  const targetCount = Math.min(totalCells - 2, initialTargets + (roundNumber - 1))

  const indices = Array.from({ length: totalCells }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, targetCount)

  return {
    gridSize,
    targets: new Set(indices),
  }
}

/**
 * Game 4: Grid Memory (Spatial Memory Recall)
 * Explicitly required by PlacePrep Secure Capstone architecture for Accenture & Capgemini tracks.
 */
export const GridMemoryGame = ({
  config = {},
  stageNumber = 1,
  mode = 'ranked',
  onRawEvent,
  onComplete,
}) => {
  const totalRounds = config.totalRounds || 3
  const previewDurationMs = config.previewDurationMs || 2300
  const timeLimitSeconds = config.timeLimitSeconds || 120

  const [round, setRound] = useState(1)
  const [pattern, setPattern] = useState(() => generatePatternRound(1, config))
  const [phase, setPhase] = useState('preview') // 'preview' | 'recall' | 'round_done' | 'finished'
  const [foundCells, setFoundCells] = useState([])
  const [wrongCells, setWrongCells] = useState([])
  const [wrongClicks, setWrongClicks] = useState(0)
  const [roundsPassed, setRoundsPassed] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds)

  const statsRef = useRef({ roundsPassed: 0, wrongClicks: 0, timeLeft: timeLimitSeconds })
  useEffect(() => {
    statsRef.current = { roundsPassed, wrongClicks, timeLeft }
  }, [roundsPassed, wrongClicks, timeLeft])

  // Preview flash timer -> transitions from preview to recall
  useEffect(() => {
    if (phase !== 'preview') return
    const timer = setTimeout(() => {
      setPhase('recall')
    }, previewDurationMs)
    return () => clearTimeout(timer)
  }, [phase, previewDurationMs, round])

  // Global round timer during active recall without side effects inside updater
  useEffect(() => {
    if (phase === 'finished') return
    const interval = setInterval(() => {
      const next = statsRef.current.timeLeft - 1
      if (next <= 0) {
        clearInterval(interval)
        setTimeLeft(0)
        setPhase('finished')
      } else {
        setTimeLeft(next)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  const startRound = useCallback(
    (nextRoundNum) => {
      setRound(nextRoundNum)
      setPattern(generatePatternRound(nextRoundNum, config))
      setFoundCells([])
      setWrongCells([])
      setPhase('preview')
    },
    [config]
  )

  const handleCellClick = (index) => {
    if (phase !== 'recall') return
    if (foundCells.includes(index) || wrongCells.includes(index)) return

    const row = Math.floor(index / pattern.gridSize)
    const col = index % pattern.gridSize
    const isTarget = pattern.targets.has(index)

    onRawEvent?.({
      stageNumber,
      gameType: 'grid-memory',
      action: 'GRID_CELL_CLICK',
      payload: { round, row, col, isTarget, gridSize: pattern.gridSize },
    })

    if (isTarget) {
      const nextFound = [...foundCells, index]
      setFoundCells(nextFound)

      if (nextFound.length === pattern.targets.size) {
        const nextPassed = roundsPassed + 1
        setRoundsPassed(nextPassed)

        if (round >= totalRounds) {
          setPhase('finished')
        } else {
          setPhase('round_done')
          setTimeout(() => {
            startRound(round + 1)
          }, 700)
        }
      }
    } else {
      setWrongCells((prev) => [...prev, index])
      setWrongClicks((w) => w + 1)
    }
  }

  const handleRestart = () => {
    setRoundsPassed(0)
    setWrongClicks(0)
    setTimeLeft(timeLimitSeconds)
    startRound(1)
  }

  const handleFinishStage = () => {
    const timeUsed = Math.max(1, timeLimitSeconds - timeLeft)
    const roundRate = (roundsPassed / totalRounds) * 100
    const accuracy = clamp(Math.round(roundRate - wrongClicks * 6), 15, 100)
    const speedScore =
      roundsPassed === totalRounds ? computeSpeedScore(timeUsed, timeLimitSeconds) : 30
    const efficiencyScore = clamp(100 - wrongClicks * 12, 20, 100)

    onComplete?.(
      buildGameOutcome({
        gameType: 'grid-memory',
        stageNumber,
        accuracy,
        speedScore,
        efficiencyScore,
        mistakes: wrongClicks,
        timeUsedSeconds: timeUsed,
        timeLimitSeconds,
        completed: roundsPassed === totalRounds,
        summary: `Recalled ${roundsPassed}/${totalRounds} spatial matrices (${wrongClicks} false clicks)`,
        details: { roundsPassed, totalRounds, wrongClicks },
      })
    )
  }

  if (phase === 'finished') {
    const accuracy = clamp(
      Math.round((roundsPassed / totalRounds) * 100 - wrongClicks * 6),
      15,
      100
    )

    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-xl mx-auto text-center shadow-sm space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center border border-purple-100">
          <Grid className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Grid Memory Assessment Complete</h3>
          <p className="text-xs text-slate-500 mt-1">
            Completed {roundsPassed} of {totalRounds} spatial working memory stages
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-2xl font-extrabold text-purple-600 font-mono">
              {roundsPassed}/{totalRounds}
            </div>
            <div className="text-[11px] font-medium text-slate-500">Matrices Recalled</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">{accuracy}%</div>
            <div className="text-[11px] font-medium text-slate-500">Spatial Accuracy</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-2xl font-extrabold text-rose-600 font-mono">{wrongClicks}</div>
            <div className="text-[11px] font-medium text-slate-500">False Clicks</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          {mode === 'practice' && (
            <button
              type="button"
              onClick={handleRestart}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleFinishStage}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>{mode === 'practice' ? 'Record Score' : 'Save & Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl mx-auto shadow-xl text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
            Stage {round} of {totalRounds} · {pattern.gridSize}×{pattern.gridSize} Matrix
          </span>
          <h3 className="text-lg font-bold text-white">Grid Memory Recall</h3>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 ${
              phase === 'preview'
                ? 'bg-indigo-950/90 border-indigo-500 text-indigo-300 animate-pulse'
                : phase === 'round_done'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                : 'bg-slate-950 border-slate-700 text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>
              {phase === 'preview'
                ? 'Memorize Pattern...'
                : phase === 'round_done'
                ? 'Stage Cleared!'
                : `Recall ${foundCells.length}/${pattern.targets.size}`}
            </span>
          </span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-mono text-xs font-bold ${
              timeLeft <= 20
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-cyan-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatSecondsClock(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Memory Grid */}
      <div className="flex justify-center my-6">
        <div
          className="grid gap-2.5 bg-slate-950 p-4 rounded-2xl border border-slate-800"
          style={{ gridTemplateColumns: `repeat(${pattern.gridSize}, 1fr)` }}
        >
          {Array.from({ length: pattern.gridSize * pattern.gridSize }, (_, idx) => {
            const isTarget = pattern.targets.has(idx)
            const isFound = foundCells.includes(idx)
            const isWrong = wrongCells.includes(idx)
            const showHighlight = (phase === 'preview' && isTarget) || isFound

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCellClick(idx)}
                disabled={phase !== 'recall'}
                aria-label={`Grid cell ${idx + 1}`}
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                  showHighlight
                    ? isFound
                      ? 'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_16px_rgba(16,185,129,0.5)] scale-105'
                      : 'bg-indigo-500 border-indigo-300 text-white shadow-[0_0_18px_rgba(99,102,241,0.6)] scale-105'
                    : isWrong
                    ? 'bg-rose-500/80 border-rose-300 text-white'
                    : 'bg-slate-800/90 border-slate-700 hover:bg-slate-700 cursor-pointer'
                }`}
              >
                {isFound && <Check className="w-5 h-5" />}
                {isWrong && <X className="w-5 h-5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-4">
        <span>
          Targets to Recall: <strong className="text-white">{pattern.targets.size}</strong>
        </span>
        <span>
          False Clicks: <strong className="text-rose-400 font-mono">{wrongClicks}</strong>
        </span>
      </div>
    </div>
  )
}

export default GridMemoryGame
