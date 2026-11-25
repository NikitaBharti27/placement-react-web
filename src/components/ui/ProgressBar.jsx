import { cn } from '../../utils/cn'

/**
 * ProgressBar - Accessible linear completion indicator.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  variant = 'indigo',
  size = 'md',
  label,
  showPercentage = false,
  className = '',
}) {
  const safeMax = max > 0 ? max : 100
  const clamped = Math.min(Math.max(value, 0), safeMax)
  const percentage = Math.round((clamped / safeMax) * 100)

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  }

  const fillVariants = {
    indigo: 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    cyan: 'bg-cyan-500',
  }

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>{label}</span>
          {showPercentage && <span className="font-mono text-white">{percentage}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label || 'Assessment completion progress'}
        className={cn(
          'w-full rounded-full bg-slate-800 overflow-hidden border border-slate-700',
          heightClasses[size] || heightClasses.md
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            fillVariants[variant] || fillVariants.indigo
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
