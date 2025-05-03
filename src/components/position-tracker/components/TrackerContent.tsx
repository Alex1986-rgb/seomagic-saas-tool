
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PositionTrackerForm } from '../PositionTrackerForm';
import { PositionTrackerResults } from '../PositionTrackerResults';
import { PositionTrackerHistory } from '../PositionTrackerHistory';
import { PositionData } from '@/services/position/positionTracker';
import { ContentUniquenessChecker } from '../ContentUniquenessChecker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, FileCheck, Grid3X3 } from 'lucide-react';

interface TrackerContentProps {
  activeTab: string;
  searchResults: PositionData | null;
  onSearchComplete: (results: PositionData) => void;
}

const TrackerContent: React.FC<TrackerContentProps> = ({
  activeTab,
  searchResults,
  onSearchComplete,
}) => {
  const [toolsTab, setToolsTab] = useState("uniqueness");

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <TabsContent value="search" forceMount={true} hidden={activeTab !== "search"}>
          <PositionTrackerForm onSearchComplete={onSearchComplete} />
        </TabsContent>
        
        <TabsContent value="results" forceMount={true} hidden={activeTab !== "results"}>
          <PositionTrackerResults results={searchResults} />
        </TabsContent>
        
        <TabsContent value="history" forceMount={true} hidden={activeTab !== "history"}>
          <PositionTrackerHistory />
        </TabsContent>
        
        <TabsContent value="tools" forceMount={true} hidden={activeTab !== "tools"}>
          <Tabs defaultValue={toolsTab} onValueChange={setToolsTab} className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Инструменты анализа</h2>
              <TabsList>
                <TabsTrigger value="uniqueness" className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span>Уникальность</span>
                </TabsTrigger>
                <TabsTrigger value="structure" className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  <span>Структура</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="uniqueness">
              <ContentUniquenessChecker domain={searchResults?.domain} />
            </TabsContent>
            
            <TabsContent value="structure">
              <div className="text-center py-8">
                <Grid3X3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Анализ структуры сайта</h3>
                <p className="text-muted-foreground mb-4">
                  Этот инструмент поможет проанализировать структуру сайта и найти проблемы в навигации
                </p>
                <p className="text-sm text-muted-foreground">
                  * Функция будет доступна в следующем обновлении
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default TrackerContent;
