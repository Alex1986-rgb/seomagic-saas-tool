
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useErrorHandler() {
  const [error, setError] = useState<Error | string | null>(null);
  const { toast } = useToast();

  const handleError = useCallback((err: unknown, options?: { 
    message?: string,
    silent?: boolean,
    toastTitle?: string,
    toastDescription?: string
  }) => {
    const errorMessage = options?.message || 
      (err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    
    console.error('Handled error:', err);
    setError(errorMessage);

    if (!options?.silent) {
      toast({
        title: options?.toastTitle || 'Ошибка',
        description: options?.toastDescription || errorMessage,
        variant: 'destructive'
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

// No default export, only named export
