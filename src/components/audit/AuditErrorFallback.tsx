
import React from "react";

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
}) => (
  <div className="p-6 text-center">
    <p className="text-lg text-red-500 mb-4">Произошла ошибка при загрузке аудита</p>
    <button 
      onClick={() => {
        extractedUrlRef.current = false;
        setTimeoutOccurred(false);
        resetErrorBoundary();
      }}
      className="px-4 py-2 bg-primary text-white rounded-md"
    >
      Попробовать снова
    </button>
  </div>
);

export default AuditErrorFallback;
