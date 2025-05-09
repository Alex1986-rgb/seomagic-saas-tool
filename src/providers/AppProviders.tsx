
import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ErrorHandlingProvider } from '@/contexts/ErrorHandlingContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { GlobalErrorBoundary } from '@/components/ui/error-handler';

// Create a client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  useEffect(() => {
    console.log("AppProviders mounted");
    return () => {
      console.log("AppProviders unmounted");
    };
  }, []);
  
  console.log("AppProviders rendering");
  
  return (
    <HelmetProvider>
      <ErrorHandlingProvider>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </LoadingProvider>
        </QueryClientProvider>
      </ErrorHandlingProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
