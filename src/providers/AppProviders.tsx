
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ErrorHandlingProvider } from '@/contexts/ErrorHandlingContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { GlobalErrorBoundary } from '@/components/ui/error-handler';
import { setupQueryErrorHandler } from '@/lib/react-query-error-handler';

// Create a client with error handling
const queryClient = setupQueryErrorHandler(new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
}));

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <ErrorHandlingProvider>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            <AuthProvider>
              <GlobalErrorBoundary>
                {children}
                <Toaster />
              </GlobalErrorBoundary>
            </AuthProvider>
          </LoadingProvider>
        </QueryClientProvider>
      </ErrorHandlingProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
