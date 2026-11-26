import { useState, useEffect, useCallback, useRef } from 'react'
import {
  KeyRound,
  DoorOpen,
  User,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Clock,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react'
import {
  buildGameOutcome,
  clamp,
  computeSpeedScore,
  formatSecondsClock,
} from './gameUtils'

function isPathClear(grid, start, end) {
  const size = grid.length
  const queue = [start]
  const visited = new Set([`${start.r},${start.c}`])

  while (queue.length > 0) {
    const { r, c } = queue.shift()
    if (r === end.r && c === end.c) return true

    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]
    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (
        nr >= 0 &&
        nr < size &&
        nc >= 0 &&
        nc < size &&
        grid[nr][nc] !== 1 &&
        !visited.has(`${nr},${nc}`)
      ) {
        visited.add(`${nr},${nc}`)
        queue.push({ r: nr, c: nc })
      }
    }
  }
  return false
}

function generateSolvableMaze(level) {
  const size = Math.min(3 + level, 7)
  const start = { r: 0, c: 0 }
  const door = { r: size - 1, c: size - 1 }
  const keyPos = {
    r: Math.max(0, Math.floor(size / 2) - 1),
    c: Math.max(1, size - 2),
  }

  let newGrid = []
  let isSolvable = false
  let tries = 0

  while (!isSolvable && tries < 120) {
    tries++
    newGrid = Array.from({ length: size }, () => Array(size).fill(0))

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (r === start.r && c === start.c) continue
        if (r === door.r && c === door.c) continue
        if (r === keyPos.r && c === keyPos.c) continue
        if (Math.random() < 0.25) newGrid[r][c] = 1
      }
    }

    newGrid[keyPos.r][keyPos.c] = 2

    if (isPathClear(newGrid, start, keyPos) && isPathClear(newGrid, keyPos, door)) {
      isSolvable = true
    }
  }

  if (!isSolvable) {
    newGrid = Array.from({ length: size }, () => Array(size).fill(0))
    newGrid[keyPos.r][keyPos.c] = 2
  }

  return { grid: newGrid, size }
}

/**
 * Game 3: Key-Door Memory Maze
 * Ported & enhanced from Ayan Capstone. Supports both Arrow/WASD keyboard
 * navigation and on-screen directional pads with wall-collision penalties.
 */
