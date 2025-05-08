
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import GlobalErrorBoundary from './GlobalErrorBoundary';
import { useErrorHandler } from './useErrorHandler';
import ErrorDisplay from './ErrorDisplay';

export { GlobalErrorBoundary, useErrorHandler, ErrorDisplay };

interface ErrorAlertProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  onDismiss?: () => void;
  retryAction?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  description,
  variant = 'destructive',
  onDismiss,
  retryAction
}) => {
  const [dismissed, setDismissed] = useState(false);
  
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };
  
  if (dismissed) return null;
  
  return (
    <Alert variant={variant as 'default' | 'destructive'} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div className="mt-2">{description}</div>
        <div className="mt-4 flex space-x-2">
          {retryAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={retryAction}
            >
              Повторить
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
            >
              Закрыть
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default { GlobalErrorBoundary, ErrorAlert, useErrorHandler, ErrorDisplay };
