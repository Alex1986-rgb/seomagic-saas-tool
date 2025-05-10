
import React, { useState } from 'react';
import { generateRandomPageCount, generateMockOptimizationItems, calculateTotalCost } from './mockOptimizationData';
import OptimizationCost from './OptimizationCost';

const DemonstrationCost: React.FC = () => {
  // Генерируем демонстрационные данные
  const pageCount = generateRandomPageCount();
  const optimizationItems = generateMockOptimizationItems(pageCount);
  const optimizationCost = calculateTotalCost(optimizationItems);
  const demoUrl = 'example.com';
  
  return (
    <div className="space-y-6">
      <OptimizationCost
        url={demoUrl}
        pageCount={pageCount}
        optimizationCost={optimizationCost}
        optimizationItems={optimizationItems}
      />
    </div>
  );
};

export default DemonstrationCost;
