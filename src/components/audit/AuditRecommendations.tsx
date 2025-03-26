
import React from 'react';

interface RecommendationData {
  critical: string[];
  important: string[];
  opportunities: string[];
}

interface AuditRecommendationsProps {
  recommendations: RecommendationData;
}

const AuditRecommendations: React.FC<AuditRecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="neo-card p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Рекомендации по оптимизации</h2>
      <div className="space-y-4">
        <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
          <h3 className="font-medium">Критические ошибки</h3>
          <ul className="mt-2 space-y-2">
            {recommendations.critical.map((item, index) => (
              <li key={`critical-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded">
          <h3 className="font-medium">Важные улучшения</h3>
          <ul className="mt-2 space-y-2">
            {recommendations.important.map((item, index) => (
              <li key={`important-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
          <h3 className="font-medium">Возможности для улучшения</h3>
          <ul className="mt-2 space-y-2">
            {recommendations.opportunities.map((item, index) => (
              <li key={`opportunities-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuditRecommendations;
