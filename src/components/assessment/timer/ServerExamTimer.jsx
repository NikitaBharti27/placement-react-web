import { useEffect, useRef } from 'react'
import { Clock, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react'
import { useExamTimer } from '../../../features/exam/examHooks'

/**
 * Server-Authoritative Exam Timer
 * Syncs drift offset against the backend clock and triggers an exact single
 * expiration callback via useEffect (never inside render).
 */
export const ServerExamTimer = ({ assessmentId, onTimeExpired }) => {
  const {
    formattedTime,
    isTimeUp,
    isWarning,
    isCritical,
    isSynced,
    serverTimeOffset,
    lastSyncTime,
    syncNow,
  } = useExamTimer(assessmentId)

  const hasExpiredRef = useRef(false)

  useEffect(() => {
    hasExpiredRef.current = false
  }, [assessmentId])

  useEffect(() => {
    if (isTimeUp && !hasExpiredRef.current) {
      hasExpiredRef.current = true
      if (onTimeExpired) {
        onTimeExpired()
      }
    }
  }, [isTimeUp, onTimeExpired])

  let timerClasses = 'bg-slate-900 text-cyan-400 border-slate-700'
  let iconClass = 'text-cyan-400'

  if (isTimeUp) {
    timerClasses = 'bg-rose-950 text-rose-300 border-rose-500'
    iconClass = 'text-rose-400'
  } else if (isCritical) {
    timerClasses = 'bg-red-950/90 text-red-300 border-red-500 animate-pulse ring-2 ring-red-500/50'
    iconClass = 'text-red-400'
  } else if (isWarning) {
    timerClasses = 'bg-amber-950/80 text-amber-300 border-amber-500'
    iconClass = 'text-amber-400'
  }

  const syncTitle = lastSyncTime
    ? `Server Clock Synced • Drift Offset: ${serverTimeOffset}ms • Last Sync: ${new Date(lastSyncTime).toLocaleTimeString()}`
    : 'Syncing with authoritative server clock...'

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold shadow-inner tracking-wider transition-colors duration-300 ${timerClasses}`}
        title={syncTitle}
      >
        {isCritical || isTimeUp ? (
          <ShieldAlert className={`w-4 h-4 ${iconClass} ${isCritical ? 'animate-bounce' : ''}`} />
        ) : (
          <Clock className={`w-4 h-4 ${iconClass}`} />
        )}
        <span>{formattedTime}</span>

        <span
          className={`w-2 h-2 rounded-full ${
            isSynced ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 animate-ping'
          }`}
          title={syncTitle}
        />
      </div>

      <button
        type="button"
        onClick={syncNow}
        disabled={isTimeUp}
        title={syncTitle}
        className="hidden sm:inline-flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-200 font-sans transition cursor-pointer disabled:opacity-50"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>Server Synced</span>
        <RefreshCw className="w-3 h-3 text-slate-500 hover:text-cyan-400" />
      </button>
    </div>
  )
}

export default ServerExamTimer
