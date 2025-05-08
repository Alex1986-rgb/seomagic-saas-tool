
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ErrorDisplay } from '@/components/ui/error-handler';
import { formatError, withErrorRecovery } from '@/lib/error-utils';

interface ErrorHandlingContextType {
  setError: (error: Error | string | null) => void;
  clearError: () => void;
  handleError: (error: unknown, options?: {
    message?: string;
    showToast?: boolean;
    toastTitle?: string;
    toastVariant?: 'default' | 'destructive';
  }) => void;
  withRecovery: typeof withErrorRecovery;
  error: Error | string | null;
  isErrorActive: boolean;
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
    const errorMessage = options?.message || formatError(err);
    
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

  const isErrorActive = error !== null;

  return (
    <ErrorHandlingContext.Provider 
      value={{ 
        error, 
        setError, 
        clearError, 
        handleError, 
        withRecovery: withErrorRecovery,
        isErrorActive
      }}
    >
      {children}
      {displayErrors && error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <ErrorDisplay 
            error={error} 
            onRetry={clearError}
            title="Произошла ошибка"
          />
        </div>
      )}
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
