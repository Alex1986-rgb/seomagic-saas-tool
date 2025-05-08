
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, AlertCircle, ArrowUp } from 'lucide-react';

interface AuditSummaryReportProps {
  url: string;
  auditData: any;
  recommendations: any;
}

const AuditSummaryReport: React.FC<AuditSummaryReportProps> = ({ url, auditData, recommendations }) => {
  const criticalCount = recommendations.critical?.length || 0;
  const importantCount = recommendations.important?.length || 0;
  const opportunitiesCount = recommendations.opportunities?.length || 0;
  const totalIssues = criticalCount + importantCount + opportunitiesCount;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Общий отчет по аудиту</h2>
        <p className="text-muted-foreground">
          Отчет о SEO аудите сайта <span className="font-medium text-foreground">{url}</span> содержит комплексный анализ основных параметров SEO и рекомендации по улучшению позиций в поисковых системах.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Общий SEO-скор</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className={`text-3xl font-bold ${getScoreColor(auditData.score)}`}>{auditData.score}</span>
              <span className="text-lg text-muted-foreground ml-1">/100</span>
            </div>
            <Progress 
              value={auditData.score} 
              className={`h-2 mt-2 ${getProgressColor(auditData.score)}`} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Обнаружено проблем</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{totalIssues}</div>
            <div className="flex flex-wrap gap-2">
              {criticalCount > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {criticalCount} критических
                </Badge>
              )}
              {importantCount > 0 && (
                <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-500">
                  <AlertTriangle className="h-3 w-3" /> {importantCount} важных
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Изучено страниц</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{auditData.pageCount || 0}</div>
            <div className="text-sm text-muted-foreground mt-1">
              страниц просканировано
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Потенциальный рост</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-3xl font-bold text-green-500">
              <ArrowUp className="mr-1 h-5 w-5" />
              {auditData.potentialScoreIncrease || "+25"}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              после оптимизации
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Основные параметры</h3>
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <tbody>
                  {[
                    { label: "Индексация", value: auditData.details?.indexation?.status || "Доступен для индексации", 
                      status: "success" },
                    { label: "Скорость загрузки", value: `${auditData.details?.performance?.loadTime || "2.3"}с`, 
                      status: auditData.details?.performance?.score >= 70 ? "success" : "warning" },
                    { label: "Мобильная версия", value: auditData.details?.mobile?.status || "Адаптивный дизайн", 
                      status: auditData.details?.mobile?.score >= 70 ? "success" : "warning" },
                    { label: "SSL/HTTPS", value: auditData.details?.security?.https ? "Установлен" : "Отсутствует", 
                      status: auditData.details?.security?.https ? "success" : "error" },
                    { label: "Sitemap", value: auditData.details?.sitemap?.exists ? "Присутствует" : "Отсутствует", 
                      status: auditData.details?.sitemap?.exists ? "success" : "warning" },
                  ].map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-3 px-4 text-sm">{item.label}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-medium">{item.value}</span>
                          {item.status === "success" && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {item.status === "warning" && (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                          {item.status === "error" && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Основные проблемы</h3>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {[
                  ...(recommendations.critical?.slice(0, 2) || []).map((rec: string) => ({
                    text: rec,
                    type: 'critical'
                  })),
                  ...(recommendations.important?.slice(0, 3) || []).map((rec: string) => ({
                    text: rec,
                    type: 'important'
                  }))
                ].map((item, index) => (
                  <li key={index} className="py-3 px-4 flex gap-2 items-start">
                    {item.type === 'critical' ? (
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{item.text}</span>
                  </li>
                ))}
                
                {(!recommendations.critical || recommendations.critical.length === 0) && 
                 (!recommendations.important || recommendations.important.length === 0) && (
                  <li className="py-6 px-4 text-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">Критических проблем не обнаружено</p>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-primary/5 p-4 rounded-lg mt-4">
        <h3 className="text-lg font-medium mb-2">Следующие шаги</h3>
        <p className="mb-3">
          Для улучшения SEO показателей сайта рекомендуется:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Изучите список всех обнаруженных проблем на вкладке "Ошибки"</li>
          <li>Ознакомьтесь с детальными рекомендациями на вкладке "Рекомендации"</li>
          <li>Просмотрите результаты анализа отдельных страниц на вкладке "Анализ страниц"</li>
          <li>Запустите процесс автоматической оптимизации на вкладке "Оптимизация"</li>
        </ol>
      </div>
    </div>
  );
};

export default AuditSummaryReport;
