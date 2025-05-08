
import { useState, useEffect, useCallback } from 'react';

type PromiseStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

interface UsePromiseOptions<T> {
  autoExecute?: boolean;
  initialData?: T | null;
  onResolve?: (data: T) => void;
  onReject?: (error: Error) => void;
  resetOnUnmount?: boolean;
  deps?: any[];
}

interface UsePromiseReturn<T> {
  data: T | null;
  error: Error | null;
  status: PromiseStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function usePromise<T>(
  promiseFn: (...args: any[]) => Promise<T>,
  options: UsePromiseOptions<T> = {}
): UsePromiseReturn<T> {
  const {
    autoExecute = false,
    initialData = null,
    onResolve,
    onReject,
    resetOnUnmount = false,
    deps = [],
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<PromiseStatus>('idle');

  const execute = useCallback(
    async (...args: any[]) => {
      setStatus('pending');
      setError(null);

      try {
        const result = await promiseFn(...args);
        setData(result);
        setStatus('fulfilled');
        
        if (onResolve) {
          onResolve(result);
        }
      } catch (e) {
        const errorObj = e instanceof Error ? e : new Error(String(e));
        setError(errorObj);
        setStatus('rejected');
        
        if (onReject) {
          onReject(errorObj);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [promiseFn, onResolve, onReject, ...deps]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setStatus('idle');
  }, [initialData]);

  useEffect(() => {
    if (autoExecute) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, autoExecute]);

  useEffect(() => {
    return () => {
      if (resetOnUnmount) {
        reset();
      }
    };
  }, [resetOnUnmount, reset]);

  const isLoading = status === 'pending';
  const isSuccess = status === 'fulfilled';
  const isError = status === 'rejected';

  return {
    data,
    error,
    status,
    isLoading,
    isSuccess,
    isError,
    execute,
    reset,
  };
}
