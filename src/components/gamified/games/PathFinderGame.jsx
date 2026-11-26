import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { RotateCcw, Check, Clock, Move, Sparkles, AlertCircle, ArrowRight } from 'lucide-react'
import {
  buildGameOutcome,
  clamp,
  computeSpeedScore,
  formatSecondsClock,
} from './gameUtils'

const TILE_TYPES = { EMPTY: 0, STRAIGHT: 1, CORNER: 2, T_JUNCTION: 3, CROSS: 4 }

const TILE_PATHS = {
  [TILE_TYPES.EMPTY]: '',
  [TILE_TYPES.STRAIGHT]: 'M50,0 L50,100',
  [TILE_TYPES.CORNER]: 'M50,0 L50,50 L100,50',
  [TILE_TYPES.T_JUNCTION]: 'M50,0 L50,100 M50,50 L100,50',
  [TILE_TYPES.CROSS]: 'M50,0 L50,100 M0,50 L100,50',
}

const BASE_CONNECTIONS = {
  [TILE_TYPES.EMPTY]: [false, false, false, false],
  [TILE_TYPES.STRAIGHT]: [true, false, true, false], // N, E, S, W
  [TILE_TYPES.CORNER]: [true, true, false, false],
  [TILE_TYPES.T_JUNCTION]: [true, true, true, false],
  [TILE_TYPES.CROSS]: [true, true, true, true],
}

function getConnections(type, rotation) {
  const base = BASE_CONNECTIONS[type] || BASE_CONNECTIONS[TILE_TYPES.EMPTY]
  let conns = [...base]
  for (let i = 0; i < rotation; i++) {
    conns = [conns[3], conns[0], conns[1], conns[2]]
  }
  return conns
}

/**
 * Generates a guaranteed solvable N×N conduit rotation grid from [0,0] to [N-1,N-1].
 */
function generateSolvableGrid(size) {
  const newGrid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      type: Math.random() > 0.35 ? TILE_TYPES.STRAIGHT : TILE_TYPES.CORNER,
      rotation: Math.floor(Math.random() * 4),
    }))
  )

  const path = []
  const visited = Array.from({ length: size }, () => Array(size).fill(false))

  const dfs = (r, c) => {
    if (r === size - 1 && c === size - 1) {
      path.push({ r, c })
      return true
    }
    visited[r][c] = true
    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ].sort(() => Math.random() - 0.5)

    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
        if (dfs(nr, nc)) {
          path.push({ r, c })
          return true
        }
      }
    }
    return false
  }

  dfs(0, 0)
  path.reverse()

  for (let i = 0; i < path.length; i++) {
    const { r, c } = path[i]
    let inDir = -1
    let outDir = -1

    if (i > 0) {
      const prev = path[i - 1]
      if (prev.r < r) inDir = 0
      if (prev.c > c) inDir = 1
      if (prev.r > r) inDir = 2
      if (prev.c < c) inDir = 3
    }
    if (i < path.length - 1) {
      const next = path[i + 1]
      if (next.r < r) outDir = 0
      if (next.c > c) outDir = 1
      if (next.r > r) outDir = 2
      if (next.c < c) outDir = 3
    }

    if (inDir === -1 && outDir === -1) {
      newGrid[r][c] = { type: TILE_TYPES.CROSS, rotation: 0 }
    } else if (inDir === -1 || outDir === -1) {
      newGrid[r][c] = { type: TILE_TYPES.STRAIGHT, rotation: 0 }
    } else if ((inDir + 2) % 4 === outDir) {
      newGrid[r][c] = { type: TILE_TYPES.STRAIGHT, rotation: 0 }
    } else {
      newGrid[r][c] = { type: TILE_TYPES.CORNER, rotation: 0 }
    }
  }

  // Scramble rotations ensuring puzzle does not immediately start solved
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      newGrid[r][c] = {
        ...newGrid[r][c],
        rotation: Math.floor(Math.random() * 4),
      }
    }
  }

  let guard = 0
  while (computeConnectedSet(newGrid, size).reachedEnd && guard < 10) {
    guard++
    const mid = path[Math.floor(path.length / 2)] || { r: 0, c: 0 }
    newGrid[mid.r][mid.c] = {
      ...newGrid[mid.r][mid.c],
      rotation: (newGrid[mid.r][mid.c].rotation + 1) % 4,
    }
  }

  return newGrid
}

/**
 * Computes all coordinates currently connected to Start (0,0) via matching tile ports.
 */
