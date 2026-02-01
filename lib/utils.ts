import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number consistently to avoid hydration mismatch
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num)
}
