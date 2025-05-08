
import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from '@/components/ui/error-handler';

interface AuditStateHandlerProps {
  isLoading: boolean;
  hadError: boolean;
  timeout: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}

const AuditStateHandler: React.FC<AuditStateHandlerProps> = ({
  isLoading,
  hadError,
  timeout,
  onRetry,
  children
}) => {
  // Determine error message based on conditions
  const errorMessage = timeout 
    ? "Время ожидания истекло. Возможно, сайт слишком большой или недоступен."
    : "Произошла ошибка при загрузке аудита";

  if (hadError || timeout) {
    return (
      <ErrorDisplay 
        error={errorMessage}
        onRetry={onRetry}
        title={timeout ? "Превышено время ожидания" : "Ошибка загрузки"}
        variant="destructive"
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {children}
    </motion.div>
  );
};

export default AuditStateHandler;
