
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientPositionTracker: React.FC = () => {
  const positions = [
    {
      keyword: 'seo аудит',
      position: 3,
      previousPosition: 5,
      searchEngine: 'Google'
    },
    {
      keyword: 'оптимизация сайта',
      position: 7,
      previousPosition: 7,
      searchEngine: 'Yandex'
    },
    {
      keyword: 'анализ сайта',
      position: 12,
      previousPosition: 8,
      searchEngine: 'Google'
    }
  ];

  const getTrendIcon = (current: number, previous: number) => {
    if (current < previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current > previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-semibold">Отслеживание позиций</h3>
        <Link to="/position-tracker">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Добавить ключевое слово
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {positions.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base">{item.keyword}</p>
                  <p className="text-xs text-muted-foreground">{item.searchEngine}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{item.position}</span>
                    {getTrendIcon(item.position, item.previousPosition)}
                  </div>
                  <p className="text-xs text-muted-foreground">позиция</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientPositionTracker;
