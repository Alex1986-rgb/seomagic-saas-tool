
import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ErrorHandlingProvider } from '@/contexts/ErrorHandlingContext';
import { AuthProvider } from '@/contexts/AuthContext';
import PerformanceMonitor from '@/components/shared/performance/PerformanceMonitor';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  useEffect(() => {
    console.log("AppProviders mounted");
    
    // Регистрация Service Worker для кеширования (если поддерживается)
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
    
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
            <PerformanceMonitor 
              enabled={process.env.NODE_ENV === 'development'} 
              showDebugInfo={false}
              onMetricsCollected={(metrics) => {
                // Отправка метрик в аналитику (если настроена)
                if (process.env.NODE_ENV === 'production') {
                  // gtag('event', 'performance_metrics', metrics);
                }
              }}
            />
          </AuthProvider>
        </LoadingProvider>
      </ErrorHandlingProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
