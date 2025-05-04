
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { PositionTrackerForm } from '../PositionTrackerForm';
import { PositionTrackerResults } from '../PositionTrackerResults';
import { PositionTrackerHistory } from '../PositionTrackerHistory';
import { Card, CardContent } from '@/components/ui/card';
import { usePositionTracker } from '@/hooks/use-position-tracker';
import { PositionData } from '@/services/position/positionTracker';

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
  const {
    domain,
    setDomain,
    keywords,
    setKeywords,
    addKeyword,
    removeKeyword,
    searchEngine,
    setSearchEngine,
    region,
    setRegion,
    isLoading,
    results,
    trackPositions
  } = usePositionTracker();

  const handleFormSubmit = async (formData: any) => {
    // Update state with form values
    setDomain(formData.domain);
    
    // Ensure we cast the searchEngine value to the correct type
    const engineValue = formData.searchEngine as "google" | "yandex" | "mailru" | "all";
    setSearchEngine(engineValue);
    
    // There's a mismatch between what the form provides (a string like 'ru')
    // and what usePositionTracker's setRegion expects (one of the search engine values)
    // We need to map the region string to one of the allowed values
    
    // First, determine the appropriate search engine value based on the region
    let regionAsEngine: "google" | "yandex" | "mailru" | "all" = "all";
    
    // We can implement a simple mapping based on region value
    // This is a workaround until the usePositionTracker hook is updated
    if (formData.region) {
      if (formData.region.includes("ru") || formData.region === "Россия") {
        regionAsEngine = "yandex"; // For Russian regions, use Yandex
      } else if (formData.region.includes("global")) {
        regionAsEngine = "all"; // For global, use all engines
      } else {
        regionAsEngine = "google"; // Default to Google for other regions
      }
    }
    
    // Now we can safely pass the properly typed value to setRegion
    setRegion(regionAsEngine);
    
    // Run the position check
    const trackResult = await trackPositions();
    
    // If we have results, pass them to parent component
    if (results) {
      onSearchComplete(results);
    }
  };

  return (
    <>
      <TabsContent value="search" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <PositionTrackerForm 
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              defaultValues={{
                domain,
                keywords,
                searchEngine,
                region
              }}
              onAddKeyword={addKeyword}
              onRemoveKeyword={removeKeyword}
              setKeywords={setKeywords}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="results">
        <Card>
          <CardContent className="pt-6">
            <PositionTrackerResults data={searchResults || results} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history">
        <PositionTrackerHistory />
      </TabsContent>
      
      <TabsContent value="tools">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Инструменты для анализа позиций</h3>
            <p className="text-muted-foreground">
              Дополнительные инструменты для работы с данными о позициях сайта будут доступны в ближайшем обновлении.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default TrackerContent;
