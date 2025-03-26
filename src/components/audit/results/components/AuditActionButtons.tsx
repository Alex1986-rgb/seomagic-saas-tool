
import React from 'react';
import { RefreshCw, FileSearch } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AuditActionButtonsProps {
  onRefresh: () => void;
  onDeepScan: () => void;
  isRefreshing: boolean;
}

const AuditActionButtons: React.FC<AuditActionButtonsProps> = ({ 
  onRefresh, 
  onDeepScan, 
  isRefreshing 
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onDeepScan}
        variant="outline"
        size="sm"
      >
        <FileSearch className="h-4 w-4 mr-2" />
        Глубокий анализ
      </Button>
      <Button 
        onClick={onRefresh} 
        disabled={isRefreshing}
        size="sm"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Обновить аудит
      </Button>
    </div>
  );
};

export default AuditActionButtons;
