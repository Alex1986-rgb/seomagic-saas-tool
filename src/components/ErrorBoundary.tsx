
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-destructive/30 bg-destructive/10 text-center space-y-4">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="text-xl font-semibold text-destructive">Что-то пошло не так</h2>
      <p className="text-muted-foreground">Произошла ошибка при загрузке этого компонента</p>
      <div className="max-w-md overflow-auto text-sm bg-background/50 p-2 rounded">
        <code className="text-xs">{error.message}</code>
      </div>
      <Button variant="outline" onClick={resetErrorBoundary}>
        Попробовать снова
      </Button>
    </div>
  );
};

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <ReactErrorBoundary FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}>
      <Component {...props} />
    </ReactErrorBoundary>
  );
  
  return WithErrorBoundary;
};

export const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};
