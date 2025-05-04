
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PositionTrackerForm } from '@/components/position-tracker/PositionTrackerForm';
import { PositionTrackerResults } from '@/components/position-tracker/PositionTrackerResults';
import { PositionTrackerAnalytics } from '@/components/position-tracker/PositionTrackerAnalytics';
import { PositionTrackerHistory } from '@/components/position-tracker/PositionTrackerHistory';

// Mock data for position tracker results
const mockResults = {
  domain: 'example.com',
  keywords: [
    { keyword: 'seo audit', position: 3, previousPosition: 5, change: 2 },
    { keyword: 'website optimization', position: 7, previousPosition: 10, change: 3 },
    { keyword: 'seo tools', position: 12, previousPosition: 15, change: 3 }
  ],
  date: new Date().toISOString(),
  searchEngine: 'Google'
};

const PositionTrackerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Отслеживание позиций | SeoMarket</title>
        <meta name="description" content="Мониторинг позиций сайта в поисковых системах по ключевым словам" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Отслеживание позиций в поисковых системах</h1>
        
        <div className="space-y-8">
          <PositionTrackerForm />
          <PositionTrackerResults results={mockResults} />
          <PositionTrackerAnalytics />
          <PositionTrackerHistory />
        </div>
      </div>
    </>
  );
};

export default PositionTrackerPage;
