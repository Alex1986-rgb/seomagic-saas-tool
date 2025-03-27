
import React, { useState, useEffect } from 'react';
import { History, LineChart as LineChartIcon, PieChart, FileBarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPositionHistory } from '@/services/position/positionHistory';
import { useToast } from "@/hooks/use-toast";
import { PositionData } from '@/services/position/positionTracker';
import {
  StatsOverview,
  PositionsDistributionChart,
  DailyActivityChart,
  SearchEngineDistribution, 
  TopKeywordsTable
} from './analytics';

export function PositionTrackerAnalytics() {
  const [history, setHistory] = useState<PositionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getPositionHistory();
      setHistory(data);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      toast({
        title: "Ошибка загрузки данных",
        description: "Не удалось загрузить историю проверок позиций",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Аналитика позиций в поисковых системах</h2>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => window.location.href = "/position-tracker"}>
          <History className="h-4 w-4" />
          К проверке позиций
        </Button>
      </div>

      {/* Overview Stats */}
      <StatsOverview history={history} />

      <Tabs defaultValue="positions">
        <TabsList className="mb-4">
          <TabsTrigger value="positions" className="flex items-center gap-1">
            <LineChartIcon className="h-4 w-4" />
            Распределение позиций
          </TabsTrigger>
          <TabsTrigger value="engines" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            Поисковые системы
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-1">
            <FileBarChart className="h-4 w-4" />
            Топ ключевых слов
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PositionsDistributionChart history={history} />
            <DailyActivityChart history={history} />
          </div>
        </TabsContent>

        <TabsContent value="engines">
          <SearchEngineDistribution history={history} />
        </TabsContent>

        <TabsContent value="keywords">
          <TopKeywordsTable history={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
