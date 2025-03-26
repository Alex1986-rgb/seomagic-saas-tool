
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { GrowthVisualizationProps } from './types';
import GrowthHeader from './GrowthHeader';
import GrowthTabs from './GrowthTabs';
import TabContent from './TabContent';

const GrowthVisualization: React.FC<GrowthVisualizationProps> = ({
  beforeAfterData
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <GrowthHeader />
      
      <Tabs defaultValue="overview" className="mt-6">
        <GrowthTabs />
        
        <TabsContent value="overview">
          <TabContent 
            title="Общий рост показателей" 
            data={beforeAfterData.overview}
            chartType="bar"
          />
        </TabsContent>
        
        <TabsContent value="seo">
          <TabContent 
            title="Рост SEO метрик" 
            data={beforeAfterData.seo}
            chartType="area"
          />
        </TabsContent>
        
        <TabsContent value="performance">
          <TabContent 
            title="Улучшение производительности" 
            data={beforeAfterData.performance}
            chartType="area"
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GrowthVisualization;
