
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from "@/components/ui/card";
import { PositionData } from '@/services/position/positionTracker';
import { PositionTrackerForm } from '@/components/position-tracker/PositionTrackerForm';
import { PositionTrackerResults } from '@/components/position-tracker/PositionTrackerResults';
import { PositionTrackerHistory } from '@/components/position-tracker/PositionTrackerHistory';
import { PositionTrackerSettings } from '@/components/position-tracker/PositionTrackerSettings';

interface TrackerContentProps {
  activeTab: string;
  searchResults: PositionData | null;
  onSearchComplete: (results: PositionData) => void;
}

const TrackerContent: React.FC<TrackerContentProps> = ({ 
  activeTab, 
  searchResults, 
  onSearchComplete 
}) => {
  return (
    <>
      <TabsContent value="search">
        <Card>
          <CardContent className="pt-6">
            <PositionTrackerForm onSearchComplete={onSearchComplete} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="results">
        <Card>
          <CardContent className="pt-6">
            {searchResults ? (
              <PositionTrackerResults results={searchResults} />
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Нет данных для отображения. Пожалуйста, выполните проверку позиций.
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history">
        <Card>
          <CardContent className="pt-6">
            <PositionTrackerHistory />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="tools">
        <Card>
          <CardContent className="pt-6">
            <PositionTrackerSettings />
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default TrackerContent;
