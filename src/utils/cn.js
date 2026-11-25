import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility to merge Tailwind CSS classes safely with clsx and twMerge.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default cn
