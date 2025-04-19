
import React from 'react';

const MapCard = () => {
  return (
    <div className="rounded-lg overflow-hidden h-48 neo-card">
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Карта загружается...</p>
          <p className="text-sm text-primary mt-2">Интерактивная карта проезда</p>
        </div>
      </div>
    </div>
  );
};

export default MapCard;
