
import React from 'react';
import { motion } from 'framer-motion';
import { ErrorDisplay } from '@/components/ui/error-handler';

interface AuditErrorProps {
  error: string;
  onRetry: () => void;
}

const AuditError: React.FC<AuditErrorProps> = ({ error, onRetry }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <ErrorDisplay 
        error={error}
        onRetry={onRetry}
        title="Ошибка аудита"
        variant="destructive"
      />
    </motion.div>
  );
};

export default AuditError;
