
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ErrorHandlingProvider } from '@/contexts/ErrorHandlingContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { GlobalErrorBoundary } from '@/components/ui/error-handler';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <ErrorHandlingProvider>
        <LoadingProvider>
          <BrowserRouter>
            <AuthProvider>
              <GlobalErrorBoundary>
                {children}
                <Toaster />
              </GlobalErrorBoundary>
            </AuthProvider>
          </BrowserRouter>
        </LoadingProvider>
      </ErrorHandlingProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
