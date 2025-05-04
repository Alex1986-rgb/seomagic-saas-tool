
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, History, FileText, Settings } from 'lucide-react';
import TrackerContent from '@/components/position-tracker/components/TrackerContent';
import { PositionData } from '@/services/position/positionTracker';

const PositionTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState<PositionData | null>(null);
  
  const handleSearchComplete = (results: PositionData) => {
    console.log('Поиск завершен, получены результаты:', results);
    setSearchResults(results);
    setActiveTab('results');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Отслеживание позиций</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Отслеживайте позиции вашего сайта в поисковых системах
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Проверка позиций</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Результаты</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>История проверок</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Инструменты</span>
              </TabsTrigger>
            </TabsList>
            
            <TrackerContent
              activeTab={activeTab}
              searchResults={searchResults}
              onSearchComplete={handleSearchComplete}
            />
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default PositionTracking;
