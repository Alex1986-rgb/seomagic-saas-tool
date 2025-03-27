
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, FileText, Search, TrendingUp } from 'lucide-react';
import { getPositionHistory } from '@/services/position/positionHistory';
import { PositionData, checkPositions } from '@/services/position/positionTracker';
import { useToast } from "@/hooks/use-toast";
import {
  PositionTrackerHeader,
  OverviewTab,
  KeywordsTab,
  TrendsTab,
  ReportsTab,
  OrderDialog
} from './position-tracker';

const ClientPositionTracker: React.FC = () => {
  const [history, setHistory] = useState<PositionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderType, setOrderType] = useState<'audit' | 'position' | 'optimization'>('audit');
  const { toast } = useToast();

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getPositionHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error loading position history:', error);
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить историю проверок позиций",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [toast]);

  const handleOrder = (type: 'audit' | 'position' | 'optimization') => {
    setOrderType(type);
    setOrderDialogOpen(true);
  };

  const submitOrder = () => {
    toast({
      title: "Заказ размещен",
      description: `Ваш заказ на ${
        orderType === 'audit' ? 'аудит сайта' : 
        orderType === 'position' ? 'проверку позиций' : 
        'оптимизацию сайта'
      } успешно размещен`,
    });
    setOrderDialogOpen(false);

    // If it's a position check, simulate starting a check
    if (orderType === 'position') {
      runPositionCheck();
    }
  };

  const runPositionCheck = async () => {
    setIsLoading(true);
    toast({
      title: "Проверка позиций запущена",
      description: "Процесс проверки позиций сайта начат, это может занять несколько минут",
    });

    try {
      // Sample data for testing
      const testData = {
        domain: "example.com",
        keywords: ["SEO оптимизация", "продвижение сайта", "анализ сайта", "проверка позиций", "аудит сайта"],
        searchEngine: "all",
        region: "Москва",
        depth: 100,
        scanFrequency: "once"
      };

      // Run the check
      const result = await checkPositions(testData);
      
      // Reload history to show the new check
      const updatedHistory = await getPositionHistory();
      setHistory(updatedHistory);
      
      toast({
        title: "Проверка позиций завершена",
        description: "Результаты проверки позиций сайта доступны в разделе отчетов",
      });
    } catch (error) {
      console.error('Error checking positions:', error);
      toast({
        title: "Ошибка проверки позиций",
        description: "Не удалось выполнить проверку позиций",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PositionTrackerHeader handleOrder={handleOrder} />
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Обзор</span>
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Ключевые слова</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Тренды</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Отчёты</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab history={history} />
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <KeywordsTab history={history} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendsTab history={history} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsTab handleOrder={handleOrder} />
        </TabsContent>
      </Tabs>
      
      <OrderDialog
        open={orderDialogOpen}
        orderType={orderType}
        onOpenChange={setOrderDialogOpen}
        onSubmit={submitOrder}
      />
    </div>
  );
};

export default ClientPositionTracker;
