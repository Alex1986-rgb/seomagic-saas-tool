
import React, { useState, useEffect } from 'react';
import { getPositionHistory } from '@/services/position/positionHistory';
import { useToast } from "@/hooks/use-toast";
import { PositionData } from '@/services/position/positionTracker';
import { StatsOverview } from './analytics/StatsOverview';
import { AnalyticsHeader } from './analytics/AnalyticsHeader';
import { AnalyticsTabs } from './analytics/AnalyticsTabs';

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

  const handleBackClick = () => {
    window.location.href = "/position-tracker";
  };

  return (
    <div className="space-y-8">
      <AnalyticsHeader 
        title="Аналитика позиций в поисковых системах" 
        onBackClick={handleBackClick}
      />
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <StatsOverview history={history} />
          <AnalyticsTabs history={history} />
        </>
      )}
    </div>
  );
}

export default PositionTrackerAnalytics;
