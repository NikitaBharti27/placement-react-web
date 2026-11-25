import { Clock, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { useExamTimer } from '../../../features/exam/examHooks'

/**
 * Server-Authoritative Exam Timer
 * Conforms to Capstone Requirement:
 * "Server-Authoritative Timers: Real-time exam timers synced with the server backend.
 * (Students cannot manipulate the browser clock to get extra time)."
 */
export const ServerExamTimer = ({ assessmentId, onTimeExpired }) => {
  const { formattedTime, isTimeUp, isWarning, isCritical, isSynced } =
    useExamTimer(assessmentId)

  if (isTimeUp && onTimeExpired) {
    onTimeExpired()
  }

  // Determine dynamic badge colors based on authoritative countdown
  let timerClasses = 'bg-slate-900 text-cyan-400 border-slate-700'
  let iconClass = 'text-cyan-400'

  if (isCritical) {
    timerClasses = 'bg-red-950/90 text-red-300 border-red-500 animate-pulse ring-2 ring-red-500/50'
    iconClass = 'text-red-400'
  } else if (isWarning) {
    timerClasses = 'bg-amber-950/80 text-amber-300 border-amber-500'
    iconClass = 'text-amber-400'
  }

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold shadow-inner tracking-wider transition-colors duration-300 ${timerClasses}`}
        title="Authoritative server clock synced with backend"
      >
        {isCritical ? (
          <ShieldAlert className={`w-4 h-4 ${iconClass} animate-bounce`} />
        ) : (
          <Clock className={`w-4 h-4 ${iconClass}`} />
        )}
        <span>{formattedTime}</span>

        {/* Server Sync Status Pip */}
        <span
          className={`w-2 h-2 rounded-full ${
            isSynced ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 animate-ping'
          }`}
          title={isSynced ? 'Server Clock Synced (Anti-Tamper Active)' : 'Syncing with Server...'}
        />
      </div>

      <div className="hidden sm:flex items-center space-x-1 text-[11px] text-slate-500 font-sans">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>Server Synced</span>
      </div>
    </div>
  )
}

export default ServerExamTimer
