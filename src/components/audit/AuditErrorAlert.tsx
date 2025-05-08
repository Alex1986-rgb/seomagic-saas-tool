
import React from 'react';
import { motion } from 'framer-motion';
import { ErrorAlert } from '@/components/ui/error-handler';

interface AuditErrorAlertProps {
  error: string | null;
  onClearError: () => void;
}

const AuditErrorAlert: React.FC<AuditErrorAlertProps> = ({ error, onClearError }) => {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mb-6"
    >
      <ErrorAlert
        title="Ошибка"
        description={error}
        variant="destructive"
        onDismiss={onClearError}
      />
    </motion.div>
  );
};

export default AuditErrorAlert;
