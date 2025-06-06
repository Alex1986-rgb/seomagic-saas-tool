
import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ErrorHandlingProvider } from '@/contexts/ErrorHandlingContext';
import { AuthProvider } from '@/contexts/AuthContext';

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
        <LoadingProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </LoadingProvider>
      </ErrorHandlingProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
