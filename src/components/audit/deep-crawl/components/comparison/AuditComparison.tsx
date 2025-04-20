
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ComparisonData {
  date: string;
  score: number;
  issuesFixed: number;
  totalIssues: number;
}

interface AuditComparisonProps {
  previousAudit: ComparisonData;
  currentAudit: ComparisonData;
}

export const AuditComparison: React.FC<AuditComparisonProps> = ({
  previousAudit,
  currentAudit
}) => {
  const calculateImprovement = (current: number, previous: number) => {
    const improvement = ((current - previous) / previous) * 100;
    return improvement.toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Сравнение результатов аудита</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Предыдущий аудит ({previousAudit.date})</p>
              <Progress value={previousAudit.score} className="h-2" />
              <p className="text-sm font-medium">{previousAudit.score}% оптимизации</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Текущий аудит ({currentAudit.date})</p>
              <Progress value={currentAudit.score} className="h-2" />
              <p className="text-sm font-medium">{currentAudit.score}% оптимизации</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Улучшение оценки:</p>
                <p className="font-medium">
                  {calculateImprovement(currentAudit.score, previousAudit.score)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Исправлено проблем:</p>
                <p className="font-medium">
                  {currentAudit.issuesFixed} из {currentAudit.totalIssues}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
