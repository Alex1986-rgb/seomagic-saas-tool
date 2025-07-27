
import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ErrorHandlingProvider } from '@/contexts/ErrorHandlingContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { GlobalErrorBoundary } from '@/components/ui/error-handler';

// QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  useEffect(() => {
    console.log("✅ AppProviders mounted");
    return () => {
      console.log("❌ AppProviders unmounted");
    };
  }, []);
  
  console.log("🔄 AppProviders rendering");
  
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorHandlingProvider>
          <GlobalErrorBoundary>
            <LoadingProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </LoadingProvider>
          </GlobalErrorBoundary>
        </ErrorHandlingProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
