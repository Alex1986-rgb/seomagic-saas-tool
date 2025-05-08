
import { toast } from "@/hooks/use-toast";
import { ApiErrorResponse } from "@/api/client/errorHandler";

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
 * Format API error with details
 */
export function formatApiError(error: unknown): string {
  if (!error) return 'Unknown API error';
  
  // If it's already an ApiErrorResponse
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return formatError(error);
}

/**
 * Handle errors with consistent UI feedback
 */
export function handleError(error: unknown, options?: {
  silent?: boolean;
  toastTitle?: string;
  toastDescription?: string;
  consoleLog?: boolean;
}): string {
  const errorMessage = formatError(error);
  
  if (options?.consoleLog !== false) {
    console.error('Error:', error);
  }
  
  if (!options?.silent) {
    toast({
      title: options?.toastTitle || 'Ошибка',
      description: options?.toastDescription || errorMessage,
      variant: 'destructive'
    });
  }
  
  return errorMessage;
}

/**
 * Recovery mechanism for failed operations
 * @param operation The async operation to perform
 * @param retryCount Number of retries before giving up
 * @param delayMs Milliseconds to wait between retries
 */
export async function withErrorRecovery<T>(
  operation: () => Promise<T>,
  retryCount: number = 2,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't wait on the last attempt
      if (attempt < retryCount) {
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
}

/**
 * Context boundary error handler for React components
 */
export function createErrorBoundaryHandler(fallbackUI?: React.ReactNode) {
  return {
    onError: (error: Error) => {
      handleError(error, { toastTitle: 'Ошибка компонента' });
    },
    fallback: fallbackUI
  };
}
