import { cn } from '../../utils/cn';

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  const variantStyles = {
    primary: 'bg-indigo-950/70 text-indigo-300 border border-indigo-700/40',
    secondary: 'bg-purple-950/70 text-purple-300 border border-purple-700/40',
    success: 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/40',
    warning: 'bg-amber-950/70 text-amber-300 border border-amber-700/40',
    danger: 'bg-rose-950/70 text-rose-300 border border-rose-700/40',
    info: 'bg-sky-950/70 text-sky-300 border border-sky-700/40',
    neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    outline: 'bg-transparent text-slate-400 border border-slate-700',
  };

  const dotColors = {
    primary: 'bg-indigo-400',
    secondary: 'bg-purple-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    info: 'bg-sky-400',
    neutral: 'bg-slate-400',
    outline: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full select-none tracking-wide transition-colors',
        sizeStyles[size] || sizeStyles.md,
        variantStyles[variant] || variantStyles.primary,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColors[variant] || 'bg-indigo-400'
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              dotColors[variant] || 'bg-indigo-400'
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
