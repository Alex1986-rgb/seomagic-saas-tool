import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { TriangleAlert } from 'lucide-react';

// Simple, theme-aware error display that follows the design system
export type ErrorDisplayProps = {
  title?: string;
  message?: string;
  description?: string;
  error?: string | Error;
  variant?: 'default' | 'destructive' | string;
  onRetry?: () => void;
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Произошла ошибка',
  message,
  description,
  error,
  onRetry,
}) => {
  const resolvedMessage =
    message ??
    description ??
    (typeof error === 'string' ? error : error?.message) ??
    'Неизвестная ошибка. Попробуйте обновить страницу.';

  return (
    <div className="neo-card rounded-lg p-4 md:p-5 text-left">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-md bg-accent/30 p-2">
          <TriangleAlert className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base md:text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{resolvedMessage}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
            >
              Повторить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple alert wrapper used in multiple places
export type ErrorAlertProps = {
  title?: string;
  description?: string;
  error?: string | null;
  variant?: 'default' | 'destructive' | string;
  onDismiss?: () => void;
  onClose?: () => void;
};

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ title, description, error, variant, onDismiss, onClose }) => {
  const message = error ?? description ?? null;
  if (!message) return null;
  return (
    <div role="alert" className="neo-card rounded-lg p-3 flex items-start gap-2">
      <TriangleAlert className="h-4 w-4 text-destructive mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        {title && <p className="text-sm font-semibold mb-0.5">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      <button
        aria-label="Закрыть"
        className="ml-2 rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary"
        onClick={onDismiss ?? onClose}
      >
        ✕
      </button>
    </div>
  );
};

// Fallback UI for error boundaries
const DefaultFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorDisplay
        title="Неожиданная ошибка интерфейса"
        message={error?.message || 'Что-то пошло не так'}
        onRetry={resetErrorBoundary}
      />
    </div>
  );
};

// Global error boundary used in AppProviders
export const GlobalErrorBoundary: React.FC<{ children: React.ReactNode; FallbackComponent?: React.ComponentType<any> }> = ({
  children,
  FallbackComponent = DefaultFallback,
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={(error, info) => {
        // eslint-disable-next-line no-console
        console.error('GlobalErrorBoundary caught an error:', error, info);
      }}
      onReset={() => {
        // Optional: clear caches, reset state, etc.
        // window.location.reload(); // Prefer a soft reset
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;
