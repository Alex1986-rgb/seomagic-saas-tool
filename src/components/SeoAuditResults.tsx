
import React, { useState } from 'react';
import AuditResultsContainer from './audit/results/AuditResultsContainer';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, FileText, BarChart4 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanDepth, setScanDepth] = useState(100); // Default scan depth
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeepScan = () => {
    setIsScanning(true);
    setErrorMessage(null);
    setScanProgress(0);
    
    toast({
      title: "Глубокое сканирование",
      description: "Начинаем детальный анализ всех страниц сайта...",
    });
    
    // Simulate progress for demo purposes
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast({
            title: "Сканирование завершено",
            description: "Глубокий анализ сайта завершен успешно!",
          });
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  if (errorMessage) {
    return (
      <div className="neo-card p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Ошибка сканирования</h3>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <Button 
          onClick={() => setErrorMessage(null)}
          variant="outline"
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="neo-card p-6">
        <div className="text-center mb-6">
          <BarChart4 className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Глубокое сканирование сайта</h3>
          <p className="text-muted-foreground">Анализируем все страницы сайта {url}</p>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Прогресс сканирования</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Анализ может занять несколько минут в зависимости от размера сайта и количества страниц.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Аудит сайта: {url}</h2>
          <p className="text-muted-foreground">Максимальное количество страниц для сканирования: {scanDepth}</p>
        </div>
        
        <Button 
          onClick={handleDeepScan}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          <span>Запустить глубокое сканирование</span>
        </Button>
      </div>
      
      <AuditResultsContainer url={url} />
    </div>
  );
};

export default SeoAuditResults;
