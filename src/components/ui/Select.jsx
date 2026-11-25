import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, AlertCircle } from 'lucide-react';

export const Select = forwardRef(function Select(
  {
    label,
    options = [],
    helperText,
    error,
    placeholder = 'Select an option...',
    id,
    className = '',
    containerClassName = '',
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5 text-left', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-slate-300 tracking-wide"
        >
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-help` : undefined}
          className={cn(
            'w-full appearance-none rounded-lg bg-slate-900/90 border text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-150 py-2.5 pl-3.5 pr-10',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950 cursor-pointer',
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-950',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-slate-900 text-slate-500">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value} className="bg-slate-900 text-slate-100 py-1">
                {labelText}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
          {error ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-help`} className="text-xs text-slate-400 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
