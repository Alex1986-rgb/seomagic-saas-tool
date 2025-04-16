
import React from 'react';
import { Search, History, BarChart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrackerHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TrackerHeader: React.FC<TrackerHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6 md:mb-10">
      <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Анализ позиций сайта</h1>
      <p className="text-sm md:text-lg text-muted-foreground">
        Отслеживайте позиции вашего сайта в поисковых системах Яндекс, Google и Mail.ru
      </p>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="mt-6">
        <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8 overflow-x-auto">
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
      </Tabs>
    </div>
  );
};

export default TrackerHeader;
