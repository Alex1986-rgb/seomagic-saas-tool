
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
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false
    }
  });

  // Set up global query cache error listener
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'observerResultsUpdated' && 
        event.query.getObserversCount() > 0 && 
        event.query.state.error) {
      const query = event.query;
      // Only show error toasts if no custom error handler is defined in the meta
      if (!query.options.meta?.onError) {
        const errorMessage = formatError(query.state.error);
        console.error('Query error:', query.state.error);
        toast({
          title: 'Ошибка загрузки данных',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    }
  });

  // Set up global mutation cache error listener
  queryClient.getMutationCache().subscribe((event) => {
    if (event.type === 'updated' && 
        event.mutation.state.status === 'error' &&
        event.mutation.state.error) {
      const mutation = event.mutation;
      // Only show error toasts if no custom error handler is defined in the meta
      if (!mutation.options.meta?.onError) {
        const errorMessage = formatError(mutation.state.error);
        console.error('Mutation error:', mutation.state.error);
        toast({
          title: 'Ошибка сохранения данных',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    }
  });

  return queryClient;
}
