
import React from 'react';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';

interface AuditMainProps {
  url: string;
  auditData: AuditData;
  recommendations: RecommendationData;
  historyData: AuditHistoryData;
  taskId: string;
  onSelectAudit: (auditId: string) => void;
}

const AuditMain: React.FC<AuditMainProps> = ({
  url,
  auditData,
  recommendations,
  historyData,
  taskId,
  onSelectAudit
}) => {
  return (
    <div className="neo-card p-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Общие результаты аудита</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="stat-card">
            <h3>Общий балл</h3>
            <p className="text-2xl font-bold">{auditData.score}/100</p>
          </div>
          
          <div className="stat-card">
            <h3>Проблемы</h3>
            <p className="text-2xl font-bold">
              {auditData.issues.critical.length + auditData.issues.important.length}
            </p>
          </div>
          
          <div className="stat-card">
            <h3>Страницы</h3>
            <p className="text-2xl font-bold">{auditData.pageCount}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Рекомендации</h3>
          <div className="space-y-4">
            {recommendations.critical.map((rec, index) => (
              <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-medium text-red-700 dark:text-red-300">{rec.title}</h4>
                <p className="text-sm text-red-600 dark:text-red-200">{rec.description}</p>
              </div>
            ))}
            
            {recommendations.important.map((rec, index) => (
              <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-medium text-yellow-700 dark:text-yellow-300">{rec.title}</h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-200">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditMain;
