
import React from 'react';
import { Search } from 'lucide-react';
import { PositionTrackerForm } from '@/components/position-tracker/PositionTrackerForm';
import { PositionTrackerResults } from '@/components/position-tracker/PositionTrackerResults';
import { PositionTrackerHistory } from '@/components/position-tracker/PositionTrackerHistory';

interface TrackerContentProps {
  activeTab: string;
  searchResults: any;
  onSearchComplete: (results: any) => void;
}

const TrackerContent: React.FC<TrackerContentProps> = ({ 
  activeTab, 
  searchResults, 
  onSearchComplete 
}) => {
  return (
    <div className="neo-card p-3 sm:p-4 md:p-6">
      {activeTab === "search" && (
        <PositionTrackerForm onSearchComplete={onSearchComplete} />
      )}
      
      {activeTab === "results" && (
        searchResults ? (
          <PositionTrackerResults results={searchResults} />
        ) : (
          <div className="text-center py-8 md:py-12">
            <Search className="h-10 w-10 md:h-16 md:w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg md:text-xl font-medium mb-2">Нет данных для отображения</h3>
            <p className="text-sm md:text-base text-muted-foreground px-4">
              Запустите проверку позиций во вкладке "Проверка позиций", чтобы увидеть результаты
            </p>
          </div>
        )
      )}
      
      {activeTab === "history" && (
        <PositionTrackerHistory />
      )}
    </div>
  );
};

export default TrackerContent;
