
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { PositionTrackerForm } from '@/components/position-tracker/PositionTrackerForm';
import { PositionTrackerResults } from '@/components/position-tracker/PositionTrackerResults';
import { PositionTrackerHistory } from '@/components/position-tracker/PositionTrackerHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, History, BarChart } from 'lucide-react';

const PositionTracker = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState("search");
  
  const handleSearchComplete = (results) => {
    setSearchResults(results);
    setActiveTab("results");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-10">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Анализ позиций сайта</h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              Отслеживайте позиции вашего сайта в поисковых системах Яндекс, Google и Mail.ru
            </p>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-6 md:mb-8">
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
            
            <div className="neo-card p-3 sm:p-4 md:p-6">
              <TabsContent value="search">
                <PositionTrackerForm onSearchComplete={handleSearchComplete} />
              </TabsContent>
              
              <TabsContent value="results">
                {searchResults ? (
                  <PositionTrackerResults results={searchResults} />
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <Search className="h-10 w-10 md:h-16 md:w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg md:text-xl font-medium mb-2">Нет данных для отображения</h3>
                    <p className="text-sm md:text-base text-muted-foreground px-4">
                      Запустите проверку позиций во вкладке "Проверка позиций", чтобы увидеть результаты
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history">
                <PositionTrackerHistory />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default PositionTracker;
