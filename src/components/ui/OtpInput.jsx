import { useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'

/**
 * Segmented 6-digit OTP input boxes with auto-advance, backspace navigation,
 * and paste handler.
 */
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
  const inputRefs = useRef([])

  // Derive individual digits from value prop
  const digits = Array.from({ length }).map((_, i) => value[i] || '')

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus, disabled])

  const updateOtpValue = (newDigits) => {
    const combined = newDigits.join('')
    if (onChange) onChange(combined)
    if (newDigits.every((d) => d !== '') && onComplete) {
      onComplete(combined)
    }
  }

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '') // Numeric only
    if (!val) return

    const char = val.slice(-1)
    const newDigits = [...digits]
    newDigits[index] = char
    updateOtpValue(newDigits)

    if (index < length - 1 && char) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      const newDigits = [...digits]
      newDigits[index] = ''
      updateOtpValue(newDigits)
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pastedData) return

    const newDigits = [...digits]
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i]
    }
    updateOtpValue(newDigits)

    const targetIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[targetIndex]?.focus()
  }

  return (
    <div className={cn('flex items-center justify-center gap-2 sm:gap-3', className)}>
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
          aria-label={`Digit ${index + 1} of passkey`}
          className={cn(
            'w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-xl transition-all duration-150',
            'bg-slate-50 text-slate-900 border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600',
            error
              ? 'border-rose-400 text-rose-700 bg-rose-50'
              : 'border-slate-300 hover:border-slate-400',
            digits[index] && !error && 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-extrabold shadow-xs',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-100'
          )}
        />
      ))}
    </div>
  )
}

export default OtpInput
