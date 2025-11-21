
import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface OptimizationLoadingStatusProps {
  status: string;
  attempt?: number;
  className?: string;
}

const OptimizationLoadingStatus: React.FC<OptimizationLoadingStatusProps> = ({
  status,
  attempt,
  className
}) => {
  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-primary/5 border border-primary/20 rounded-lg p-4 ${className || ''}`}
    >
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{status}</p>
          {attempt && attempt > 1 && (
            <p className="text-xs text-muted-foreground mt-1">
              Результаты аудита готовятся на сервере...
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OptimizationLoadingStatus;
