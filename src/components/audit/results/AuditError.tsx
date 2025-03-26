
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AuditErrorProps {
  error: string;
  onRetry: () => void;
}

const AuditError: React.FC<AuditErrorProps> = ({ error, onRetry }) => {
  return (
    <motion.div 
      className="p-6 text-center neo-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
      <p className="text-lg text-red-500 mb-4">{error}</p>
      <p className="text-muted-foreground mb-6">
        Пожалуйста, проверьте URL и попробуйте снова. Если проблема повторяется, обратитесь в службу поддержки.
      </p>
      <Button onClick={onRetry}>Попробовать снова</Button>
    </motion.div>
  );
};

export default AuditError;
