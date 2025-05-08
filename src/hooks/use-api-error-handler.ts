
import { useCallback } from 'react';
import { useErrorHandler } from './use-error-handling';
import { useToast } from './use-toast';
import { ApiErrorResponse, isAxiosError } from '@/api/client/errorHandler';

/**
 * Hook for handling API errors with appropriate user feedback
 */
export function useApiErrorHandler() {
  const { handleError } = useErrorHandler();
  const { toast } = useToast();
  
  /**
   * Formats API errors for user display
   */
  const formatApiError = useCallback((error: unknown): string => {
    // Handle Axios errors
    if (isAxiosError(error)) {
      const axiosError = error;
      
      // Handle server down / network errors
      if (!axiosError.response) {
        return 'Сервер недоступен или отсутствует подключение к интернету';
      }
      
      // Use the error data if available
      if (axiosError.response?.data) {
        if (typeof axiosError.response.data === 'string') {
          return axiosError.response.data;
        }
        
        if (typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          return String(axiosError.response.data.message);
        }
      }
      
      // If no specific error message, use status code
      if (axiosError.response?.status) {
        switch(axiosError.response.status) {
          case 401: return 'Требуется авторизация для доступа к ресурсу';
          case 403: return 'Доступ запрещен';
          case 404: return 'Ресурс не найден';
          case 429: return 'Слишком много запросов, пожалуйста, попробуйте позже';
          case 500: return 'Внутренняя ошибка сервера';
          default: return `Ошибка запроса (${axiosError.response.status})`;
        }
      }
      
      return axiosError.message || 'Ошибка API';
    }
    
    // Handle standard error objects
    if (error instanceof Error) {
      return error.message;
    }
    
    // Handle API error response objects
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as ApiErrorResponse).message;
    }
    
    // Default error message
    return 'Произошла ошибка при обращении к API';
  }, []);
  
  /**
   * Handle API error with appropriate user feedback
   */
  const handleApiError = useCallback((error: unknown, options?: {
    title?: string;
    context?: string;
    silent?: boolean;
    retry?: () => void;
  }) => {
    const errorMessage = formatApiError(error);
    const title = options?.title || 'Ошибка API';
    const context = options?.context ? ` при ${options.context}` : '';
    
    console.error(`API error${context}:`, error);
    
    if (!options?.silent) {
      toast({
        title,
        description: errorMessage,
        variant: 'destructive',
        action: options?.retry ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={options.retry}
            className="bg-background"
          >
            Повторить
          </Button>
        ) : undefined
      });
    }
    
    return errorMessage;
  }, [formatApiError, toast]);
  
  /**
   * Execute API call with automatic error handling
   */
  const safeApiCall = useCallback(async <T,>(
    apiCall: () => Promise<T>,
    options?: {
      context?: string;
      silent?: boolean;
      title?: string;
      autoRetry?: boolean;
      maxRetries?: number;
    }
  ): Promise<T | null> => {
    const maxRetries = options?.maxRetries ?? (options?.autoRetry ? 1 : 0);
    let attemptCount = 0;
    
    while (attemptCount <= maxRetries) {
      try {
        return await apiCall();
      } catch (error) {
        attemptCount++;
        
        const isFinalAttempt = attemptCount > maxRetries;
        
        if (isFinalAttempt) {
          handleApiError(error, {
            context: options?.context,
            silent: options?.silent,
            title: options?.title
          });
          return null;
        }
        
        // If not final attempt, wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return null;
  }, [handleApiError]);
  
  return {
    formatApiError,
    handleApiError,
    safeApiCall
  };
}
