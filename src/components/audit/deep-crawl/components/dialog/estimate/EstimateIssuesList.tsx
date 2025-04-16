
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface Issue {
  name: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
}

interface EstimateIssuesListProps {
  issues: Issue[];
}

const EstimateIssuesList: React.FC<EstimateIssuesListProps> = ({ issues }) => {
  return (
    <div className="overflow-y-auto max-h-40 pr-2">
      <h4 className="font-medium mb-2 text-sm">Выявленные проблемы</h4>
      <ul className="space-y-2">
        {issues.map((issue, index) => (
          <li key={index} className="flex justify-between items-center text-sm border-b border-border pb-1">
            <span>{issue.name}</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  issue.severity === 'high' ? 'destructive' : 
                  issue.severity === 'medium' ? 'default' : 'outline'
                }
                className="text-xs"
              >
                {issue.count}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EstimateIssuesList;
