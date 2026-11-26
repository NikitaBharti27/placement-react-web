import { useState } from 'react'
import {
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Award,
  AlertTriangle,
  Database,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react'
import Modal from '../ui/Modal'

/**
 * Authoritative Gamified Scorecard & Anti-Tamper Verification Receipt.
 * Displays server-recalculated results against company placement criteria,
 * raw click event telemetry audit, and an interactive tamper-check simulator.
 */
export const GamifiedScorecardModal = ({
  isOpen,
  verificationResult,
  rawEvents = [],
  proctoringAlerts = [],
  isSubmitting = false,
  onSimulateTamperCheck,
  onClose,
  onRetry,
}) => {
  const [showRawEvents, setShowRawEvents] = useState(false)

  if (!isOpen || !verificationResult) return null

  const {
    verificationId,
    scoreIntegrity,
    integrityMessage,
    authoritativeScorecard,
    pipeline,
  } = verificationResult

  const isTampered = scoreIntegrity === 'TAMPER_DETECTED'
  const qualified = authoritativeScorecard?.qualified

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${authoritativeScorecard?.companyName || 'Company'} Cognitive Assessment Receipt`}
      description={`Verification ID: ${verificationId} • ${pipeline}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
        {/* Integrity Banner */}
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
            isTampered
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-start gap-2.5 text-xs">
            {isTampered ? (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block">
                {isTampered
                  ? 'Anti-Tamper Alert: Claimed Score Rejected by Server'
                  : 'Fair Play Verified (Raw Events Match Authoritative Score)'}
              </span>
              <span className="text-[11px] opacity-90">{integrityMessage}</span>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
              isTampered ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {scoreIntegrity}
          </span>
        </div>

        {/* Overall Composite Score vs Cutoff */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Authoritative Score
            </span>
            <div className="text-3xl font-extrabold font-mono mt-1">
              {authoritativeScorecard?.finalScore ?? 0}%
            </div>
            <span className="text-[11px] text-cyan-300 mt-1">
              Cutoff Target: {authoritativeScorecard?.passingCutoff}%
            </span>
          </div>

          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              qualified
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
              Criteria Verdict
            </span>
            <div className="text-sm font-bold flex items-center gap-1.5 mt-1">
              {qualified ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{authoritativeScorecard?.tierVerdict}</span>
            </div>
            <span className="text-[11px] opacity-80 mt-1">
              Penalty Applied: -{authoritativeScorecard?.metrics?.penaltyDeduction || 0} pts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Proctoring &amp; Telemetry
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {rawEvents.length} Raw Events
            </div>
            <span
              className={`text-[11px] font-medium mt-1 ${
                proctoringAlerts.length > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {proctoringAlerts.length} Advisory Alerts
            </span>
          </div>
        </div>

        {/* Component Metrics */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
            <div className="font-mono font-bold text-indigo-700 text-base">
              {authoritativeScorecard?.metrics?.accuracy ?? 0}%
            </div>
            <div className="text-[11px] text-indigo-800">Accuracy</div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-100">
            <div className="font-mono font-bold text-cyan-700 text-base">
              {authoritativeScorecard?.metrics?.speedScore ?? 0}%
            </div>
            <div className="text-[11px] text-cyan-800">Speed</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="font-mono font-bold text-emerald-700 text-base">
              {authoritativeScorecard?.metrics?.efficiencyScore ?? 0}%
            </div>
            <div className="text-[11px] text-emerald-800">Efficiency</div>
          </div>
        </div>

        {/* Stage Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Stage-by-Stage Criteria Breakdown
          </h4>
          <div className="space-y-2">
            {authoritativeScorecard?.breakdown?.map((item) => (
              <div
                key={item.stageNumber}
                className="p-3 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    Stage {item.stageNumber}: {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.topicTag} · Weight {item.weight}%
                    {item.summary ? ` · ${item.summary}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    {item.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Cognitive Topic Tags */}
        {authoritativeScorecard?.weakTopics?.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>AI Remediation Flagged Sub-Topics: </strong>
              <span>{authoritativeScorecard.weakTopics.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Raw Event Telemetry & Tamper Test Drawer */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-3.5 py-2.5 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowRawEvents((prev) => !prev)}
              className="font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>Inspect Raw Click Telemetry ({rawEvents.length} events)</span>
              {showRawEvents ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {onSimulateTamperCheck && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onSimulateTamperCheck}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold cursor-pointer"
                title="Simulates sending a tampered payload { claimedScore: 100 } to verify backend rejection"
              >
                Test Anti-Tamper (Send score: 100)
              </button>
            )}
          </div>

          {showRawEvents && (
            <div className="bg-slate-950 text-slate-300 p-3 font-mono text-[11px] max-h-40 overflow-y-auto space-y-1">
              {rawEvents.length === 0 ? (
                <div className="text-slate-500">No raw click events recorded.</div>
              ) : (
                rawEvents.slice(-12).map((evt) => (
                  <div key={evt.id} className="truncate">
                    <span className="text-cyan-400">+{evt.elapsedMs}ms</span>{' '}
                    <span className="text-indigo-400">[{evt.gameType}]</span> {evt.action}{' '}
                    <span className="text-slate-500">{JSON.stringify(evt.payload)}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Round</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Back to Company Hub
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default GamifiedScorecardModal
