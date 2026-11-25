import { cn } from '../../utils/cn';

export function Card({ children, className = '', glow = false, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 shadow-xl backdrop-blur-md overflow-hidden transition-all',
        glow && 'shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)] border-indigo-500/30',
        hover && 'hover:border-slate-700 hover:shadow-2xl hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={cn('p-6 pb-4 flex flex-col space-y-1.5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3
      className={cn('text-xl font-semibold tracking-tight text-slate-50', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={cn('text-sm text-slate-400 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn('p-6 pt-2', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={cn('p-6 pt-2 flex items-center justify-between border-t border-slate-800/80 mt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}
