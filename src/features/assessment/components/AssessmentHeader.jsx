import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { cn } from '../../../utils/cn';
import {
  ArrowLeft,
  Clock,
  LayoutGrid,
  Send,
  ShieldCheck,
  Server,
} from 'lucide-react';

function formatCountdown(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  const pad = (v) => String(v).padStart(2, '0');
  return hours > 0
    ? `${pad(hours)}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
}

/**
 * AssessmentHeader - Distraction-free exam top bar with progress,
 * server-authoritative timer display slot, navigator trigger, and final submit action.
 */
export function AssessmentHeader({
  title,
  companyTrack,
  answeredCount,
  totalQuestions,
  remainingSeconds,
  timerSlot,
  isNavigatorOpen,
  onToggleNavigator,
  onOpenSubmitModal,
  onExitAssessment,
}) {
  const isWarningTime = remainingSeconds > 60 && remainingSeconds <= 300;
  const isCriticalTime = remainingSeconds <= 60;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-3">
        {/* Left: Exit + Assessment Identity */}
        <div className="flex items-center gap-3 min-w-0">
          {onExitAssessment && (
            <button
              type="button"
              onClick={onExitAssessment}
              title="Exit assessment preview"
              aria-label="Exit assessment preview"
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shrink-0 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full rounded-[10px] bg-slate-950/90 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white truncate">
                {title}
              </h1>
              {companyTrack && (
                <Badge variant="primary" size="sm" className="hidden xl:inline-flex shrink-0">
                  {companyTrack}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Server className="w-3 h-3 text-cyan-400" />
                <span>Sandboxed Assessment Mode</span>
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline font-mono text-slate-400">
                {answeredCount}/{totalQuestions} Completed
              </span>
            </div>
          </div>
        </div>

        {/* Center: Progress indicator (desktop) */}
        <div className="hidden lg:flex flex-col w-56 xl:w-72 shrink-0">
          <ProgressBar
            value={answeredCount}
            max={totalQuestions}
            size="sm"
            label={`Progress (${answeredCount} of ${totalQuestions} answered)`}
            showPercentage
          />
        </div>

        {/* Right: Timer Slot + Question Palette Toggle + Final Submit */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {timerSlot ? (
            timerSlot
          ) : (
            <div
              title="Server-Authoritative Timer (synced via backend deadline)"
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-semibold transition-colors',
                isCriticalTime
                  ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 animate-pulse'
                  : isWarningTime
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-100'
              )}
            >
              <Clock
                className={cn(
                  'w-3.5 h-3.5 shrink-0',
                  isCriticalTime
                    ? 'text-rose-400'
                    : isWarningTime
                      ? 'text-amber-400'
                      : 'text-cyan-400'
                )}
              />
              <span>{formatCountdown(remainingSeconds)}</span>
              <span className="hidden xl:inline text-[10px] uppercase tracking-wider text-slate-400 font-sans border-l border-slate-700 pl-2">
                Server Sync
              </span>
            </div>
          )}

          <Button
            variant={isNavigatorOpen ? 'secondary' : 'outline'}
            size="sm"
            onClick={onToggleNavigator}
            leftIcon={<LayoutGrid className="w-3.5 h-3.5" />}
            aria-expanded={isNavigatorOpen}
            aria-label="Toggle question navigator"
          >
            <span className="hidden sm:inline">Questions</span>
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-200">
              {totalQuestions}
            </span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenSubmitModal}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Submit Exam</span>
            <span className="sm:hidden">Submit</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
