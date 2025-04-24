import React from 'react';
import { motion } from 'framer-motion';
import { ChartContainer } from './components/ChartContainer';
import { ScoresBarChart } from './components/ScoresBarChart';
import { TrendsAreaChart } from './components/TrendsAreaChart';
import { IssuesPieChart } from './components/IssuesPieChart';
import { AuditDetailsData, CategoryData } from '@/types/audit';

interface AuditDataVisualizerProps {
  auditData: AuditDetailsData;
}

const AuditDataVisualizer: React.FC<AuditDataVisualizerProps> = ({ auditData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        className="neo-card p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChartContainer title="Оценка категорий">
          <ScoresBarChart
            seo={auditData.seo.score}
            performance={auditData.performance.score}
            content={auditData.content.score}
            technical={auditData.technical.score}
            usability={auditData.usability.score}
          />
        </ChartContainer>
      </motion.div>

      <motion.div
        className="neo-card p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ChartContainer title="Тренды изменений">
          <TrendsAreaChart
            seo={auditData.seo.score}
            performance={auditData.performance.score}
            content={auditData.content.score}
            technical={auditData.technical.score}
            usability={auditData.usability.score}
          />
        </ChartContainer>
      </motion.div>

      <motion.div
        className="neo-card p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ChartContainer title="Соотношение проблем">
          <IssuesPieChart
            seo={{ passed: auditData.seo.passed, warning: auditData.seo.warning, failed: auditData.seo.failed }}
            performance={{ passed: auditData.performance.passed, warning: auditData.performance.warning, failed: auditData.performance.failed }}
            content={{ passed: auditData.content.passed, warning: auditData.content.warning, failed: auditData.content.failed }}
            technical={{ passed: auditData.technical.passed, warning: auditData.technical.warning, failed: auditData.technical.failed }}
            usability={{ passed: auditData.usability.passed, warning: auditData.usability.warning, failed: auditData.usability.failed }}
          />
        </ChartContainer>
      </motion.div>
    </div>
  );
};

export default AuditDataVisualizer;
