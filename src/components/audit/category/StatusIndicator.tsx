
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatusIndicatorProps {
  status: 'good' | 'warning' | 'error';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'good': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'error': return <XCircle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'text-green-500 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const statusVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  };

  return (
    <motion.span 
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 border ${getStatusColor(status)}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={statusVariants}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {getStatusIcon(status)}
    </motion.span>
  );
};

export default StatusIndicator;
