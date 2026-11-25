import { cn } from '../../utils/cn'

export function Card({ children, className = '', glow = false, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-xs transition-all',
        glow && 'border-indigo-400/40 shadow-md shadow-indigo-100',
        hover && 'hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={cn('p-5 pb-3 flex flex-col space-y-1.5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3
      className={cn('text-lg font-bold tracking-tight text-slate-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={cn('text-xs text-slate-500 leading-relaxed', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn('p-5 pt-2', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={cn('p-5 pt-2 flex items-center justify-between border-t border-slate-100 mt-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