export const KeyDoorMazeGame = ({
  config = {},
  stageNumber = 1,
  mode = 'ranked',
  onRawEvent,
  onComplete,
}) => {
  const startLevel = config.startLevel || 1
  const totalLevels = config.totalLevels || 2
  const timeLimitSeconds = config.timeLimitSeconds || 180

  const [levelOffset, setLevelOffset] = useState(0)
  const currentLevel = startLevel + levelOffset
  const [mazeData, setMazeData] = useState(() => generateSolvableMaze(startLevel))
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds)
  const [wallHits, setWallHits] = useState(0)
  const [totalMoves, setTotalMoves] = useState(0)
  const [hasKey, setHasKey] = useState(false)
  const [player, setPlayer] = useState({ r: 0, c: 0 })
  const [hitWall, setHitWall] = useState(null)
  const [isResetting, setIsResetting] = useState(false)
  const [status, setStatus] = useState('playing') // 'playing' | 'level_won' | 'completed' | 'lost'

  const { grid, size } = mazeData

  const timeLeftRef = useRef(timeLeft)
  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  // Countdown tick without side effects inside state updater
  useEffect(() => {
    if (status !== 'playing') return
    const interval = setInterval(() => {
      const next = timeLeftRef.current - 1
      if (next <= 0) {
        clearInterval(interval)
        setTimeLeft(0)
        setStatus('lost')
      } else {
        setTimeLeft(next)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [status])

  const move = useCallback(
    (dr, dc) => {
      if (status !== 'playing' || isResetting) return

      const nr = player.r + dr
      const nc = player.c + dc

      if (nr < 0 || nr >= size || nc < 0 || nc >= size) return

      const nextMoves = totalMoves + 1
      setTotalMoves(nextMoves)

      const hitObstacle = grid[nr][nc] === 1
      const lockedDoor = nr === size - 1 && nc === size - 1 && !hasKey

      onRawEvent?.({
        stageNumber,
        gameType: 'key-door',
        action: 'MAZE_MOVE',
        payload: {
          level: currentLevel,
          dr,
          dc,
          toRow: nr,
          toCol: nc,
          hitWall: hitObstacle || lockedDoor,
          hasKey,
        },
      })

      if (hitObstacle || lockedDoor) {
        setWallHits((w) => w + 1)
        setHitWall({ r: nr, c: nc })
        setIsResetting(true)

        setTimeout(() => {
          setPlayer({ r: 0, c: 0 })
          setHasKey(false)
          setHitWall(null)
          setIsResetting(false)
        }, 700)
        return
      }

      setPlayer({ r: nr, c: nc })
      const pickedKey = grid[nr][nc] === 2 || hasKey
      if (grid[nr][nc] === 2) {
        setHasKey(true)
      }

      if (nr === size - 1 && nc === size - 1 && pickedKey) {
        if (levelOffset + 1 >= totalLevels) {
          setStatus('completed')
        } else {
          setStatus('level_won')
        }
      }
    },
    [
      status,
      isResetting,
      player,
      size,
      totalMoves,
      grid,
      hasKey,
      onRawEvent,
      stageNumber,
      currentLevel,
      levelOffset,
      totalLevels,
    ]
  )

  const moveRef = useRef(move)
  useEffect(() => {
    moveRef.current = move
  }, [move])

  // Keyboard Arrow / WASD support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      const keyMap = {
        ArrowUp: [-1, 0],
        w: [-1, 0],
        W: [-1, 0],
        ArrowDown: [1, 0],
        s: [1, 0],
        S: [1, 0],
        ArrowLeft: [0, -1],
        a: [0, -1],
        A: [0, -1],
        ArrowRight: [0, 1],
        d: [0, 1],
        D: [0, 1],
      }
      if (e.key in keyMap) {
        e.preventDefault()
        const [dr, dc] = keyMap[e.key]
        moveRef.current(dr, dc)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNextLevel = () => {
    const nextOffset = levelOffset + 1
    setLevelOffset(nextOffset)
    setMazeData(generateSolvableMaze(startLevel + nextOffset))
    setPlayer({ r: 0, c: 0 })
    setHasKey(false)
    setHitWall(null)
    setIsResetting(false)
    setStatus('playing')
  }

  const handleResetAll = () => {
    setLevelOffset(0)
    setMazeData(generateSolvableMaze(startLevel))
    setTimeLeft(timeLimitSeconds)
    setWallHits(0)
    setTotalMoves(0)
    setPlayer({ r: 0, c: 0 })
    setHasKey(false)
    setHitWall(null)
    setIsResetting(false)
    setStatus('playing')
  }

  const handleFinishStage = () => {
    const levelsDone =
      status === 'completed'
        ? totalLevels
        : status === 'level_won'
        ? levelOffset + 1
        : levelOffset
    const timeUsed = Math.max(1, timeLimitSeconds - timeLeft)
    const accuracy = Math.round(clamp((levelsDone / totalLevels) * 100 - wallHits * 8, 20, 100))
    const speedScore = status === 'completed' ? computeSpeedScore(timeUsed, timeLimitSeconds) : 25
    const efficiencyScore = clamp(100 - wallHits * 12, 20, 100)

    onComplete?.(
      buildGameOutcome({
        gameType: 'key-door',
        stageNumber,
        accuracy,
        speedScore,
        efficiencyScore,
        mistakes: wallHits,
        timeUsedSeconds: timeUsed,
        timeLimitSeconds,
        completed: status === 'completed',
        summary: `Cleared ${levelsDone}/${totalLevels} maze levels with ${wallHits} wall collisions`,
        details: { levelsCompleted: levelsDone, totalLevels, wallHits, totalMoves },
      })
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl mx-auto shadow-sm relative">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Level {levelOffset + 1} of {totalLevels} · {size}×{size} Grid
          </span>
          <h3 className="text-lg font-bold text-slate-900">Key-Door Memory Maze</h3>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              hasKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {hasKey ? 'Key Collected ✓' : 'Find Key First'}
          </span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs font-bold ${
              timeLeft <= 30
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-cyan-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatSecondsClock(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Maze Grid */}
      <div className="flex justify-center my-6">
        <div
          className="grid gap-0 border-2 border-slate-400 bg-slate-50 rounded-lg overflow-visible relative"
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isPlayer = player.r === r && player.c === c
              const isKey = cell === 2 && !hasKey
              const isDoor = r === size - 1 && c === size - 1
              const isHit = hitWall?.r === r && hitWall?.c === c

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center relative transition-all duration-150 ${
                    isPlayer
                      ? 'bg-slate-900 text-amber-400'
                      : isHit
                      ? 'bg-rose-100 border-2 border-rose-500 z-20 scale-105'
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  {isPlayer && (
                    <>
                      <User className="w-6 h-6 text-amber-400" />
                      {status === 'playing' && !isResetting && (
                        <>
                          <button
                            type="button"
                            onClick={() => move(-1, 0)}
                            aria-label="Move Up"
                            className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md flex items-center justify-center shadow-md z-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => move(1, 0)}
                            aria-label="Move Down"
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md flex items-center justify-center shadow-md z-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => move(0, -1)}
                            aria-label="Move Left"
                            className="absolute top-1/2 -left-4 -translate-y-1/2 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md flex items-center justify-center shadow-md z-20 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => move(0, 1)}
                            aria-label="Move Right"
                            className="absolute top-1/2 -right-4 -translate-y-1/2 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md flex items-center justify-center shadow-md z-20 cursor-pointer"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {isKey && !isPlayer && <KeyRound className="w-6 h-6 text-amber-500" />}
                  {isDoor && !isPlayer && (
                    <DoorOpen
                      className={`w-6 h-6 ${hasKey ? 'text-emerald-600' : 'text-slate-600'}`}
                    />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Use Arrow Keys / WASD or pads · Invisible walls reset you to start</span>
        </div>

        <div className="flex items-center gap-4">
          <span>
            Moves: <strong className="font-mono text-slate-900">{totalMoves}</strong>
          </span>
          <span>
            Wall Hits: <strong className="font-mono text-rose-600">{wallHits}</strong>
          </span>
          {mode === 'practice' && (
            <button
              type="button"
              onClick={handleResetAll}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Level Won / Completed / Lost Overlays */}
      {status === 'level_won' && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center z-30 p-6 text-center space-y-4">
          <h4 className="text-2xl font-bold text-emerald-600">Maze Level Cleared!</h4>
          <p className="text-xs text-slate-600">
            Ready for Level {levelOffset + 2} ({Math.min(3 + currentLevel + 1, 7)}×
            {Math.min(3 + currentLevel + 1, 7)} adaptive grid).
          </p>
          <button
            type="button"
            onClick={handleNextLevel}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Advance to Next Level</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {(status === 'completed' || status === 'lost') && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center z-30 p-6 text-center space-y-4">
          <h4
            className={`text-2xl font-bold ${
              status === 'completed' ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {status === 'completed' ? 'All Maze Levels Escaped!' : "Time's Up!"}
          </h4>
          <p className="text-xs text-slate-600">
            Total Moves: <strong>{totalMoves}</strong> · Wall Collisions:{' '}
            <strong>{wallHits}</strong>
          </p>
          <div className="flex items-center gap-3">
            {mode === 'practice' && (
              <button
                type="button"
                onClick={handleResetAll}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Play Again
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
      )}
    </div>
  )
}

export default KeyDoorMazeGame
