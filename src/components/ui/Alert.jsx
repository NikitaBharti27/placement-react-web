import { cn } from '../../utils/cn'
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react'

export function Alert({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
  ...props
}) {
  const iconMap = {
    info: <Info className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    neutral: <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />,
  }

  const variantStyles = {
    info: 'bg-cyan-50 border-cyan-200 text-cyan-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    neutral: 'bg-slate-50 border-slate-200 text-slate-800',
  }

  return (
    <div
      role="alert"
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border text-sm transition-all',
        variantStyles[variant] || variantStyles.info,
        className
      )}
      {...props}
    >
      {iconMap[variant] || iconMap.info}
      <div className="flex-1 space-y-1 text-left">
        {title && <h5 className="font-semibold text-slate-900 tracking-tight">{title}</h5>}
        <div className="text-xs leading-relaxed text-slate-700">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 -mt-1 rounded-md cursor-pointer"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Alert
