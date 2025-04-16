
import React from 'react';
import { BarChart } from 'lucide-react';

export type Issue = {
  name: string;
  count: number;
  severity: "high" | "medium" | "low";
};

interface EstimateIssuesListProps {
  issues: Issue[];
}

const EstimateIssuesList: React.FC<EstimateIssuesListProps> = ({ issues }) => {
  const getSeverityColor = (severity: Issue['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityName = (severity: Issue['severity']) => {
    switch (severity) {
      case 'high': return 'Критичная';
      case 'medium': return 'Средняя';
      case 'low': return 'Низкая';
      default: return 'Неизвестная';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Выявленные проблемы</h3>
        <BarChart className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        {issues.map((issue, index) => (
          <div 
            key={index} 
            className="p-3 bg-muted/50 rounded-md flex justify-between items-center"
          >
            <div className="flex-1">
              <div className="font-medium">{issue.name}</div>
              <div className={`text-sm ${getSeverityColor(issue.severity)}`}>
                {getSeverityName(issue.severity)} проблема
              </div>
            </div>
            <div className="text-xl font-bold">{issue.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstimateIssuesList;
