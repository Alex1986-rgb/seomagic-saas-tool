
import React from 'react';
import { motion } from 'framer-motion';
import AuditTabs from '../AuditTabs';
import AuditRecommendations from '../AuditRecommendations';
import AuditShareResults from '../share/AuditShareResults';
import AuditComments from '../comments/AuditComments';
import AuditHistory from '../AuditHistory';
import AuditDataVisualizer from '../data-visualization/AuditDataVisualizer';
import AuditComparison from '../comparison/AuditComparison';
import GrowthVisualization from '../data-visualization/GrowthVisualization';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';

interface AuditContentProps {
  auditData: AuditData;
  recommendations: RecommendationData;
  historyData: AuditHistoryData | null;
  url: string;
  onSelectAudit: (auditId: string) => void;
  urls?: string[];
  taskId?: string | null;
}

const AuditContent: React.FC<AuditContentProps> = ({ 
  auditData, 
  recommendations, 
  historyData, 
  url,
  onSelectAudit,
  urls,
  taskId
}) => {
  // Sample data for growth visualization
  const growthData = {
    overview: [
      { category: 'Общий балл', before: auditData.previousScore || 65, after: auditData.score },
      { category: 'SEO', before: auditData.details.seo.previousScore || 60, after: auditData.details.seo.score },
      { category: 'Производительность', before: auditData.details.performance.previousScore || 55, after: auditData.details.performance.score },
      { category: 'Контент', before: auditData.details.content.previousScore || 70, after: auditData.details.content.score },
      { category: 'Технические аспекты', before: auditData.details.technical.previousScore || 45, after: auditData.details.technical.score },
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
    historyData?.items?.length > 1;

  return (
    <>
      {historyData && historyData.items.length > 1 && 
        renderWithAnimation(
          <AuditHistory 
            historyItems={historyData.items} 
            onSelectAudit={onSelectAudit}
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
      
      {historyData && historyData.items.length > 1 && 
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
        <AuditRecommendations recommendations={recommendations} />, 
        0.35
      )}
      
      {renderWithAnimation(
        <AuditComments auditId={auditData.id} />, 
        0.4
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
        0.45
      )}
    </>
  );
};

export default AuditContent;
