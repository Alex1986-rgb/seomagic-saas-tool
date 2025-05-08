
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
  if (hadError || timeout) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500 mb-4">
          {timeout 
            ? "Время ожидания истекло. Возможно, сайт слишком большой или недоступен." 
            : "Произошла ошибка при загрузке аудита"
          }
        </p>
        <Button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Попробовать снова
        </Button>
      </div>
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
