import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"


export const toGwei = (wei: bigint): number => {
    return Number(wei) / 10 ** 9;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const roundTo = (num: number, decimals: number = 2): number => {
    return Math.round(num * 10 ** decimals) / 10 ** decimals;
}

export const toFixedNumber = (num: number): string => {
    const decimals = (num < 1) ? 2 : 1
    return num.toFixed(decimals)
}
