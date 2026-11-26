import { useState, useRef } from 'react'
import { Gamepad2, ShieldCheck, CheckCircle2, AlertTriangle, Activity } from 'lucide-react'
import SplitPane from '../../ui/SplitPane'
import GamifiedGameHost from '../../gamified/games/GamifiedGameHost'
import { getGameMeta } from '../../../config/companyGamifiedCriteria'

/**
 * Embedded Gamified Cognitive Workspace for AssessmentPlayerPage.
 * Renders when currentQuestion.type === 'GAMIFIED' inside the distraction-free exam player,
 * recording raw interaction events and verified outcomes directly into examSlice.
 */
export const GamifiedWorkspace = ({
  question,
  answer,
  onAnswerChange,
}) => {
  const [eventCount, setEventCount] = useState(() => answer?.rawEvents?.length || 0)
  const eventsRef = useRef(answer?.rawEvents || [])
  const gameMeta = getGameMeta(question.gameType)
  const outcome = answer?.outcome || null
  const isCompleted = Boolean(answer?.completed)

  const handleRawEvent = (event) => {
    const stampedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      elapsedMs: Date.now(),
    }
    const next = [...eventsRef.current.slice(-199), stampedEvent]
    eventsRef.current = next
    setEventCount(next.length)
    onAnswerChange({
      gameType: question.gameType,
      rawEvents: next,
    })
  }

  const handleComplete = (gameOutcome) => {
    onAnswerChange({
      gameType: question.gameType,
      rawEvents: eventsRef.current,
      outcome: gameOutcome,
      completed: true,
    })
  }

  const leftContent = (
    <div className="h-full overflow-y-auto p-4 sm:p-5 border-r border-slate-200 bg-white space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-semibold rounded-lg text-xs inline-flex items-center gap-1">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Gamified Cognitive</span>
          </span>
          <span className="text-xs font-mono text-slate-500">{question.topic || gameMeta.topicTag}</span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
            Marks: {question.marks || 25}
          </span>
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
            {question.difficulty || 'Adaptive'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 leading-snug">{question.title}</h2>
        <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
          {question.prompt || gameMeta.description}
        </div>
      </div>

      {/* Placement Criteria Box */}
      {question.criteria && (
        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1.5">
          <div className="font-bold text-indigo-800">Company Placement Criteria</div>
          <div>• Track Cutoff: <strong>{question.criteria.passingCutoff}%</strong></div>
          <div>• Weighting: {question.criteria.scoringSummary}</div>
          <div>• Penalty: {question.criteria.penaltyLabel}</div>
        </div>
      )}

      {/* Anti-Tamper Telemetry Status */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
        <div className="flex items-center justify-between font-semibold text-slate-800">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Anti-Tamper Telemetry</span>
          </span>
          <span className="font-mono text-indigo-700 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            {eventCount} events
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          All clicks, rotations, and spatial selections are logged with timestamps and verified
          server-side upon exam submission.
        </p>
      </div>

      {isCompleted && outcome ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cognitive Stage Recorded ({outcome.score}%)</span>
          </div>
          <p className="text-[11px]">{outcome.summary}</p>
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
            <div className="bg-white rounded-lg p-1.5 border border-emerald-200">
              <div className="font-bold text-emerald-700">{outcome.accuracy}%</div>
              <div className="text-[10px] text-slate-500">Accuracy</div>
            </div>
            <div className="bg-white rounded-lg p-1.5 border border-emerald-200">
              <div className="font-bold text-cyan-700">{outcome.speedScore}%</div>
              <div className="text-[10px] text-slate-500">Speed</div>
            </div>
            <div className="bg-white rounded-lg p-1.5 border border-emerald-200">
              <div className="font-bold text-indigo-700">{outcome.efficiencyScore}%</div>
              <div className="text-[10px] text-slate-500">Efficiency</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Complete the cognitive game on the right and click <strong>Save &amp; Continue</strong>{' '}
            to record your score in the assessment palette.
          </span>
        </div>
      )}
    </div>
  )

  const rightContent = (
    <div className="h-full overflow-y-auto p-4 sm:p-6 bg-slate-950 flex items-center justify-center">
      <GamifiedGameHost
        gameType={question.gameType}
        config={question.gameConfig || {}}
        stageNumber={question.number || 1}
        mode="embedded"
        onRawEvent={handleRawEvent}
        onComplete={handleComplete}
      />
    </div>
  )

  return (
    <SplitPane
      left={leftContent}
      right={rightContent}
      leftLabel="Criteria & Rules"
      rightLabel="Cognitive Game Arena"
      defaultLeftPercent={34}
    />
  )
}

export default GamifiedWorkspace
