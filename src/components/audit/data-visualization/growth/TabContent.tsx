
import React from 'react';
import AnimatedGrowthChart from '../AnimatedGrowthChart';
import { TabContentProps } from './types';

const TabContent: React.FC<TabContentProps> = ({ data, title, chartType }) => {
  return (
    <AnimatedGrowthChart 
      title={title} 
      data={data}
      chartType={chartType}
    />
  );
};

export default TabContent;
