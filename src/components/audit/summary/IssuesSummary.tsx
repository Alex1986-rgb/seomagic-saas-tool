
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface IssuesSummaryProps {
  issues: {
    critical: number;
    important: number;
    opportunities: number;
  };
}

const IssuesSummary: React.FC<IssuesSummaryProps> = ({ issues }) => {
  return (
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
  );
};

export default IssuesSummary;
