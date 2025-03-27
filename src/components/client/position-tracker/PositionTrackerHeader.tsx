
import React from 'react';
import { Button } from '@/components/ui/button';
import { History, Search, BarChart2, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

interface PositionTrackerHeaderProps {
  handleOrder: (type: 'audit' | 'position' | 'optimization') => void;
  lastCheckDate?: string;
  domainName?: string;
}

const PositionTrackerHeader: React.FC<PositionTrackerHeaderProps> = ({ 
  handleOrder,
  lastCheckDate,
  domainName = "example.com"
}) => {
  const { toast } = useToast();
  
  const formattedDate = lastCheckDate ? new Date(lastCheckDate).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Не проводилась';
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">Позиции сайта</h1>
          <Badge variant="outline" className="ml-2">{domainName}</Badge>
        </div>
        <p className="text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1">
          <span>Отслеживание позиций по ключевым словам и анализ конкурентов</span>
          <span className="hidden sm:inline mx-1">•</span>
          <span className="text-sm">Последняя проверка: {formattedDate}</span>
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3">
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
          variant="outline"
          className="flex items-center gap-2" 
          onClick={() => toast({
            title: "Отчеты",
            description: "Открыт список отчетов по позициям",
          })}
        >
          <FileText className="h-4 w-4" />
          <span>Отчеты</span>
        </Button>
        <Button 
          variant="outline"
          className="flex items-center gap-2" 
          onClick={() => toast({
            title: "Анализ конкурентов",
            description: "Открыт анализ конкурентов",
          })}
        >
          <BarChart2 className="h-4 w-4" />
          <span>Анализ конкурентов</span>
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
