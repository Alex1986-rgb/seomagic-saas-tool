
import React from 'react';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <CardContent className="p-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Общие результаты аудита</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border">
              <h3 className="text-muted-foreground mb-1">Общий балл</h3>
              <p className="text-2xl font-bold">{auditData.score}/100</p>
            </div>
            
            <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border">
              <h3 className="text-muted-foreground mb-1">Проблемы</h3>
              <p className="text-2xl font-bold">
                {auditData.issues.critical.length + auditData.issues.important.length}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border">
              <h3 className="text-muted-foreground mb-1">Страницы</h3>
              <p className="text-2xl font-bold">{auditData.pageCount}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Рекомендации</h3>
            <div className="space-y-4">
              {recommendations.critical.length > 0 && (
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium mb-3">
                    <AlertCircle className="h-5 w-5" />
                    Критические проблемы
                  </h4>
                  <div className="space-y-3">
                    {recommendations.critical.map((rec, index) => (
                      <div key={index} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                        <p className="text-red-400">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {recommendations.important.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium mb-3">
                    <AlertTriangle className="h-5 w-5" />
                    Важные рекомендации
                  </h4>
                  <div className="space-y-3">
                    {recommendations.important.map((rec, index) => (
                      <div key={index} className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.critical.length === 0 && recommendations.important.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Проблем не обнаружено. Сайт соответствует основным рекомендациям SEO.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditMain;
