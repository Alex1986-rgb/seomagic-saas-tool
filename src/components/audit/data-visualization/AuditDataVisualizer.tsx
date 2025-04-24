
import React from 'react';
import { motion } from 'framer-motion';
import ChartContainer from './components/ChartContainer';
import ScoresBarChart from './components/ScoresBarChart';
import TrendsAreaChart from './components/TrendsAreaChart';
import IssuesPieChart from './components/IssuesPieChart';
import { AuditDetailsData } from '@/types/audit';
import { prepareScoreData, prepareIssuesData } from './utils/dataPreparation';

interface AuditDataVisualizerProps {
  auditData: AuditDetailsData;
}

const AuditDataVisualizer: React.FC<AuditDataVisualizerProps> = ({ auditData }) => {
  const scoreData = prepareScoreData(auditData);
  const issuesData = prepareIssuesData(auditData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        className="neo-card p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChartContainer title="Оценка категорий">
          <ScoresBarChart data={scoreData} />
        </ChartContainer>
      </motion.div>

      <motion.div
        className="neo-card p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ChartContainer title="Тренды изменений">
          <TrendsAreaChart auditData={auditData} />
        </ChartContainer>
      </motion.div>

      <motion.div
        className="neo-card p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ChartContainer title="Соотношение проблем">
          <IssuesPieChart data={issuesData} />
        </ChartContainer>
      </motion.div>
    </div>
  );
};

export default AuditDataVisualizer;

