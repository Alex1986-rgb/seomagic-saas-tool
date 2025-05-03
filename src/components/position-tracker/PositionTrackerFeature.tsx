
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Navigation, Search, Route } from 'lucide-react';
import { BrokenLinksAnalyzer } from './BrokenLinksAnalyzer';
import { SiteStructureVisualization } from './SiteStructureVisualization';
import { DuplicatesDetector } from './DuplicatesDetector';
import { ContentUniquenessChecker } from './ContentUniquenessChecker';

const PositionTrackerFeature: React.FC = () => {
  const [activeTab, setActiveTab] = useState('positions');
  const [domain, setDomain] = useState('example.com');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Отслеживание позиций сайта</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Позиции</span>
          </TabsTrigger>
          <TabsTrigger value="broken" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span>Битые ссылки</span>
          </TabsTrigger>
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <span>Структура</span>
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Дубликаты</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Позиции в поисковых системах</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentUniquenessChecker domain={domain} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="broken">
          <BrokenLinksAnalyzer domain={domain} />
        </TabsContent>
        
        <TabsContent value="structure">
          <SiteStructureVisualization domain={domain} />
        </TabsContent>
        
        <TabsContent value="duplicates">
          <DuplicatesDetector domain={domain} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PositionTrackerFeature;
