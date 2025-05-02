
import React, { useState } from 'react';
import { CopyX, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DuplicatePage {
  url: string;
  duplicatedUrl: string;
  similarity: number;
  type: 'content' | 'title' | 'description';
}

interface DuplicatesDetectorProps {
  domain?: string;
  urls?: string[];
  className?: string;
}

export function DuplicatesDetector({ domain = '', urls = [], className }: DuplicatesDetectorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputDomain, setInputDomain] = useState(domain);
  const [duplicatePages, setDuplicatePages] = useState<DuplicatePage[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const analyzeDuplicates = async () => {
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
    setDuplicatePages([]);

    try {
      // Эмуляция процесса анализа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Последовательно обновляем прогресс для реалистичности
      for (let i = 1; i <= 5; i++) {
        setProgress(i * 20);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Генерируем фиктивные данные о дубликатах страниц
      const mockDuplicates: DuplicatePage[] = [
        {
          url: `https://${inputDomain}/product/item-1`,
          duplicatedUrl: `https://${inputDomain}/products/item-1`,
          similarity: 98,
          type: 'content'
        },
        {
          url: `https://${inputDomain}/about-us`,
          duplicatedUrl: `https://${inputDomain}/about`,
          similarity: 89,
          type: 'content'
        },
        {
          url: `https://${inputDomain}/services/consulting`,
          duplicatedUrl: `https://${inputDomain}/services/business-consulting`,
          similarity: 76,
          type: 'title'
        },
        {
          url: `https://${inputDomain}/blog/post-1`,
          duplicatedUrl: `https://${inputDomain}/news/article-1`,
          similarity: 82,
          type: 'content'
        }
      ];
      
      setDuplicatePages(mockDuplicates);
      
      toast({
        title: "Анализ завершен",
        description: `Обнаружено ${mockDuplicates.length} дубликатов страниц на сайте`,
      });
    } catch (error) {
      console.error('Ошибка анализа дубликатов:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить анализ дубликатов страниц",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'text-red-600';
    if (similarity >= 80) return 'text-orange-500';
    if (similarity >= 70) return 'text-amber-500';
    return 'text-yellow-500';
  };

  const getDuplicateTypeBadge = (type: string) => {
    switch (type) {
      case 'content':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Контент</Badge>;
      case 'title':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Заголовок</Badge>;
      case 'description':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Описание</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className={className ? `space-y-4 ${className}` : "space-y-4"}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CopyX className="h-5 w-5 text-amber-500" />
            Анализатор дубликатов
          </CardTitle>
          <CardDescription>
            Проверяет сайт на наличие дублированного контента, который может негативно влиять на SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-4">
            <div className="flex-1">
              <label htmlFor="duplicate-domain" className="block text-sm font-medium mb-1">Домен для анализа</label>
              <Input
                id="duplicate-domain"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="Введите домен, например example.com"
              />
            </div>
            <Button 
              onClick={analyzeDuplicates} 
              disabled={isAnalyzing || !inputDomain}
              className="gap-2"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CopyX className="h-4 w-4" />
              )}
              {isAnalyzing ? 'Анализируем...' : 'Найти дубликаты'}
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

          {duplicatePages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Оригинальная страница</TableHead>
                  <TableHead>Дублирующая страница</TableHead>
                  <TableHead className="text-center">Схожесть</TableHead>
                  <TableHead>Тип дубликата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {duplicatePages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{page.url}</TableCell>
                    <TableCell>{page.duplicatedUrl}</TableCell>
                    <TableCell className="text-center">
                      <span className={`font-semibold ${getSimilarityColor(page.similarity)}`}>
                        {page.similarity}%
                      </span>
                    </TableCell>
                    <TableCell>{getDuplicateTypeBadge(page.type)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : !isAnalyzing && (
            <div className="text-center py-6 text-muted-foreground">
              {inputDomain ? 'Запустите анализ для поиска дубликатов' : 'Введите домен для начала анализа'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
