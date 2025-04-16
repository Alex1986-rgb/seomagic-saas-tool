
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface DashboardHeaderProps {
  onNewAudit: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onNewAudit }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Панель управления</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Добро пожаловать в вашу панель управления SeoMarket</p>
      </div>
      <Button 
        onClick={onNewAudit}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <Search className="h-4 w-4" />
        Новый аудит
      </Button>
    </div>
  );
};

export default DashboardHeader;
