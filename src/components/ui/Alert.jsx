import { cn } from '../../utils/cn';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export function Alert({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
  ...props
}) {
  const iconMap = {
    info: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    neutral: <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />,
  };

  const variantStyles = {
    info: 'bg-sky-950/40 border-sky-800/50 text-sky-200',
    success: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200',
    warning: 'bg-amber-950/40 border-amber-800/50 text-amber-200',
    error: 'bg-rose-950/40 border-rose-800/50 text-rose-200',
    neutral: 'bg-slate-900/60 border-slate-800 text-slate-200',
  };

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
        {title && <h5 className="font-semibold text-slate-100 tracking-tight">{title}</h5>}
        <div className="text-xs leading-relaxed text-slate-300">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-md"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
