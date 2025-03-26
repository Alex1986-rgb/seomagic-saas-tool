
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditCategoryData } from '@/types/audit';
import { prepareScoreData, prepareIssuesData } from './utils/dataPreparation';
import ScoresBarChart from './components/ScoresBarChart';
import IssuesPieChart from './components/IssuesPieChart';
import TrendsAreaChart from './components/TrendsAreaChart';

interface AuditDataVisualizerProps {
  auditData: {
    seo: AuditCategoryData;
    performance: AuditCategoryData;
    content: AuditCategoryData;
    technical: AuditCategoryData;
  };
}

const AuditDataVisualizer: React.FC<AuditDataVisualizerProps> = ({ auditData }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="neo-card p-6 mb-8">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Визуализация данных аудита
          {expanded ? 
            <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          }
        </h2>
      </div>

      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="bars" className="mt-4">
          <TabsList className="mb-4 grid grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="bars" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              <span>Оценки</span>
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Проблемы</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span>Тренды</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bars" className="mt-2">
            <ScoresBarChart data={prepareScoreData(auditData)} />
          </TabsContent>

          <TabsContent value="pie" className="mt-2">
            <IssuesPieChart data={prepareIssuesData(auditData)} />
          </TabsContent>

          <TabsContent value="line" className="mt-2">
            <TrendsAreaChart auditData={auditData} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AuditDataVisualizer;
