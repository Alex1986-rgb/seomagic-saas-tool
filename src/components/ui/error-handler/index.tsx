
import React from 'react';
import { GlobalErrorBoundary, ErrorFallback } from './GlobalErrorBoundary';
import ErrorDisplay from './ErrorDisplay';
import ErrorRetry from './ErrorRetry';
import { useErrorHandler } from '@/hooks/use-error-handling';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Standardize exports
export { GlobalErrorBoundary };
export { ErrorFallback };
export { ErrorDisplay };
export { ErrorRetry };
export { useErrorHandler };

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
  const [dismissed, setDismissed] = React.useState(false);
  
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
