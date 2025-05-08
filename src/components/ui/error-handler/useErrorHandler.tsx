
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { formatError } from '@/lib/utils';

export function useErrorHandler() {
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
    
    console.error('Handled error:', err);
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

  return {
    error,
    setError,
    handleError,
    clearError
  };
}
