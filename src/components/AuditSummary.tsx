
import React from 'react';
import ScoreGauge from './ScoreGauge';
import { motion } from 'framer-motion';
import { ScoreTrend, IssuesSummary, ActionButtons } from './audit/summary';

interface AuditSummaryProps {
  url: string;
  score: number;
  date: string;
  issues: {
    critical: number;
    important: number;
    opportunities: number;
  };
  previousScore?: number;
  auditData?: any; // Full audit data if available
}

const AuditSummary: React.FC<AuditSummaryProps> = ({ 
  url, 
  score, 
  date, 
  issues, 
  previousScore,
  auditData 
}) => {
  return (
    <div className="neo-card p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold mb-2">Результаты аудита</h2>
          <p className="text-muted-foreground mb-2">{url}</p>
          <p className="text-sm text-muted-foreground">
            Анализ завершен: {new Date(date).toLocaleString('ru-RU')}
          </p>
        </div>
        
        <div className="flex justify-center relative">
          <ScoreGauge score={score} size={140} />
          <ScoreTrend currentScore={score} previousScore={previousScore} />
        </div>
        
        <IssuesSummary issues={issues} />
      </div>
      
      <ActionButtons auditData={auditData} url={url} />
    </div>
  );
};

export default AuditSummary;
