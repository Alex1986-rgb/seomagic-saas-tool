
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorRetryProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'card' | 'inline' | 'minimal';
}

/**
 * Error display component with retry functionality
 */
export const ErrorRetry: React.FC<ErrorRetryProps> = ({
  error,
  onRetry,
  title = 'Ошибка',
  description,
  className,
  variant = 'card',
}) => {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error instanceof Error 
      ? error.message 
      : 'Произошла ошибка';

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-2 text-destructive", className)}>
        <AlertCircle className="h-4 w-4" />
        <span>{errorMessage}</span>
        {onRetry && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRetry} 
            className="h-6 w-6 p-1"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn("p-3 bg-destructive/10 rounded-md flex items-center gap-2", className)}>
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-destructive">{title}</p>
          <p className="text-sm text-destructive/90">{description || errorMessage}</p>
        </div>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Повторить</span>
          </Button>
        )}
      </div>
    );
  }
  
  // Default card variant
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-col items-center text-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div>
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className="text-muted-foreground">{description || errorMessage}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Повторить
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ErrorRetry;
