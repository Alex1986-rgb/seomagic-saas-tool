import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format any error into a readable string
 */
export function formatError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    if ('message' in error) return String(error.message);
    if ('error' in error) return String(error.error);
  }
  return 'An unknown error occurred';
}

/**
 * Creates a promise that rejects after a specified timeout
 */
export function createTimeout(ms: number, message = 'Operation timed out'): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

/**
 * Execute a promise with a timeout
 */
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message?: string): Promise<T> {
  return Promise.race([
    promise,
    createTimeout(timeoutMs, message)
  ]);
}
