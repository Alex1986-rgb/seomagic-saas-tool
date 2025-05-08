
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuditErrorAnalysisProps {
  auditData: any;
  recommendations: any;
}

const AuditErrorAnalysis: React.FC<AuditErrorAnalysisProps> = ({ auditData, recommendations }) => {
  // Extract different issue types from recommendations
  const criticalIssues = recommendations.critical || [];
  const importantIssues = recommendations.important || [];
  const opportunities = recommendations.opportunities || [];
  const passed = recommendations.passed || [];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Анализ ошибок</h2>
        <p className="text-muted-foreground mb-6">
          Подробный отчет об ошибках, выявленных в ходе SEO аудита сайта. Ошибки разделены на категории по степени влияния на поисковое продвижение.
        </p>
        
        <Tabs defaultValue="critical" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="critical" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Критические</span>
              <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full px-2 py-0.5 text-xs font-medium ml-auto">
                {criticalIssues.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="important" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Важные</span>
              <span className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-full px-2 py-0.5 text-xs font-medium ml-auto">
                {importantIssues.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Рекомендации</span>
              <span className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full px-2 py-0.5 text-xs font-medium ml-auto">
                {opportunities.length + passed.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="critical" className="m-0">
            <div className="rounded-md overflow-hidden border border-red-200 dark:border-red-900">
              <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3">
                <h3 className="text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Критические ошибки
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                  Серьезно влияют на SEO и требуют немедленного исправления
                </p>
              </div>
              
              {criticalIssues.length > 0 ? (
                <ul className="divide-y">
                  {criticalIssues.map((issue: string, index: number) => (
                    <li key={index} className="p-4 bg-white dark:bg-card text-sm flex items-start gap-3">
                      <div className="min-w-5">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p>{issue}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center bg-white dark:bg-card">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">Критических ошибок не обнаружено</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-secondary/10 rounded-md">
              <h4 className="font-medium mb-2">Примеры критических ошибок</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Отсутствие HTTPS-протокола</li>
                <li>Страницы с кодами ошибок 4xx и 5xx</li>
                <li>Битые ссылки на странице</li>
                <li>Отсутствие или дублирование тегов title/description</li>
                <li>Блокировка индексации важных страниц</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="important" className="m-0">
            <div className="rounded-md overflow-hidden border border-amber-200 dark:border-amber-900">
              <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
                <h3 className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Важные улучшения
                </h3>
                <p className="text-amber-600 dark:text-amber-300 text-sm mt-1">
                  Значительно повышают эффективность сайта
                </p>
              </div>
              
              {importantIssues.length > 0 ? (
                <ul className="divide-y">
                  {importantIssues.map((issue: string, index: number) => (
                    <li key={index} className="p-4 bg-white dark:bg-card text-sm flex items-start gap-3">
                      <div className="min-w-5">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p>{issue}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center bg-white dark:bg-card">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">Важных улучшений не требуется</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-secondary/10 rounded-md">
              <h4 className="font-medium mb-2">Примеры важных улучшений</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Проблемы со структурой заголовков H1-H6</li>
                <li>Отсутствие alt-текстов у изображений</li>
                <li>Проблемы с индексацией отдельных разделов</li>
                <li>Слишком длинные или короткие мета-теги</li>
                <li>Некорректные канонические URL</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="opportunities" className="m-0">
            <div className="rounded-md overflow-hidden border border-green-200 dark:border-green-900">
              <div className="bg-green-50 dark:bg-green-900/20 px-4 py-3">
                <h3 className="text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Рекомендации и возможности улучшения
                </h3>
                <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                  Дополнительные возможности для оптимизации сайта
                </p>
              </div>
              
              {opportunities.length > 0 ? (
                <ul className="divide-y">
                  {[...opportunities, ...passed].map((issue: string, index: number) => (
                    <li key={index} className="p-4 bg-white dark:bg-card text-sm flex items-start gap-3">
                      <div className="min-w-5">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-xs">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p>{issue}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center bg-white dark:bg-card">
                  <AlertCircle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">Не найдено дополнительных возможностей</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-secondary/10 rounded-md">
              <h4 className="font-medium mb-2">Примеры возможностей для улучшения</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Оптимизация скорости загрузки страниц</li>
                <li>Улучшение мобильной версии сайта</li>
                <li>Добавление структурированных данных schema.org</li>
                <li>Оптимизация контента и плотности ключевых слов</li>
                <li>Улучшение внутренней перелинковки</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuditErrorAnalysis;
