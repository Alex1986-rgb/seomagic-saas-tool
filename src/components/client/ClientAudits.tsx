
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink, TrendingUp } from 'lucide-react';

const ClientAudits: React.FC = () => {
  const audits = [
    {
      id: 1,
      url: 'example.com',
      date: '15 декабря 2024',
      score: 87,
      status: 'completed',
      issues: 12
    },
    {
      id: 2,
      url: 'shop.example.com',
      date: '10 декабря 2024',
      score: 72,
      status: 'completed',
      issues: 23
    },
    {
      id: 3,
      url: 'blog.example.com',
      date: '5 декабря 2024',
      score: 94,
      status: 'completed',
      issues: 5
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg md:text-xl font-semibold">История SEO аудитов</h3>
      <div className="grid gap-4">
        {audits.map((audit) => (
          <Card key={audit.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">{audit.url}</CardTitle>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Завершен
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Дата</p>
                  <p className="font-medium text-sm md:text-base">{audit.date}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">SEO балл</p>
                  <p className="font-bold text-lg text-primary">{audit.score}/100</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Проблем</p>
                  <p className="font-medium text-sm md:text-base">{audit.issues}</p>
                </div>
                <div className="flex items-end">
                  <Button size="sm" variant="outline" className="w-full text-xs md:text-sm">
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Открыть
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientAudits;
