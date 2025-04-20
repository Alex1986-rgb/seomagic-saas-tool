
import React from 'react';
import { ExtractedSite } from '@/services/audit/contentExtractor/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText, Link2, AlertCircle, CheckCircle } from 'lucide-react';

interface ContentAnalysisResultsProps {
  site: ExtractedSite;
}

const ContentAnalysisResults: React.FC<ContentAnalysisResultsProps> = ({ site }) => {
  // Вычисляем общую статистику
  const calculateStats = () => {
    const pageCount = site.pages.length;
    if (pageCount === 0) return null;
    
    // Средний объем контента
    const avgWordCount = Math.round(
      site.pages.reduce((sum, page) => sum + (page.contentAnalysis?.wordCount || 0), 0) / pageCount
    );
    
    // Средняя читаемость
    const avgReadability = Math.round(
      site.pages.reduce((sum, page) => sum + (page.contentAnalysis?.readabilityScore || 0), 0) / pageCount
    );
    
    // Количество страниц с риском дубликации
    const duplicateRisk = {
      high: site.pages.filter(p => p.contentAnalysis?.duplicateContentRisk === 'high').length,
      medium: site.pages.filter(p => p.contentAnalysis?.duplicateContentRisk === 'medium').length,
      low: site.pages.filter(p => p.contentAnalysis?.duplicateContentRisk === 'low').length,
    };
    
    // Мета-теги
    const missingMeta = {
      description: site.pages.filter(p => !p.meta.description).length,
      keywords: site.pages.filter(p => !p.meta.keywords).length,
    };
    
    // Заголовки
    const headings = {
      missingH1: site.pages.filter(p => !p.headings.h1 || p.headings.h1.length === 0).length,
      multipleH1: site.pages.filter(p => p.headings.h1 && p.headings.h1.length > 1).length,
      missingH2: site.pages.filter(p => !p.headings.h2 || p.headings.h2.length === 0).length,
    };
    
    // Внутренняя перелинковка
    const internalLinks = {
      orphaned: site.pages.filter(p => p.links.internal.length === 0).length,
      tooMany: site.pages.filter(p => p.links.internal.length > 100).length,
      average: Math.round(
        site.pages.reduce((sum, page) => sum + page.links.internal.length, 0) / pageCount
      ),
    };
    
    return {
      avgWordCount,
      avgReadability,
      duplicateRisk,
      missingMeta,
      headings,
      internalLinks,
    };
  };
  
  const stats = calculateStats();
  if (!stats) return <p>Нет данных для анализа</p>;
  
  // Вычисляем общий балл сайта по шкале от 0 до 100
  const calculateOverallScore = () => {
    let score = 0;
    const maxScore = 100;
    
    // Контент (до 30 баллов)
    const contentScore = Math.min(30, Math.round(Math.min(stats.avgWordCount / 25, 20) + 
      Math.min(stats.avgReadability / 10, 10)));
    
    // Мета-теги (до 20 баллов)
    const metaScore = Math.round(20 * (1 - (stats.missingMeta.description / site.pages.length) * 0.7 - 
      (stats.missingMeta.keywords / site.pages.length) * 0.3));
    
    // Заголовки (до 20 баллов)
    const headingsScore = Math.round(20 * (1 - (stats.headings.missingH1 / site.pages.length) * 0.5 - 
      (stats.headings.multipleH1 / site.pages.length) * 0.3 - 
      (stats.headings.missingH2 / site.pages.length) * 0.2));
    
    // Внутренние ссылки (до 30 баллов)
    const linksScore = Math.round(30 * (1 - (stats.internalLinks.orphaned / site.pages.length) * 0.7 - 
      (stats.internalLinks.tooMany / site.pages.length) * 0.3));
    
    score = contentScore + metaScore + headingsScore + linksScore;
    return Math.min(maxScore, Math.max(0, score));
  };
  
  const overallScore = calculateOverallScore();
  
  // Определяем уровень качества на основе оценки
  const getQualityLevel = (score: number) => {
    if (score >= 80) return { level: 'excellent', text: 'Отлично', color: 'text-green-500' };
    if (score >= 60) return { level: 'good', text: 'Хорошо', color: 'text-blue-500' };
    if (score >= 40) return { level: 'average', text: 'Средне', color: 'text-amber-500' };
    return { level: 'poor', text: 'Требует улучшения', color: 'text-red-500' };
  };
  
  const quality = getQualityLevel(overallScore);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <span>Анализ сайта</span>
            <Badge variant={quality.level === 'poor' ? 'destructive' : 'default'} className="ml-2">
              {quality.text}
            </Badge>
          </CardTitle>
          <CardDescription>
            Результаты профессионального аудита для домена {site.domain}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Общая оценка сайта</span>
              <span className={`text-sm font-medium ${quality.color}`}>{overallScore}/100</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-card p-3 rounded-md border">
              <div className="text-sm text-muted-foreground mb-1">Страниц проанализировано</div>
              <div className="text-xl font-semibold">{site.pages.length}</div>
            </div>
            
            <div className="bg-card p-3 rounded-md border">
              <div className="text-sm text-muted-foreground mb-1">Средний объем контента</div>
              <div className="text-xl font-semibold">{stats.avgWordCount} слов</div>
            </div>
            
            <div className="bg-card p-3 rounded-md border">
              <div className="text-sm text-muted-foreground mb-1">Читаемость текста</div>
              <div className="text-xl font-semibold">{stats.avgReadability}/100</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="content">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Контент
          </TabsTrigger>
          <TabsTrigger value="meta">
            <BarChart3 className="h-4 w-4 mr-2" />
            Мета-теги
          </TabsTrigger>
          <TabsTrigger value="structure">
            <AlertCircle className="h-4 w-4 mr-2" />
            Структура
          </TabsTrigger>
          <TabsTrigger value="links">
            <Link2 className="h-4 w-4 mr-2" />
            Ссылки
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Анализ контента</CardTitle>
              <CardDescription>Оценка качества и объема текстового содержимого</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">Объем контента</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Средний объем контента: <span className="font-medium">{stats.avgWordCount} слов</span>
                  </p>
                  <Progress 
                    value={Math.min(100, (stats.avgWordCount / 500) * 100)} 
                    className="h-2" 
                  />
                  <p className="text-xs mt-2">
                    {stats.avgWordCount < 300 ? 
                      "⚠️ Рекомендуется увеличить объем контента." : 
                      "✅ Хороший объем контента на страницах."}
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">Риск дублированного контента</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Высокий риск:</span>
                      <Badge variant="destructive">{stats.duplicateRisk.high} стр.</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Средний риск:</span>
                      <Badge variant="outline" className="bg-amber-100">{stats.duplicateRisk.medium} стр.</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Низкий риск:</span>
                      <Badge variant="outline" className="bg-green-100">{stats.duplicateRisk.low} стр.</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Рекомендации по контенту</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {stats.avgWordCount < 300 && (
                    <li>Увеличьте объем контента до 300-500 слов на страницу</li>
                  )}
                  {stats.avgReadability < 50 && (
                    <li>Улучшите читаемость текста, используйте более короткие предложения</li>
                  )}
                  {stats.duplicateRisk.high > 0 && (
                    <li>Устраните дублированный контент на {stats.duplicateRisk.high} страницах</li>
                  )}
                  <li>Используйте ключевые слова в первом абзаце текста</li>
                  <li>Добавьте подзаголовки для лучшей структуры контента</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <CardTitle>Анализ мета-тегов</CardTitle>
              <CardDescription>Оценка мета-описаний и ключевых слов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">Мета-описания</h3>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Заполнено:</span>
                      <span className="text-sm font-medium">
                        {site.pages.length - stats.missingMeta.description} из {site.pages.length}
                      </span>
                    </div>
                    <Progress 
                      value={((site.pages.length - stats.missingMeta.description) / site.pages.length) * 100} 
                      className="h-2" 
                    />
                  </div>
                  {stats.missingMeta.description > 0 ? (
                    <p className="text-xs text-amber-600">
                      ⚠️ Отсутствуют мета-описания на {stats.missingMeta.description} страницах
                    </p>
                  ) : (
                    <p className="text-xs text-green-600">
                      ✅ Мета-описания заполнены на всех страницах
                    </p>
                  )}
                </div>
                
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">Мета-ключевые слова</h3>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Заполнено:</span>
                      <span className="text-sm font-medium">
                        {site.pages.length - stats.missingMeta.keywords} из {site.pages.length}
                      </span>
                    </div>
                    <Progress 
                      value={((site.pages.length - stats.missingMeta.keywords) / site.pages.length) * 100} 
                      className="h-2" 
                    />
                  </div>
                  {stats.missingMeta.keywords > 0 ? (
                    <p className="text-xs text-amber-600">
                      ⚠️ Отсутствуют ключевые слова на {stats.missingMeta.keywords} страницах
                    </p>
                  ) : (
                    <p className="text-xs text-green-600">
                      ✅ Ключевые слова заполнены на всех страницах
                    </p>
                  )}
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Рекомендации по мета-тегам</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {stats.missingMeta.description > 0 && (
                    <li>Добавьте уникальные мета-описания на {stats.missingMeta.description} страницах</li>
                  )}
                  {stats.missingMeta.keywords > 0 && (
                    <li>Добавьте ключевые слова на {stats.missingMeta.keywords} страницах</li>
                  )}
                  <li>Оптимальная длина мета-описания: 120-160 символов</li>
                  <li>Включайте основные ключевые слова в мета-описания</li>
                  <li>Сделайте мета-описания привлекательными для кликов</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Структура сайта</CardTitle>
              <CardDescription>Анализ заголовков и HTML-структуры</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">H1 заголовки</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Отсутствуют:</span>
                      <Badge variant={stats.headings.missingH1 > 0 ? "destructive" : "outline"}>
                        {stats.headings.missingH1} стр.
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Множественные H1:</span>
                      <Badge variant={stats.headings.multipleH1 > 0 ? "destructive" : "outline"}>
                        {stats.headings.multipleH1} стр.
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">H2 заголовки</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Отсутствуют:</span>
                    <Badge variant={stats.headings.missingH2 > 0 ? "destructive" : "outline"}>
                      {stats.headings.missingH2} стр.
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">Изображения</h3>
                  <div className="text-sm mb-2">
                    Изображения без alt-текста:
                  </div>
                  <div className="text-xl font-semibold">
                    {site.pages.reduce((count, page) => 
                      count + page.images.filter(img => !img.alt).length, 0
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Рекомендации по структуре</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {stats.headings.missingH1 > 0 && (
                    <li>Добавьте H1 заголовки на {stats.headings.missingH1} страницах</li>
                  )}
                  {stats.headings.multipleH1 > 0 && (
                    <li>Исправьте множественные H1 на {stats.headings.multipleH1} страницах</li>
                  )}
                  {stats.headings.missingH2 > 0 && (
                    <li>Добавьте H2 подзаголовки на {stats.headings.missingH2} страницах</li>
                  )}
                  <li>Используйте семантическую разметку (HTML5)</li>
                  <li>Добавьте alt-текст ко всем изображениям</li>
                  <li>Соблюдайте корректную иерархию заголовков (H1 → H2 → H3)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Анализ ссылок</CardTitle>
              <CardDescription>Внутренние и внешние ссылки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">Внутренние ссылки</h3>
                  <div className="text-sm mb-1">Среднее количество на странице:</div>
                  <div className="text-xl font-semibold">{stats.internalLinks.average}</div>
                </div>
                
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">Страницы без ссылок</h3>
                  <div className="text-sm mb-1">Страницы-сироты:</div>
                  <div className="text-xl font-semibold text-amber-600">
                    {stats.internalLinks.orphaned}
                  </div>
                </div>
                
                <div className="bg-card p-4 rounded-md border">
                  <h3 className="font-medium mb-2">Внешние ссылки</h3>
                  <div className="text-sm mb-1">Общее количество:</div>
                  <div className="text-xl font-semibold">
                    {site.pages.reduce((count, page) => count + page.links.external.length, 0)}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Рекомендации по ссылкам</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {stats.internalLinks.orphaned > 0 && (
                    <li>Добавьте внутренние ссылки на {stats.internalLinks.orphaned} страниц-сирот</li>
                  )}
                  {stats.internalLinks.tooMany > 0 && (
                    <li>Оптимизируйте количество ссылок на {stats.internalLinks.tooMany} страницах с избыточными ссылками</li>
                  )}
                  {stats.internalLinks.average < 5 && (
                    <li>Увеличьте среднее количество внутренних ссылок (рекомендуется 5-15 на страницу)</li>
                  )}
                  <li>Используйте релевантный анкорный текст в ссылках</li>
                  <li>Проверьте наличие битых ссылок</li>
                  <li>Для внешних ссылок используйте атрибут rel="nofollow" где необходимо</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Итоговые рекомендации</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {overallScore < 60 && (
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Срочно необходимо улучшить SEO-показатели вашего сайта. Общая оценка низкая.</span>
              </li>
            )}
            {stats.avgWordCount < 300 && (
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Увеличьте объем контента на страницах минимум до 300-500 слов.</span>
              </li>
            )}
            {stats.missingMeta.description > site.pages.length * 0.2 && (
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Заполните мета-описания на всех важных страницах сайта.</span>
              </li>
            )}
            {stats.headings.missingH1 > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Обеспечьте наличие H1 заголовков на всех страницах.</span>
              </li>
            )}
            {stats.duplicateRisk.high > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Устраните дублированный контент на {stats.duplicateRisk.high} страницах.</span>
              </li>
            )}
            {stats.internalLinks.orphaned > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Настройте внутреннюю перелинковку для {stats.internalLinks.orphaned} страниц-сирот.</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Добавьте структурированные данные (Schema.org) для улучшения отображения в результатах поиска.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Создайте и отправьте в Google Search Console карту сайта в формате XML.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentAnalysisResults;
