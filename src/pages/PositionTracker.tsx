
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TrackerHeader from '@/components/position-tracker/components/TrackerHeader';
import TrackerContent from '@/components/position-tracker/components/TrackerContent';

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
          <TrackerHeader 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          <TrackerContent 
            activeTab={activeTab}
            searchResults={searchResults}
            onSearchComplete={handleSearchComplete}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PositionTracker;
