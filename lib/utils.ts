import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Convert prisma object into a regular JS object 

export const convertToPlainObject = <T>(value: T):T => {
  return JSON.parse(JSON.stringify(value))
}

// Format number with decimal places

export const formatNumberWithDecimals = (num: number): string => {
  const [intVal, floatVal] = num.toFixed(2).split('.')

  return floatVal ? `${intVal}.${floatVal.padEnd(2,'0')}`: `${intVal}.00`
}