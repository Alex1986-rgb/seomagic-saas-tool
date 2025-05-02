
import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface DuplicatesDetectorProps {
  domain: string;
  className?: string;
}

export function DuplicatesDetector({ domain, className }: DuplicatesDetectorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputDomain, setInputDomain] = useState(domain);
  const [progress, setProgress] = useState(0);
  const [duplicates, setDuplicates] = useState<Array<{
    url1: string;
    url2: string;
    similarity: number;
    type: 'content' | 'title' | 'meta';
  }>>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    setInputDomain(domain);
  }, [domain]);

  const detectDuplicates = async () => {
    if (!inputDomain) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите домен для анализа",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setDuplicates([]);

    try {
      // Эмуляция процесса анализа
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Генерируем демо-данные по дубликатам
      const mockDuplicates = [
        {
          url1: `https://${inputDomain}/services`,
          url2: `https://${inputDomain}/service-overview`,
          similarity: 92,
          type: 'content' as const
        },
        {
          url1: `https://${inputDomain}/about`,
          url2: `https://${inputDomain}/about-us`,
          similarity: 87,
          type: 'content' as const
        },
        {
          url1: `https://${inputDomain}/product1`,
          url2: `https://${inputDomain}/product-a`,
          similarity: 75,
          type: 'title' as const
        },
        {
          url1: `https://${inputDomain}/contact`,
          url2: `https://${inputDomain}/contact-us`,
          similarity: 95,
          type: 'meta' as const
        }
      ];
      
      setDuplicates(mockDuplicates);
      
      toast({
        title: "Анализ завершен",
        description: `Обнаружено ${mockDuplicates.length} дублей на сайте`,
      });
    } catch (error) {
      console.error('Ошибка при анализе дублей:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить анализ дублей",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={className ? `space-y-4 ${className}` : "space-y-4"}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-yellow-500" />
            Поиск дублей
          </CardTitle>
          <CardDescription>
            Помогает найти похожие страницы на вашем сайте, которые могут ухудшать SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-6">
            <div className="flex-1">
              <label htmlFor="duplicates-domain" className="block text-sm font-medium mb-1">Домен для анализа</label>
              <Input
                id="duplicates-domain"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="Введите домен, например example.com"
                disabled={isAnalyzing}
              />
            </div>
            <Button 
              onClick={detectDuplicates} 
              disabled={isAnalyzing || !inputDomain}
              className="gap-2"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {isAnalyzing ? 'Анализ...' : 'Найти дубли'}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="my-4">
              <div className="text-sm mb-1">Прогресс анализа: {progress}%</div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {duplicates.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Первая страница</TableHead>
                  <TableHead>Вторая страница</TableHead>
                  <TableHead className="text-center">Сходство</TableHead>
                  <TableHead className="text-center">Тип</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {duplicates.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate">{item.url1}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">{item.url2}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={
                          item.similarity > 90
                            ? "bg-red-50 text-red-800"
                            : item.similarity > 80
                              ? "bg-yellow-50 text-yellow-800"
                              : "bg-blue-50 text-blue-800"
                        }
                      >
                        {item.similarity}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.type === 'content' ? 'Содержимое' : 
                       item.type === 'title' ? 'Заголовок' : 'Мета-теги'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isAnalyzing && duplicates.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              {inputDomain ? 'Запустите анализ для поиска дублей' : 'Введите домен для начала анализа'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
