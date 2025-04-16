
import React from 'react';
import { History } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AnalyticsHeaderProps {
  title: string;
  onBackClick?: () => void;
  backLabel?: string;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ 
  title, 
  onBackClick, 
  backLabel = "К проверке позиций" 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      {onBackClick && (
        <Button variant="outline" size="sm" className="gap-1" onClick={onBackClick}>
          <History className="h-4 w-4" />
          {backLabel}
        </Button>
      )}
    </div>
  );
};

export default AnalyticsHeader;
