
import React from 'react';
import { Button } from '@/components/ui/button';
import { History, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PositionTrackerHeaderProps {
  handleOrder: (type: 'audit' | 'position' | 'optimization') => void;
}

const PositionTrackerHeader: React.FC<PositionTrackerHeaderProps> = ({ 
  handleOrder 
}) => {
  const { toast } = useToast();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Позиции сайта</h1>
        <p className="text-muted-foreground">
          Отслеживание позиций сайта по ключевым словам и анализ конкурентов
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => toast({
            title: "История проверок",
            description: "Открыт список предыдущих проверок позиций",
          })}
        >
          <History className="h-4 w-4" />
          <span>История проверок</span>
        </Button>
        <Button 
          className="flex items-center gap-2" 
          onClick={() => handleOrder('position')}
        >
          <Search className="h-4 w-4" />
          <span>Проверить позиции</span>
        </Button>
      </div>
    </div>
  );
};

export default PositionTrackerHeader;
