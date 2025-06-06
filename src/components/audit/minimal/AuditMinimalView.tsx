
import React from 'react';
import { motion } from 'framer-motion';
import AuditTabs from '@/components/audit/AuditTabs';
import AuditRecommendations from '@/components/audit/AuditRecommendations';
import AuditShareResults from '@/components/audit/share/AuditShareResults';
import AuditComments from '@/components/audit/comments/AuditComments';
import AuditHistory from '@/components/audit/AuditHistory';
import AuditDataVisualizer from '@/components/audit/data-visualization/AuditDataVisualizer';
import AuditComparison from '@/components/audit/comparison/AuditComparison';
import GrowthVisualization from '@/components/audit/data-visualization/GrowthVisualization';
import { AuditData, AuditHistoryData, RecommendationData } from '@/types/audit';

interface AuditMinimalViewProps {
  auditData: AuditData;
  historyData?: AuditHistoryData | null;
  url: string;
  urls?: string[];
  taskId?: string | null;
  handleSelectHistoricalAudit: (auditId: string) => void;
}

const AuditMinimalView: React.FC<AuditMinimalViewProps> = ({
  auditData,
  historyData,
  url,
  urls,
  taskId,
  handleSelectHistoricalAudit
}) => {
  const renderWithAnimation = (component: React.ReactNode, delay: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {component}
    </motion.div>
  );

  const showGrowthVisualization = auditData.previousScore !== undefined || 
    (historyData && historyData.items?.length > 1);

  // Sample data for growth visualization
  const growthData = {
    overview: [
      { category: 'Общий балл', before: auditData.previousScore || 65, after: auditData.score },
      { category: 'SEO', before: auditData.details?.seo?.previousScore || 60, after: auditData.details?.seo?.score },
      { category: 'Производительность', before: auditData.details?.performance?.previousScore || 55, after: auditData.details?.performance?.score },
      { category: 'Контент', before: auditData.details?.content?.previousScore || 70, after: auditData.details?.content?.score },
      { category: 'Технические аспекты', before: auditData.details?.technical?.previousScore || 45, after: auditData.details?.technical?.score },
    ],
    seo: [
      { category: 'Meta-теги', before: 55, after: 85 },
      { category: 'Ключевые слова', before: 60, after: 80 },
      { category: 'Структура URL', before: 70, after: 90 },
      { category: 'Внутренние ссылки', before: 50, after: 75 },
      { category: 'Внешние ссылки', before: 65, after: 85 },
    ],
    performance: [
      { category: 'Время загрузки', before: 45, after: 75 },
      { category: 'Размер страницы', before: 50, after: 80 },
      { category: 'Кеширование', before: 60, after: 90 },
      { category: 'Мобильная оптимизация', before: 55, after: 85 },
      { category: 'Core Web Vitals', before: 40, after: 70 },
    ]
  };

  return (
    <div className="space-y-6">
      {historyData && historyData.items?.length > 1 && 
        renderWithAnimation(
          <AuditHistory 
            historyItems={historyData.items} 
            onSelectAudit={handleSelectHistoricalAudit}
          />, 
          0.1
        )
      }
      
      {renderWithAnimation(
        <AuditDataVisualizer auditData={auditData.details} />, 
        0.15
      )}
      
      {showGrowthVisualization && 
        renderWithAnimation(
          <GrowthVisualization beforeAfterData={growthData} />,
          0.2
        )
      }
      
      {historyData && historyData.items?.length > 1 && 
        renderWithAnimation(
          <AuditComparison 
            currentAudit={auditData} 
            historyItems={historyData.items} 
          />, 
          0.25
        )
      }
      
      {renderWithAnimation(
        <AuditTabs details={auditData.details} />, 
        0.3
      )}
      
      {renderWithAnimation(
        <AuditComments auditId={auditData.id} />, 
        0.35
      )}
      
      {renderWithAnimation(
        <AuditShareResults 
          auditId={auditData.id} 
          auditData={auditData}
          url={url}
          historyItems={historyData?.items}
          urls={urls}
          taskId={taskId}
        />, 
        0.4
      )}
    </div>
  );
};

export default AuditMinimalView;
