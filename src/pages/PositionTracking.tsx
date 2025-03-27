
import React from 'react';
import ClientPositionTracker from '@/components/client/ClientPositionTracker';

const PositionTracking: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Отслеживание позиций</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Отслеживайте позиции вашего сайта в поисковых системах
        </p>
        
        <ClientPositionTracker />
      </div>
    </div>
  );
};

export default PositionTracking;
