
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { formatError } from '@/lib/error-utils';

/**
 * Hook for component-level error handling
 */
export function useComponentErrorHandler() {
  const [error, setError] = useState<Error | string | null>(null);
  const { toast } = useToast();

  const handleError = useCallback((err: unknown, options?: { 
    message?: string,
    silent?: boolean,
    toastTitle?: string,
    toastDescription?: string,
    toastVariant?: 'default' | 'destructive'
  }) => {
    // Format the error to ensure consistent handling
    const errorMessage = options?.message || formatError(err);
    
    console.error('Component error:', err);
    setError(errorMessage);

    if (!options?.silent) {
      toast({
        title: options?.toastTitle || 'Ошибка',
        description: options?.toastDescription || errorMessage,
        variant: options?.toastVariant || 'destructive'
      });
    }
    
    return errorMessage;
  }, [toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Safely execute a function with error handling
   */
  const safeExecute = useCallback(async <T,>(fn: () => Promise<T>, errorOptions?: Parameters<typeof handleError>[1]): Promise<T | null> => {
    try {
      return await fn();
    } catch (err) {
      handleError(err, errorOptions);
      return null;
    }
  }, [handleError]);

  return {
    error,
    setError,
    handleError,
    clearError,
    safeExecute
  };
}

// Re-export for API consistency
export const useErrorHandler = useComponentErrorHandler;
