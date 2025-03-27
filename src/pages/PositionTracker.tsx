
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { PositionTrackerForm } from '@/components/position-tracker/PositionTrackerForm';
import { PositionTrackerResults } from '@/components/position-tracker/PositionTrackerResults';
import { PositionTrackerHistory } from '@/components/position-tracker/PositionTrackerHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, History, BarChart } from 'lucide-react';

const PositionTracker = () => {
  const [searchResults, setSearchResults] = useState(null);
  
  const handleSearchComplete = (results) => {
    setSearchResults(results);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Анализ позиций сайта</h1>
            <p className="text-lg text-muted-foreground">
              Отслеживайте позиции вашего сайта в поисковых системах Яндекс, Google и Mail.ru
            </p>
          </div>
          
          <Tabs defaultValue="search" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Проверка позиций</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Анализ результатов</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>История проверок</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="neo-card p-6">
              <TabsContent value="search">
                <PositionTrackerForm onSearchComplete={handleSearchComplete} />
              </TabsContent>
              
              <TabsContent value="results">
                {searchResults ? (
                  <PositionTrackerResults results={searchResults} />
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">Нет данных для отображения</h3>
                    <p className="text-muted-foreground">
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
