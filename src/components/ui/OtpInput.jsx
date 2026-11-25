import { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function OtpInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  error = false,
  disabled = false,
  autoFocus = true,
  className = '',
}) {
  const inputRefs = useRef([]);

  // Derive individual digits from value prop
  const digits = Array.from({ length }).map((_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const updateOtpValue = (newDigits) => {
    const combined = newDigits.join('');
    if (onChange) onChange(combined);
    if (newDigits.every((d) => d !== '') && onComplete) {
      onComplete(combined);
    }
  };

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, ''); // Numeric only
    if (!val) return;

    const char = val.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    updateOtpValue(newDigits);

    if (index < length - 1 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      const newDigits = [...digits];
      newDigits[index] = '';
      updateOtpValue(newDigits);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    updateOtpValue(newDigits);

    const targetIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[targetIndex]?.focus();
  };

  return (
    <div className={cn('flex items-center justify-between gap-2 sm:gap-3', className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index]}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of verification code`}
          className={cn(
            'w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-lg transition-all duration-150',
            'bg-slate-900/90 text-slate-100 border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950',
            error
              ? 'border-rose-500/80 text-rose-300 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30',
            digits[index] && !error && 'border-indigo-500/60 bg-indigo-950/20 text-indigo-300',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-950'
          )}
        />
      ))}
    </div>
  );
}
