
import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-20">
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-[#0EA5E9]/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-[#F97316]/20 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default Background;
