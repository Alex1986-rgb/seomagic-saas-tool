
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  autoExecute?: boolean;
  toastSuccess?: boolean | { title: string; message: string };
  toastError?: boolean | { title: string; message: string };
  resetOnUnmount?: boolean;
  initialLoading?: boolean;
}

interface UseAsyncReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const {
    onSuccess,
    onError,
    autoExecute = false,
    toastSuccess = false,
    toastError = true,
    resetOnUnmount = false,
    initialLoading = false,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await asyncFunction(...args);
        setData(result);

        if (onSuccess) {
          onSuccess(result);
        }

        if (toastSuccess) {
          const isObject = typeof toastSuccess === 'object';
          toast({
            title: isObject ? toastSuccess.title : 'Успешно',
            description: isObject ? toastSuccess.message : 'Операция выполнена успешно',
            variant: 'default',
          });
        }

        return result;
      } catch (e) {
        const errorObj = e instanceof Error ? e : new Error(String(e));
        setError(errorObj);

        if (onError) {
          onError(errorObj);
        }

        if (toastError) {
          const isObject = typeof toastError === 'object';
          toast({
            title: isObject ? toastError.title : 'Ошибка',
            description: isObject ? toastError.message : errorObj.message,
            variant: 'destructive',
          });
        }

        throw errorObj;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction, onSuccess, onError, toastSuccess, toastError, toast]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Execute the function automatically if autoExecute is true
  useEffect(() => {
    if (autoExecute) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset on unmount if specified
  useEffect(() => {
    return () => {
      if (resetOnUnmount) {
        reset();
      }
    };
  }, [resetOnUnmount, reset]);

  return { data, isLoading, error, execute, reset, setData };
}
