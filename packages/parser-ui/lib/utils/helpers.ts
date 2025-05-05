import { isOdd } from "core-saral";

/**
 * Check if a number is even
 * @param n The number to check
 * @returns True if the number is even, false otherwise
 */
export function isEven(n: number): boolean {
  return !isOdd(n);
}

/**
 * Format a percentage value (ensure it's between 0-100)
 * @param value The value to format
 * @returns A number between 0 and 100
 */
export function formatPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Truncate text to a specific length with ellipsis
 * @param text The text to truncate
 * @param maxLength The maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}