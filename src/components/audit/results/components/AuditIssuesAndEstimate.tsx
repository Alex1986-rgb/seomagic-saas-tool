
import React from 'react';
import { AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';
import { AuditData } from '@/types/audit';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AuditIssuesAndEstimateProps {
  auditData: AuditData;
  optimizationCost: number;
  optimizationItems: any[]; // Added this prop to match expected usage
}

export const AuditIssuesAndEstimate: React.FC<AuditIssuesAndEstimateProps> = ({ 
  auditData, 
  optimizationCost,
  optimizationItems 
}) => {
  const criticalIssues = Array.isArray(auditData.issues.critical) 
    ? auditData.issues.critical 
    : [];
    
  const importantIssues = Array.isArray(auditData.issues.important) 
    ? auditData.issues.important 
    : [];
    
  const opportunities = Array.isArray(auditData.issues.opportunities) 
    ? auditData.issues.opportunities 
    : [];

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(cost);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            Основные проблемы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Критические ошибки <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full text-xs ml-2">{criticalIssues.length}</span>
            </h3>
            <ul className="space-y-1 text-sm">
              {criticalIssues.map((issue, index) => (
                <li key={`critical-${index}`}>
                  {typeof issue === 'string' ? issue : issue.title}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Важные исправления <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-xs ml-2">{importantIssues.length}</span>
            </h3>
            <ul className="space-y-1 text-sm">
              {importantIssues.map((issue, index) => (
                <li key={`important-${index}`}>
                  {typeof issue === 'string' ? issue : issue.title}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-green-500" />
              Возможности <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-xs ml-2">{opportunities.length}</span>
            </h3>
            <ul className="space-y-1 text-sm">
              {opportunities.map((issue, index) => (
                <li key={`opportunity-${index}`}>
                  {typeof issue === 'string' ? issue : issue.title}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Расчет оптимизации</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-lg font-semibold mb-1">Стоимость оптимизации</p>
              <p className="text-2xl font-bold text-primary">{formatCost(optimizationCost)}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Что входит:</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Исправление всех критических ошибок</li>
                <li>✓ Оптимизация мета-тегов</li>
                <li>✓ Улучшение структуры контента</li>
                <li>✓ Оптимизация {auditData.pageCount || 0} страниц</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditIssuesAndEstimate;
