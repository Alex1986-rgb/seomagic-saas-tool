
import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SecurityIssue {
  type: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

interface SecurityAnalysisProps {
  url: string;
  issues: SecurityIssue[];
}

export const SecurityAnalysis: React.FC<SecurityAnalysisProps> = ({
  url,
  issues
}) => {
  const getIssueIcon = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Анализ безопасности
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
              {getIssueIcon(issue.type)}
              <div>
                <p className="font-medium">{issue.description}</p>
                <p className="text-sm text-muted-foreground mt-1">{issue.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
