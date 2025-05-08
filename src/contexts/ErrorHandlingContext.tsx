
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ErrorDisplay } from '@/components/ui/error-handler';

interface ErrorHandlingContextType {
  setError: (error: Error | string | null) => void;
  clearError: () => void;
  handleError: (error: unknown, options?: {
    message?: string;
    showToast?: boolean;
    toastTitle?: string;
    toastVariant?: 'default' | 'destructive';
  }) => void;
  error: Error | string | null;
}

const ErrorHandlingContext = createContext<ErrorHandlingContextType | null>(null);

interface ErrorHandlingProviderProps {
  children: React.ReactNode;
  displayErrors?: boolean;
}

export const ErrorHandlingProvider: React.FC<ErrorHandlingProviderProps> = ({ 
  children,
  displayErrors = true 
}) => {
  const [error, setError] = useState<Error | string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: unknown, options?: {
    message?: string;
    showToast?: boolean;
    toastTitle?: string;
    toastVariant?: 'default' | 'destructive';
  }) => {
    const errorMessage = options?.message || 
      (err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    
    console.error('Ошибка:', err);
    setError(errorMessage);

    if (options?.showToast !== false) {
      toast({
        title: options?.toastTitle || 'Ошибка',
        description: errorMessage,
        variant: options?.toastVariant || 'destructive'
      });
    }
  }, [toast]);

  return (
    <ErrorHandlingContext.Provider value={{ error, setError, clearError, handleError }}>
      {children}
      {displayErrors && error && <ErrorDisplay error={error} onRetry={clearError} />}
    </ErrorHandlingContext.Provider>
  );
};

export const useErrorHandling = (): ErrorHandlingContextType => {
  const context = useContext(ErrorHandlingContext);
  if (!context) {
    throw new Error('useErrorHandling must be used within an ErrorHandlingProvider');
  }
  return context;
};
