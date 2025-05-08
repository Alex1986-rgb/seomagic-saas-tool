
import React from "react";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from '@/components/ui/error-handler';

interface AuditErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  extractedUrlRef: React.MutableRefObject<boolean>;
  setTimeoutOccurred: (v: boolean) => void;
}

const AuditErrorFallback: React.FC<AuditErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  extractedUrlRef,
  setTimeoutOccurred
}) => {
  const handleRetry = () => {
    extractedUrlRef.current = false;
    setTimeoutOccurred(false);
    resetErrorBoundary();
  };

  return (
    <ErrorDisplay 
      error={error} 
      onRetry={handleRetry}
      title="Ошибка аудита"
      variant="destructive"
    />
  );
};

export default AuditErrorFallback;
