
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface ErrorDisplayProps {
  error: Error | string | null;
  onRetry?: () => void;
  title?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  title = 'Произошла ошибка',
  className = '',
  variant = 'destructive'
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Alert variant={variant} className={`my-4 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="text-sm">{errorMessage}</div>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={onRetry}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Повторить
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export { default as GlobalErrorBoundary } from './GlobalErrorBoundary';
export { useErrorHandler } from './useErrorHandler';
