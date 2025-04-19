
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="ml-2">{error}</AlertDescription>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearError}
          className="ml-auto"
        >
          Закрыть
        </Button>
      </Alert>
    </motion.div>
  );
};

export default AuditErrorAlert;
