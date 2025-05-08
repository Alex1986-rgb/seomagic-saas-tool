
import React from 'react';
import { motion } from 'framer-motion';
import AuditLoading from '../../AuditLoading';
import { AuditTimeoutMessage } from '../../AuditTimeoutMessage';
import { Card } from "@/components/ui/card";

interface AuditStateHandlerProps {
  isLoading: boolean;
  hadError: boolean;
  timeout: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}

// Animation variants for content transitions
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AuditStateHandler: React.FC<AuditStateHandlerProps> = ({
  isLoading,
  hadError,
  timeout,
  onRetry,
  children
}) => {
  if (isLoading) {
    return <AuditLoading />;
  }

  if (timeout) {
    return (
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-border">
        <AuditTimeoutMessage onRetry={onRetry} />
      </Card>
    );
  }

  if (hadError) {
    return (
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-border">
        <div className="text-center space-y-4">
          <div className="text-xl font-semibold text-destructive">
            Произошла ошибка во время анализа
          </div>
          <p className="text-muted-foreground">
            Мы не смогли получить данные аудита. Пожалуйста, попробуйте еще раз.
          </p>
          <button 
            onClick={onRetry} 
            className="bg-primary/10 hover:bg-primary/20 transition-colors text-primary px-4 py-2 rounded-md"
          >
            Попробовать снова
          </button>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={contentVariants}
    >
      {children}
    </motion.div>
  );
};

export default AuditStateHandler;
