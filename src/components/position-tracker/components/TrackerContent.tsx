
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

// Define the valid search engine types to match the position tracker's expectations
type SearchEngineType = "google" | "yandex" | "mailru" | "all";

// Helper function to ensure the search engine string is of the correct type
const validateSearchEngine = (engine: string): SearchEngineType => {
  const validEngines: SearchEngineType[] = ["google", "yandex", "mailru", "all"];
  return validEngines.includes(engine as SearchEngineType) 
    ? (engine as SearchEngineType) 
    : "all"; // Default to "all" if invalid
};

const TrackerContent: React.FC<TrackerContentProps> = ({ 
  activeTab, 
  searchResults, 
  onSearchComplete 
}) => {
  return (
    <>
      <TabsContent value="search">
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <PositionTrackerForm onSearchComplete={(results) => {
              // Ensure the search engine is of the correct type before passing it on
              const validatedResults = {
                ...results,
                searchEngine: validateSearchEngine(results.searchEngine)
              };
              onSearchComplete(validatedResults);
            }} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="results">
        <Card>
          <CardContent className="pt-4 md:pt-6">
            {searchResults ? (
              <PositionTrackerResults results={searchResults} />
            ) : (
              <div className="text-center py-4 md:py-6 text-muted-foreground">
                Нет данных для отображения. Пожалуйста, выполните проверку позиций.
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history">
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <PositionTrackerHistory />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="tools">
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <PositionTrackerSettings />
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default TrackerContent;
