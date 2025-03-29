
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface CrawlSeoRecommendationsTabProps {
  pageCount: number;
  urls: string[];
}

const CrawlSeoRecommendationsTab: React.FC<CrawlSeoRecommendationsTabProps> = ({ pageCount, urls }) => {
  const topLevelPages = urls.filter(u => (u.match(/\//g) || []).length <= 3).length;
  const deepPages = urls.filter(u => (u.match(/\//g) || []).length > 3).length;
  const potentialProductPages = urls.filter(u => 
    u.includes('product') || 
    u.includes('tovar') || 
    u.includes('item') || 
    u.includes('catalog/')
  ).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Автоматические рекомендации</CardTitle>
        <CardDescription>
          На основе структуры найденных URL
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p>✅ Обнаружено {pageCount} уникальных URL</p>
        <p>{topLevelPages > pageCount * 0.3 ? '✅' : '⚠️'} {topLevelPages} страниц имеют оптимальную вложенность</p>
        <p>{deepPages > pageCount * 0.7 ? '⚠️' : '✅'} {deepPages} страниц имеют глубокую вложенность</p>
        <p>{potentialProductPages > 0 ? '✅' : '⚠️'} Найдено {potentialProductPages} потенциальных товарных страниц</p>
        <p>💡 Рекомендуется проверить карту сайта вручную и убедиться, что все важные страницы присутствуют</p>
        <p>💡 На основе результатов сканирования создайте sitemap.xml и добавьте его в Google Search Console</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Для полного SEO аудита запустите глубокое сканирование контента
      </CardFooter>
    </Card>
  );
};

export default CrawlSeoRecommendationsTab;
