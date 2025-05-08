
import { QueryClient } from '@tanstack/react-query';
import { formatError } from './error-utils';
import { toast } from '@/hooks/use-toast';

/**
 * Configure default error handling for React Query
 */
export function setupQueryErrorHandler(queryClient: QueryClient) {
  // Set up global error handler
  queryClient.setDefaultOptions({
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 404s or other client errors
        if (typeof error === 'object' && error && 'status' in error) {
          const status = Number(error.status);
          if (status >= 400 && status < 500) return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      // Add consistent error handling via the meta option
      meta: {
        onError: (error: unknown) => {
          const errorMessage = formatError(error);
          console.error('Query error:', error);
          toast({
            title: 'Ошибка загрузки данных',
            description: errorMessage,
            variant: 'destructive'
          });
        }
      }
    },
    mutations: {
      retry: false,
      // Add consistent error handling via the meta option
      meta: {
        onError: (error: unknown) => {
          const errorMessage = formatError(error);
          console.error('Mutation error:', error);
          toast({
            title: 'Ошибка сохранения данных',
            description: errorMessage,
            variant: 'destructive'
          });
        }
      }
    }
  });

  return queryClient;
}
