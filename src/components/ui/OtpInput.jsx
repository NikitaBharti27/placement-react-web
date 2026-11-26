import { useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'

/**
 * Segmented 6-digit OTP input boxes with positional editing preservation,
 * auto-advance, backspace navigation, paste handler, and light/dark themes.
 */
export function OtpInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  error = false,
  disabled = false,
  autoFocus = true,
  variant = 'light',
  className = '',
}) {
  const inputRefs = useRef([])

  // Preserve positional slots using space padding so clearing a middle digit
  // does not shift subsequent digits leftward.
  const digits = Array.from({ length }, (_, i) => {
    const ch = value[i]
    return ch && /\d/.test(ch) ? ch : ''
  })

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus, disabled])

  const emitOtpValue = (newDigits) => {
    const serialized = newDigits.map((d) => (d ? d : ' ')).join('').trimEnd()
    if (onChange) onChange(serialized)
    if (newDigits.every((d) => /^\d$/.test(d)) && onComplete) {
      onComplete(newDigits.join(''))
    }
  }

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) return

    // Handle multi-char input (e.g. mobile SMS autofill)
    if (val.length > 1) {
      const next = [...digits]
      for (let i = 0; i < val.length && index + i < length; i++) {
        next[index + i] = val[i]
      }
      emitOtpValue(next)
      const nextFocus = Math.min(index + val.length, length - 1)
      inputRefs.current[nextFocus]?.focus()
      return
    }

    const newDigits = [...digits]
    newDigits[index] = val
    emitOtpValue(newDigits)

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newDigits = [...digits]
      if (newDigits[index]) {
        newDigits[index] = ''
        emitOtpValue(newDigits)
      } else if (index > 0) {
        newDigits[index - 1] = ''
        emitOtpValue(newDigits)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pastedData) return

    const newDigits = Array.from({ length }, (_, i) => pastedData[i] || '')
    emitOtpValue(newDigits)

    const targetIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[targetIndex]?.focus()
  }

  const isDark = variant === 'dark'

  return (
    <div className={cn('flex items-center justify-center gap-2 sm:gap-2.5', className)}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          pattern="[0-9]*"
          maxLength={length}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of passkey`}
          className={cn(
            'w-10 h-12 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-bold font-mono rounded-xl transition-all duration-150',
            'border focus:outline-none focus:ring-2',
            isDark
              ? 'bg-slate-800/90 text-white focus:ring-indigo-500/40 focus:border-indigo-400'
              : 'bg-slate-50 text-slate-900 focus:ring-indigo-500/20 focus:border-indigo-600',
            error
              ? isDark
                ? 'border-rose-500 text-rose-200 bg-rose-950/50'
                : 'border-rose-400 text-rose-700 bg-rose-50'
              : isDark
              ? 'border-slate-700 hover:border-slate-500'
              : 'border-slate-300 hover:border-slate-400',
            digit &&
              !error &&
              (isDark
                ? 'border-indigo-500 bg-indigo-950/60 text-indigo-200'
                : 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-extrabold shadow-xs'),
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      ))}
    </div>
  )
}

export default OtpInput