function computeConnectedSet(grid, size) {
  const visited = new Set()
  if (!grid.length) return { visited, reachedEnd: false }

  const queue = [{ r: 0, c: 0 }]
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ]

  while (queue.length > 0) {
    const { r, c } = queue.shift()
    const key = `${r}-${c}`
    if (visited.has(key)) continue
    visited.add(key)

    const conns = getConnections(grid[r][c].type, grid[r][c].rotation)
    for (let i = 0; i < 4; i++) {
      if (!conns[i]) continue
      const nr = r + dirs[i][0]
      const nc = c + dirs[i][1]
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        const neighborConns = getConnections(grid[nr][nc].type, grid[nr][nc].rotation)
        const oppositeDir = (i + 2) % 4
        if (neighborConns[oppositeDir]) {
          queue.push({ r: nr, c: nc })
        }
      }
    }
  }

  return {
    visited,
    reachedEnd: visited.has(`${size - 1}-${size - 1}`),
  }
}

/**
 * Game 1: Path Finder (Tile Rotation Puzzle)
 * Ported & enhanced from Ayan Capstone with live flow illumination,
 * company-criteria move targets, and raw click event telemetry.
 */
export const PathFinderGame = ({
  config = {},
  stageNumber = 1,
  mode = 'ranked',
  onRawEvent,
  onComplete,
}) => {
  const initialSize = config.gridSize || 4
  const timeLimitSeconds = config.timeLimitSeconds || 210
  const allowSizeSwitch = Boolean(config.allowSizeSwitch || mode === 'practice')
  const optimalMoveTarget = config.optimalMoveTarget || initialSize * initialSize + 2

  const [gridSize, setGridSize] = useState(initialSize)
  const [grid, setGrid] = useState(() => generateSolvableGrid(initialSize))
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds)
  const [moves, setMoves] = useState(0)
  const [failedChecks, setFailedChecks] = useState(0)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'won' | 'lost'
  const [feedbackBanner, setFeedbackBanner] = useState(null)

  const latestRef = useRef({ moves: 0, failedChecks: 0, timeLeft: timeLimitSeconds })
  useEffect(() => {
    latestRef.current = { moves, failedChecks, timeLeft }
  }, [moves, failedChecks, timeLeft])

  const resetBoard = useCallback(
    (targetSize = gridSize) => {
      setGridSize(targetSize)
      setGrid(generateSolvableGrid(targetSize))
      setTimeLeft(timeLimitSeconds)
      setMoves(0)
      setFailedChecks(0)
      setGameState('playing')
      setFeedbackBanner(null)
    },
    [gridSize, timeLimitSeconds]
  )

  const buildResultPayload = useCallback(
    (isWin) => {
      const snap = latestRef.current
      const timeUsed = Math.max(1, timeLimitSeconds - snap.timeLeft)
      const accuracy = isWin ? Math.max(40, 100 - snap.failedChecks * 12) : 25
      const speedScore = isWin ? computeSpeedScore(timeUsed, timeLimitSeconds) : 20
      const extraMoves = Math.max(0, snap.moves - optimalMoveTarget)
      const efficiencyScore = isWin ? clamp(100 - extraMoves * 3, 35, 100) : 25

      return buildGameOutcome({
        gameType: 'path-finder',
        stageNumber,
        accuracy,
        speedScore,
        efficiencyScore,
        mistakes: snap.failedChecks,
        timeUsedSeconds: timeUsed,
        timeLimitSeconds,
        completed: isWin,
        summary: isWin
          ? `Connected ${gridSize}×${gridSize} path in ${snap.moves} moves (${snap.failedChecks} failed checks)`
          : `Timed out after ${snap.moves} rotations`,
        details: { gridSize, moves: snap.moves, failedChecks: snap.failedChecks },
      })
    },
    [gridSize, optimalMoveTarget, stageNumber, timeLimitSeconds]
  )

  // Countdown tick without side effects inside state updater
  useEffect(() => {
    if (gameState !== 'playing') return
    const interval = setInterval(() => {
      const next = latestRef.current.timeLeft - 1
      if (next <= 0) {
        clearInterval(interval)
        setTimeLeft(0)
        setGameState('lost')
        setFeedbackBanner({
          type: 'error',
          title: "Time's Up!",
          text: 'The round clock expired before the conduit reached Exit (E).',
        })
      } else {
        setTimeLeft(next)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState])

  const { visited: connectedCells, reachedEnd } = useMemo(
    () => computeConnectedSet(grid, gridSize),
    [grid, gridSize]
  )

  const handleRotate = (r, c) => {
    if (gameState !== 'playing') return

    const nextMoves = moves + 1
    const nextRotation = (grid[r][c].rotation + 1) % 4

    setGrid((prev) =>
      prev.map((row, ri) =>
        ri === r
          ? row.map((tile, ci) => (ci === c ? { ...tile, rotation: nextRotation } : tile))
          : row
      )
    )
    setMoves(nextMoves)
    setFeedbackBanner(null)

    onRawEvent?.({
      stageNumber,
      gameType: 'path-finder',
      action: 'TILE_ROTATE',
      payload: { row: r, col: c, rotation: nextRotation, moveNumber: nextMoves },
    })
  }

  const handleCheckSolution = () => {
    if (gameState !== 'playing') return

    onRawEvent?.({
      stageNumber,
      gameType: 'path-finder',
      action: 'PATH_CHECK',
      payload: { reachedEnd, moves, connectedCount: connectedCells.size },
    })

    if (reachedEnd) {
      setGameState('won')
      setFeedbackBanner({
        type: 'success',
        title: 'Conduit Path Connected!',
        text: `Route established across ${gridSize}×${gridSize} matrix in ${moves} rotations.`,
      })
    } else {
      setFailedChecks((f) => f + 1)
      setFeedbackBanner({
        type: 'warning',
        title: 'Path Incomplete',
        text: 'Signal has not reached Exit (E) yet. Inspect disconnected segments and keep rotating.',
      })
    }
  }

  const handleFinishStage = () => {
    const outcome = buildResultPayload(gameState === 'won')
    onComplete?.(outcome)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 flex flex-col items-center w-full max-w-2xl mx-auto shadow-xl text-slate-100">
      {/* Header Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">
            Deductive Tile Routing
          </span>
          <h3 className="text-lg font-bold text-white">Path Finder ({gridSize}×{gridSize})</h3>
        </div>

        <div className="flex items-center gap-2">
          {allowSizeSwitch && (
            <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[3, 4, 5].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => resetBoard(sz)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    gridSize === sz
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sz}×{sz}
                </button>
              ))}
            </div>
          )}

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold ${
              timeLeft <= 30
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-cyan-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatSecondsClock(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div
        className="grid gap-1.5 bg-slate-950 p-2.5 border border-slate-800 rounded-2xl shadow-inner mb-5"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {grid.map((row, r) =>
          row.map((tile, c) => {
            const isStart = r === 0 && c === 0
            const isEnd = r === gridSize - 1 && c === gridSize - 1
            const isConnected = connectedCells.has(`${r}-${c}`)

            let strokeColor = '#64748b'
            if (isStart) strokeColor = '#10b981'
            else if (isEnd && isConnected) strokeColor = '#10b981'
            else if (isEnd) strokeColor = '#f43f5e'
            else if (isConnected) strokeColor = '#6366f1'

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleRotate(r, c)}
                disabled={gameState !== 'playing'}
                aria-label={`Rotate tile row ${r + 1} column ${c + 1}`}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-150 cursor-pointer ${
                  isConnected
                    ? 'bg-indigo-50 border-2 border-indigo-400 shadow-xs'
                    : 'bg-white border border-slate-200 hover:bg-slate-50'
                } ${isStart ? 'ring-2 ring-emerald-500' : ''} ${
                  isEnd ? (isConnected ? 'ring-2 ring-emerald-500' : 'ring-2 ring-rose-500') : ''
                }`}
              >
                {tile.type !== TILE_TYPES.EMPTY && (
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full absolute inset-0 transition-transform duration-200 ease-out"
                    style={{ transform: `rotate(${tile.rotation * 90}deg)` }}
                  >
                    <path
                      d={TILE_PATHS[tile.type]}
                      stroke={strokeColor}
                      strokeWidth="16"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                {isStart && (
                  <span className="absolute top-1 left-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                    S
                  </span>
                )}
                {isEnd && (
                  <span
                    className={`absolute bottom-1 right-1 text-[10px] font-bold px-1 rounded ${
                      isConnected
                        ? 'text-emerald-700 bg-emerald-100'
                        : 'text-rose-700 bg-rose-100'
                    }`}
                  >
                    E
                  </span>
                )}
              </button>
            )
          })
        )}
      </div>

      {/* Feedback Banner */}
      {feedbackBanner && (
        <div
          className={`w-full mb-4 px-4 py-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            feedbackBanner.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : feedbackBanner.type === 'warning'
              ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>
              <strong className="font-semibold">{feedbackBanner.title}: </strong>
              <span>{feedbackBanner.text}</span>
            </div>
          </div>
          {gameState !== 'playing' && (
            <button
              type="button"
              onClick={handleFinishStage}
              className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-bold text-xs inline-flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>{mode === 'practice' ? 'Save & Play Again' : 'Save & Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Telemetry & Controls Pill */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Move className="w-3.5 h-3.5 text-indigo-400" />
            Moves: <strong className="text-white font-mono">{moves}</strong>
            <span className="text-slate-500">(Target ≤ {optimalMoveTarget})</span>
          </span>
          <span className="text-slate-400">
            Failed Checks: <strong className="text-amber-400 font-mono">{failedChecks}</strong>
          </span>
          {reachedEnd && gameState === 'playing' && (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Ready to verify!
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => resetBoard(gridSize)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Board</span>
          </button>

          {gameState === 'playing' ? (
            <button
              type="button"
              onClick={handleCheckSolution}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Verify Path</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishStage}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <span>Complete Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PathFinderGame
