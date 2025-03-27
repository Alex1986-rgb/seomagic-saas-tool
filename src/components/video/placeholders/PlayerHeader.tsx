
import React from 'react';

const PlayerHeader: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-10 bg-black/50 flex items-center px-4 z-20">
      <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <div className="text-xs text-white/70 ml-4 font-medium">SeoMarket - Демонстрация платформы</div>
    </div>
  );
};

export default PlayerHeader;
