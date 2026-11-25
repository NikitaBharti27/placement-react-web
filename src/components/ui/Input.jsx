import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle } from 'lucide-react';

export const Input = forwardRef(function Input(
  {
    label,
    helperText,
    error,
    leftIcon = null,
    rightIcon = null,
    id,
    className = '',
    containerClassName = '',
    disabled = false,
    required = false,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5 text-left', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-300 tracking-wide"
        >
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
          className={cn(
            'w-full rounded-lg bg-slate-900/90 border text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-150 py-2.5 px-3.5',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-950',
            className
          )}
          {...props}
        />

        {rightIcon && !error && (
          <div className="absolute right-3.5 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}

        {error && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-rose-400">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-help`} className="text-xs text-slate-400 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
