
import React from 'react';

interface StatusIndicatorProps {
  status: 'good' | 'warning' | 'error';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'good': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return '•';
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

  return (
    <span className="inline-block w-6 h-6 text-center mr-3">
      {getStatusIcon(status)}
    </span>
  );
};

export default StatusIndicator;
