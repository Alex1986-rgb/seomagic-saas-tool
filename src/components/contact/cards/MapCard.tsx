
import React from 'react';
import { MapPin } from 'lucide-react';

const MapCard = () => {
  return (
    <div className="rounded-lg overflow-hidden h-48 neo-card">
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <div className="text-center px-4">
          <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="font-medium">Москва, ул. Примерная, 1</p>
          <p className="text-sm text-muted-foreground mt-1">БЦ «Пример», офис 100</p>
        </div>
      </div>
    </div>
  );
};

export default MapCard;
