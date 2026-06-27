
import React from 'react';
import { Search, History, BarChart } from 'lucide-react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrackerHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Примечание: компонент рендерится внутри общего <Tabs> (см. pages/PositionTracker.tsx),
// поэтому здесь только TabsList/TabsTrigger без собственной обёртки Tabs.
const TrackerHeader: React.FC<TrackerHeaderProps> = () => {
  return (
    <div className="mb-6 md:mb-10">
      <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Анализ позиций сайта</h1>
      <p className="text-sm md:text-lg text-muted-foreground">
        Отслеживайте позиции вашего сайта в поисковых системах Яндекс, Google и Mail.ru
      </p>

      <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8 overflow-x-auto mt-6">
        <TabsTrigger value="search" className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm">
          <Search className="h-3 w-3 md:h-4 md:w-4" />
          <span className="truncate">Проверка позиций</span>
        </TabsTrigger>
        <TabsTrigger value="results" className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm">
          <BarChart className="h-3 w-3 md:h-4 md:w-4" />
          <span className="truncate">Анализ результатов</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm">
          <History className="h-3 w-3 md:h-4 md:w-4" />
          <span className="truncate">История проверок</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default TrackerHeader;
