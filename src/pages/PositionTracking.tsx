
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { PositionTrackerForm, PositionTrackerHistory } from '@/components/position-tracker';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, History } from 'lucide-react';

interface SearchResult {
  domain: string;
  keywords: string[];
  searchEngine: string;
  region: string;
  timestamp: string;
  positions: Array<{
    keyword: string;
    position: number;
    url: string;
    searchEngine: string;
  }>;
}

const PositionTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  
  const handleSearchComplete = (results: SearchResult) => {
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
          
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="search" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Проверка позиций</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>История проверок</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="search">
                  <PositionTrackerForm onSearchComplete={handleSearchComplete} />
                </TabsContent>
                
                <TabsContent value="history">
                  <PositionTrackerHistory />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PositionTracking;
