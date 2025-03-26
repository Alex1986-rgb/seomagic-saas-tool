
import React from 'react';
import { ArrowDown, ArrowUp, Download, ExternalLink, Share } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ScoreGauge from './ScoreGauge';

interface AuditSummaryProps {
  url: string;
  score: number;
  date: string;
  issues: {
    critical: number;
    important: number;
    opportunities: number;
  };
}

const AuditSummary: React.FC<AuditSummaryProps> = ({ url, score, date, issues }) => {
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
        
        <div className="flex justify-center">
          <ScoreGauge score={score} size={140} />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-red-500/10 rounded-lg">
            <span className="font-medium">Критические ошибки</span>
            <span className="font-bold flex items-center">
              {issues.critical} <ArrowUp className="h-4 w-4 ml-1 text-red-500" />
            </span>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-amber-500/10 rounded-lg">
            <span className="font-medium">Важные улучшения</span>
            <span className="font-bold flex items-center">
              {issues.important} <ArrowDown className="h-4 w-4 ml-1 text-amber-500" />
            </span>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-green-500/10 rounded-lg">
            <span className="font-medium">Возможности</span>
            <span className="font-bold">{issues.opportunities}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3 justify-center md:justify-end">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Скачать PDF
        </Button>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Поделиться
        </Button>
        <Button size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          Оптимизировать сайт
        </Button>
      </div>
    </div>
  );
};

export default AuditSummary;
