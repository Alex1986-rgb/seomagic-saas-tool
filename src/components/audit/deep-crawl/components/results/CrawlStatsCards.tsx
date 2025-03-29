
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CrawlStatsCardsProps {
  pageCount: number;
  urls: string[];
}

const CrawlStatsCards: React.FC<CrawlStatsCardsProps> = ({ pageCount, urls }) => {
  const topLevelPages = urls.filter(u => (u.match(/\//g) || []).length <= 3).length;
  const potentialProductPages = urls.filter(u => 
    u.includes('product') || 
    u.includes('tovar') || 
    u.includes('item') || 
    u.includes('catalog/')
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <Card className="bg-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Страницы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pageCount}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Вложенность до 3 уровней</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topLevelPages}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Потенциальные товары</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{potentialProductPages}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrawlStatsCards;
