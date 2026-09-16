
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
  const seoData = beforeAfterData.seo ?? [];
  const performanceData = beforeAfterData.performance ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <GrowthHeader />
      
      <Tabs defaultValue="overview" className="mt-6">
        <GrowthTabs hasSeo={seoData.length > 0} hasPerformance={performanceData.length > 0} />
        
        <TabsContent value="overview">
          <TabContent 
            title="Общий рост показателей" 
            data={beforeAfterData.overview}
            chartType="bar"
          />
        </TabsContent>
        
        {seoData.length > 0 && (
          <TabsContent value="seo">
            <TabContent
              title="Рост SEO метрик"
              data={seoData}
              chartType="area"
            />
          </TabsContent>
        )}

        {performanceData.length > 0 && (
          <TabsContent value="performance">
            <TabContent
              title="Улучшение производительности"
              data={performanceData}
              chartType="area"
            />
          </TabsContent>
        )}
      </Tabs>
    </motion.div>
  );
};

export default GrowthVisualization;
