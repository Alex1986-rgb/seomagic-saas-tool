
import React, { useState, useEffect } from 'react';
import { Fingerprint, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface ContentUniquenessCheckerProps {
  domain: string;
  className?: string;
}

export function ContentUniquenessChecker({ domain, className }: ContentUniquenessCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [inputDomain, setInputDomain] = useState(domain);
  const [progress, setProgress] = useState(0);
  const [uniquenessScore, setUniquenessScore] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    setInputDomain(domain);
  }, [domain]);

  const checkContentUniqueness = async () => {
    if (!inputDomain) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите домен для проверки",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setProgress(0);
    setUniquenessScore(null);

    try {
      // Эмуляция процесса проверки
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Генерируем случайный балл уникальности от 50 до 100
      const score = Math.floor(Math.random() * 51) + 50;
      setUniquenessScore(score);
      
      toast({
        title: "Проверка завершена",
        description: `Уникальность контента: ${score}%`,
      });
    } catch (error) {
      console.error('Ошибка при проверке уникальности контента:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось проверить уникальность контента",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={className ? `space-y-4 ${className}` : "space-y-4"}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-primary" />
            Уникальность контента
          </CardTitle>
          <CardDescription>
            Проверяет уникальность текстового содержимого вашего сайта и выявляет возможные дубликаты
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-6">
            <div className="flex-1">
              <label htmlFor="uniqueness-domain" className="block text-sm font-medium mb-1">Домен для проверки</label>
              <Input
                id="uniqueness-domain"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="Введите домен, например example.com"
                disabled={isChecking}
              />
            </div>
            <Button 
              onClick={checkContentUniqueness} 
              disabled={isChecking || !inputDomain}
              className="gap-2"
            >
              {isChecking ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Fingerprint className="h-4 w-4" />
              )}
              {isChecking ? 'Проверка...' : 'Проверить уникальность'}
            </Button>
          </div>

          {isChecking && (
            <div className="my-4">
              <div className="text-sm mb-1">Анализ контента: {progress}%</div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {uniquenessScore !== null && !isChecking && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className={`${
                        uniquenessScore >= 80
                          ? "text-green-500"
                          : uniquenessScore >= 60
                          ? "text-yellow-500"
                          : "text-red-500"
                      } stroke-current`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                      strokeDasharray={`${uniquenessScore * 3.6} 1000`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                    {uniquenessScore}%
                  </div>
                </div>
                <h3 className="text-xl font-medium mt-4">Уникальность контента</h3>
                <p className="text-muted-foreground mt-1">
                  {uniquenessScore >= 80
                    ? "Отличный результат! Большая часть вашего контента уникальна."
                    : uniquenessScore >= 60
                    ? "Хороший результат, но есть возможности для улучшения."
                    : "Требуется улучшение уникальности контента."}
                </p>
              </div>

              <Tabs defaultValue="recommendations">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
                  <TabsTrigger value="details">Детали проверки</TabsTrigger>
                </TabsList>
                <TabsContent value="recommendations" className="p-4 border rounded-md mt-2">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Проверяйте новый контент на уникальность перед публикацией</li>
                    <li>Переработайте страницы с низкой уникальностью</li>
                    <li>Используйте канонические URL для страниц с похожим содержанием</li>
                    <li>Создавайте более глубокие, информативные материалы по вашей тематике</li>
                  </ul>
                </TabsContent>
                <TabsContent value="details" className="p-4 border rounded-md mt-2">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium">Проверено страниц</div>
                      <div className="text-xl">24</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Проверено текста</div>
                      <div className="text-xl">~14,500 слов</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Похожий контент найден на</div>
                      <div className="text-xl text-amber-500">3 страницах</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {!isChecking && uniquenessScore === null && (
            <div className="text-center py-10">
              <Fingerprint className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
              <p className="text-muted-foreground">
                {inputDomain 
                  ? "Нажмите «Проверить уникальность», чтобы начать анализ" 
                  : "Укажите домен для начала проверки"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
