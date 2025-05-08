
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorDisplayProps {
  error: Error | string | null;
  onRetry?: () => void;
  title?: string;
  variant?: 'default' | 'destructive';
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  title = 'Ошибка',
  variant = 'destructive',
  className = ''
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Alert variant={variant} className={`mb-4 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div className="mt-2">{errorMessage}</div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-4"
          >
            Повторить
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

// Use named export as our standard pattern
export default ErrorDisplay;
