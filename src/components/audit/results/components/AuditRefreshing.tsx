
import React from 'react';
import { RefreshCw } from 'lucide-react';

const AuditRefreshing: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10 rounded-lg">
      <div className="text-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium">Обновление аудита...</p>
      </div>
    </div>
  );
};

export default AuditRefreshing;
