
import React from 'react';
import AnimatedGrowthChart from './AnimatedGrowthChart';
import { motion } from 'framer-motion';
import { LineChart, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GrowthVisualizationProps {
  beforeAfterData: {
    performance: { category: string; before: number; after: number }[];
    seo: { category: string; before: number; after: number }[];
    overview: { category: string; before: number; after: number }[];
  };
}

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
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Рост показателей после оптимизации</h2>
        <p className="text-muted-foreground">
          Визуализация изменений ключевых метрик до и после выполнения рекомендаций
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="mb-6 grid grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Общий обзор</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>SEO метрики</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Производительность</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <AnimatedGrowthChart 
            title="Общий рост показателей" 
            data={beforeAfterData.overview}
            chartType="bar"
          />
        </TabsContent>
        
        <TabsContent value="seo">
          <AnimatedGrowthChart 
            title="Рост SEO метрик" 
            data={beforeAfterData.seo}
            chartType="area"
          />
        </TabsContent>
        
        <TabsContent value="performance">
          <AnimatedGrowthChart 
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
