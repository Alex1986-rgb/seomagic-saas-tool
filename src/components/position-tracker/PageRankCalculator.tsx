
import React, { useState } from 'react';
import { BarChart, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PageRankData {
  url: string;
  pageRank: number;
  inboundLinks: number;
  outboundLinks: number;
  domainAuthority: number;
}

interface PageRankCalculatorProps {
  className?: string;
}

export function PageRankCalculator({ className }: PageRankCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [url, setUrl] = useState('');
  const [pageRankData, setPageRankData] = useState<PageRankData | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const calculatePageRank = async () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Введите URL страницы для анализа",
        variant: "destructive",
      });
      return;
    }

    // Базовая проверка формата URL
    if (!url.match(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      toast({
        title: "Неверный формат",
        description: "Пожалуйста, введите корректный URL сайта",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    setProgress(0);
    setPageRankData(null);

    try {
      // Имитация процесса расчета
      for (let i = 1; i <= 5; i++) {
        setProgress(i * 20);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // В реальном приложении здесь был бы запрос к API
      // Для демо генерируем случайные данные
      const mockData: PageRankData = {
        url,
        pageRank: parseFloat((Math.random() * 5 + 2).toFixed(1)), // Значение от 2.0 до 7.0
        inboundLinks: Math.floor(Math.random() * 1000) + 10, // От 10 до 1009
        outboundLinks: Math.floor(Math.random() * 50) + 5, // От 5 до 54
        domainAuthority: Math.floor(Math.random() * 70) + 10 // От 10 до 79
      };

      setPageRankData(mockData);
      
      toast({
        title: "Расчет завершен",
        description: `PageRank страницы: ${mockData.pageRank}/10`,
      });
    } catch (error) {
      console.error('Ошибка при расчете PageRank:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить расчет PageRank",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getColorForPageRank = (rank: number) => {
    if (rank >= 6) return 'text-green-500';
    if (rank >= 4) return 'text-amber-500';
    if (rank >= 2) return 'text-orange-500';
    return 'text-red-500';
  };

  const getColorForDomainAuthority = (authority: number) => {
    if (authority >= 60) return 'text-green-500';
    if (authority >= 40) return 'text-amber-500';
    if (authority >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-500" />
            Калькулятор PageRank
          </CardTitle>
          <CardDescription>
            Оценка значимости страницы на основе количества и качества ссылок на неё
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="url" className="block text-sm font-medium mb-1">URL страницы для анализа</label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Введите URL страницы, например https://example.com/page"
                disabled={isCalculating}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={calculatePageRank} 
                disabled={isCalculating || !url}
                className="gap-2"
              >
                {isCalculating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <BarChart className="h-4 w-4" />
                )}
                {isCalculating ? 'Расчет...' : 'Рассчитать'}
              </Button>
            </div>
          </div>

          {isCalculating && (
            <div>
              <div className="text-sm mb-1">Прогресс анализа: {progress}%</div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {pageRankData && (
            <div className="border rounded-lg p-4 mt-4">
              <h3 className="text-lg font-semibold mb-3">Результаты анализа для {pageRankData.url}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">PageRank</div>
                    <div className={`text-2xl font-bold ${getColorForPageRank(pageRankData.pageRank)}`}>
                      {pageRankData.pageRank}/10
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Domain Authority</div>
                    <div className={`text-2xl font-bold ${getColorForDomainAuthority(pageRankData.domainAuthority)}`}>
                      {pageRankData.domainAuthority}/100
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Входящие ссылки</div>
                    <div className="text-xl font-bold">
                      {pageRankData.inboundLinks.toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Исходящие ссылки</div>
                    <div className="text-xl font-bold">
                      {pageRankData.outboundLinks}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm font-medium mb-2">Рекомендации:</div>
                <ul className="text-sm space-y-1">
                  {pageRankData.inboundLinks < 50 && (
                    <li className="text-amber-600">• Увеличьте количество внешних ссылок на страницу</li>
                  )}
                  {pageRankData.pageRank < 4 && (
                    <li className="text-amber-600">• Улучшите качество обратных ссылок с авторитетных доменов</li>
                  )}
                  {pageRankData.outboundLinks > 30 && (
                    <li className="text-amber-600">• Уменьшите количество исходящих ссылок</li>
                  )}
                  <li className="text-green-600">• Регулярно проводите аудит ссылочной массы</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
