import { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, Zap, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react'
import {
  buildGameOutcome,
  clamp,
  computeSpeedScore,
} from './gameUtils'

const POSITION_POOL = [
  { top: '24%', left: '24%' },
  { top: '24%', left: '76%' },
  { top: '50%', left: '50%' },
  { top: '76%', left: '24%' },
  { top: '76%', left: '76%' },
]

/**
 * Generates 3 unique math expressions sorted by value with randomized spatial placement.
 */
function generateProblemSet(questionIndex, totalQuestions) {
  const progress = questionIndex / Math.max(1, totalQuestions)
  const data = []
  const usedValues = new Set()

  while (data.length < 3) {
    let expr
    let val

    if (progress >= 0.8 && Math.random() > 0.45) {
      const n = Math.floor(Math.random() * 5) + 1
      const d = Math.floor(Math.random() * 4) + 2
      val = n / d
      expr = `${n}/${d}`
    } else if (progress >= 0.6 && Math.random() > 0.45) {
      const a = (Math.random() * 9 + 1).toFixed(1)
      const b = (Math.random() * 5 + 0.5).toFixed(1)
      val = parseFloat(a) + parseFloat(b)
      expr = `${a} + ${b}`
    } else if (progress >= 0.3 && Math.random() > 0.45) {
      const op = Math.random() > 0.5 ? '×' : '÷'
      const a = Math.floor(Math.random() * 8) + 2
      const b = Math.floor(Math.random() * 8) + 2
      if (op === '×') {
        val = a * b
        expr = `${a} × ${b}`
      } else {
        val = a
        expr = `${a * b} ÷ ${b}`
      }
    } else {
      const op = Math.random() > 0.5 ? '+' : '−'
      const a = Math.floor(Math.random() * 15) + 5
      const b = Math.floor(Math.random() * 14) + 2
      if (op === '+') {
        val = a + b
        expr = `${a} + ${b}`
      } else {
        val = a - b
        expr = `${a} − ${b}`
      }
    }

    const rounded = Math.round(val * 100) / 100
    if (!usedValues.has(rounded)) {
      usedValues.add(rounded)
      data.push({
        expr,
        val: rounded,
        id: `b_${questionIndex}_${data.length}_${Math.random().toString(36).slice(2, 6)}`,
      })
    }
  }

  const sorted = data
    .sort((a, b) => a.val - b.val)
    .map((item, idx) => ({ ...item, correctIdx: idx }))

  const positions = [...POSITION_POOL].sort(() => Math.random() - 0.5).slice(0, 3)

  return sorted.map((item, idx) => ({
    ...item,
    pos: positions[idx],
  }))
}

/**
 * Game 2: Quick-Fire Bubble Math
 * Ported & enhanced from Ayan Capstone. Evaluates quantitative speed & ordering precision.
 */
export const BubbleMathGame = ({
  config = {},
  stageNumber = 1,
  mode = 'ranked',
  onRawEvent,
  onComplete,
}) => {
  const totalQuestions = config.totalQuestions || 10
  const secondsPerQuestion = config.secondsPerQuestion || 15

  const [qIndex, setQIndex] = useState(1)
  const [correctCount, setCorrectCount] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [bubbles, setBubbles] = useState(() => generateProblemSet(1, totalQuestions))
  const [clickedIds, setClickedIds] = useState([])
  const [timeLeft, setTimeLeft] = useState(secondsPerQuestion)
  const [status, setStatus] = useState('playing') // 'playing' | 'finished'
  const [flashFeedback, setFlashFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0)

  const statsRef = useRef({
    correctCount: 0,
    mistakes: 0,
    totalElapsedSeconds: 0,
    timeLeft: secondsPerQuestion,
  })
  useEffect(() => {
    statsRef.current = { correctCount, mistakes, totalElapsedSeconds, timeLeft }
  }, [correctCount, mistakes, totalElapsedSeconds, timeLeft])

  const advanceQuestion = useCallback(
    (wasCorrect, currentQIndex) => {
      const nextCorrect = wasCorrect ? statsRef.current.correctCount + 1 : statsRef.current.correctCount
      const nextMistakes = wasCorrect ? statsRef.current.mistakes : statsRef.current.mistakes + 1

      if (wasCorrect) setCorrectCount(nextCorrect)
      else setMistakes(nextMistakes)

      if (currentQIndex >= totalQuestions) {
        setStatus('finished')
        return
      }

      const nextQ = currentQIndex + 1
      setQIndex(nextQ)
      setBubbles(generateProblemSet(nextQ, totalQuestions))
      setClickedIds([])
      setTimeLeft(secondsPerQuestion)
      setFlashFeedback(null)
    },
    [secondsPerQuestion, totalQuestions]
  )

  useEffect(() => {
    if (status !== 'playing' || flashFeedback !== null) return

    const interval = setInterval(() => {
      setTotalElapsedSeconds((t) => t + 1)
      const nextTime = statsRef.current.timeLeft - 1
      if (nextTime <= 0) {
        clearInterval(interval)
        setTimeLeft(0)
        onRawEvent?.({
          stageNumber,
          gameType: 'bubble-math',
          action: 'QUESTION_TIMEOUT',
          payload: { qIndex },
        })
        setFlashFeedback('wrong')
        setTimeout(() => advanceQuestion(false, qIndex), 280)
      } else {
        setTimeLeft(nextTime)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [status, flashFeedback, qIndex, advanceQuestion, onRawEvent, stageNumber])

  const handleBubbleClick = (bubble) => {
    if (status !== 'playing' || clickedIds.includes(bubble.id) || clickedIds.length >= 3) return

    const nextClicked = [...clickedIds, bubble.id]
    setClickedIds(nextClicked)

    onRawEvent?.({
      stageNumber,
      gameType: 'bubble-math',
      action: 'BUBBLE_CLICK',
      payload: {
        qIndex,
        expr: bubble.expr,
        value: bubble.val,
        clickOrder: nextClicked.length,
        expectedOrder: bubble.correctIdx + 1,
      },
    })

    if (nextClicked.length === 3) {
      const isOrderCorrect = nextClicked.every((id, idx) => {
        const found = bubbles.find((x) => x.id === id)
        return found && found.correctIdx === idx
      })
      setFlashFeedback(isOrderCorrect ? 'correct' : 'wrong')
      setTimeout(() => advanceQuestion(isOrderCorrect, qIndex), 320)
    }
  }

  const handleRestart = () => {
    setQIndex(1)
    setCorrectCount(0)
    setMistakes(0)
    setTotalElapsedSeconds(0)
    setBubbles(generateProblemSet(1, totalQuestions))
    setClickedIds([])
    setTimeLeft(secondsPerQuestion)
    setFlashFeedback(null)
    setStatus('playing')
  }

  const handleCompleteStage = () => {
    const accuracy = Math.round((correctCount / totalQuestions) * 100)
    const maxTotalSeconds = totalQuestions * secondsPerQuestion
    const speedScore = computeSpeedScore(totalElapsedSeconds, maxTotalSeconds)
    const efficiencyScore = clamp(100 - mistakes * 7, 25, 100)

    onComplete?.(
      buildGameOutcome({
        gameType: 'bubble-math',
        stageNumber,
        accuracy,
        speedScore,
        efficiencyScore,
        mistakes,
        timeUsedSeconds: totalElapsedSeconds,
        timeLimitSeconds: maxTotalSeconds,
        completed: true,
        summary: `Solved ${correctCount}/${totalQuestions} expression sequences (${accuracy}% accuracy)`,
        details: { correctCount, totalQuestions, mistakes },
      })
    )
  }

  if (status === 'finished') {
    const accuracy = Math.round((correctCount / totalQuestions) * 100)
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-xl mx-auto text-center shadow-sm space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center border border-indigo-100">
          <Zap className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Bubble Math Sprint Complete</h3>
          <p className="text-xs text-slate-500 mt-1">
            Evaluated {totalQuestions} rapid numerical ordering sets in {totalElapsedSeconds}s
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-2xl font-extrabold text-indigo-600 font-mono">
              {correctCount}/{totalQuestions}
            </div>
            <div className="text-[11px] font-medium text-slate-500">Correct Sets</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">{accuracy}%</div>
            <div className="text-[11px] font-medium text-slate-500">Accuracy</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-2xl font-extrabold text-amber-600 font-mono">{mistakes}</div>
            <div className="text-[11px] font-medium text-slate-500">Mistakes</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          {mode === 'practice' && (
            <button
              type="button"
              onClick={handleRestart}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleCompleteStage}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <span>{mode === 'practice' ? 'Record Score' : 'Save & Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-3">
      {/* Top Status Strip */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="text-xs text-slate-600">
          Select bubbles strictly from <strong className="text-indigo-700">Lowest</strong> to{' '}
          <strong className="text-indigo-700">Highest</strong> value
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono">
            Q {qIndex} / {totalQuestions}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono border border-emerald-200">
            Score: {correctCount}
          </span>
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono text-xs font-bold ${
              timeLeft <= 5
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-cyan-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Interactive Bubble Arena */}
      <div className="bg-white rounded-2xl w-full h-[440px] relative shadow-sm border border-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-70 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-70 pointer-events-none" />
        </div>

        {/* Step Order Breadcrumb */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center border transition ${
                clickedIds.length >= step
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-white/90 border-slate-300 text-slate-400'
              }`}
            >
              {step}
            </span>
          ))}
        </div>

        {/* Instant Feedback Pill */}
        {flashFeedback && (
          <div
            className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm border ${
              flashFeedback === 'correct'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-rose-50 border-rose-300 text-rose-700'
            }`}
          >
            {flashFeedback === 'correct' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Correct Order!</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>Incorrect Sequence</span>
              </>
            )}
          </div>
        )}

        {/* Bubbles */}
        {bubbles.map((b) => {
          const isClicked = clickedIds.includes(b.id)
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => handleBubbleClick(b)}
              disabled={isClicked || clickedIds.length === 3}
              className={`absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold transition-all duration-200 z-10 cursor-pointer ${
                isClicked
                  ? 'opacity-0 scale-50 pointer-events-none'
                  : 'opacity-100 scale-100 bg-white/95 text-slate-900 border-2 border-slate-200 hover:border-indigo-400 hover:text-indigo-700 shadow-lg hover:shadow-xl active:scale-95'
              }`}
              style={{
                top: b.pos.top,
                left: b.pos.left,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {b.expr}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BubbleMathGame
