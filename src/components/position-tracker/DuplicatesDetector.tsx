
import React, { useState } from 'react';
import { CopyX, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface DuplicatePage {
  url: string;
  duplicateUrl: string;
  similarity: number; // процент схожести
  type: 'content' | 'title' | 'description';
}

interface DuplicatesDetectorProps {
  domain?: string;
  urls: string[];
}

export function DuplicatesDetector({ domain = '', urls = [] }: DuplicatesDetectorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputDomain, setInputDomain] = useState(domain);
  const [duplicates, setDuplicates] = useState<DuplicatePage[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    if (domain) {
      setInputDomain(domain);
    }
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
      // Здесь в реальном приложении был бы настоящий анализ
      // Для демо генерируем моковые данные
      
      // Последовательно обновляем прогресс для реалистичности
      for (let i = 1; i <= 10; i++) {
        setProgress(i * 10);
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // Генерируем фиктивные данные о дубликатах
      const mockDuplicates: DuplicatePage[] = [
        {
          url: `https://${inputDomain}/product/item-1`,
          duplicateUrl: `https://${inputDomain}/item-1`,
          similarity: 95,
          type: 'content'
        },
        {
          url: `https://${inputDomain}/blog/post-1`,
          duplicateUrl: `https://${inputDomain}/articles/article-1`,
          similarity: 87,
          type: 'content'
        },
        {
          url: `https://${inputDomain}/category/shoes`,
          duplicateUrl: `https://${inputDomain}/products/shoes`,
          similarity: 92,
          type: 'title'
        },
        {
          url: `https://${inputDomain}/about`,
          duplicateUrl: `https://${inputDomain}/about-us`,
          similarity: 78,
          type: 'description'
        }
      ];
      
      setDuplicates(mockDuplicates);
      
      toast({
        title: "Анализ завершен",
        description: `Обнаружено ${mockDuplicates.length} дублированных страниц`,
      });
    } catch (error) {
      console.error('Ошибка анализа:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить анализ дубликатов",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDuplicateTypeBadge = (type: string) => {
    switch (type) {
      case 'content':
        return <Badge variant="destructive">Контент</Badge>;
      case 'title':
        return <Badge variant="warning">Заголовок</Badge>;
      case 'description':
        return <Badge variant="outline">Описание</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CopyX className="h-5 w-5 text-amber-500" />
            Поиск дубликатов контента
          </CardTitle>
          <CardDescription>
            Находит страницы с дублирующимся содержимым, которые могут негативно влиять на SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-4">
            <div className="flex-1">
              <label htmlFor="domain" className="block text-sm font-medium mb-1">Домен для анализа</label>
              <Input
                id="domain"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="Введите домен, например example.com"
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

          {duplicates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Оригинальный URL</TableHead>
                  <TableHead>Дублирующийся URL</TableHead>
                  <TableHead className="text-center">Схожесть</TableHead>
                  <TableHead>Тип дубликата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {duplicates.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium max-w-[200px] truncate">{item.url}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.duplicateUrl}</TableCell>
                    <TableCell className="text-center">
                      {item.similarity}%
                    </TableCell>
                    <TableCell>{getDuplicateTypeBadge(item.type)}</TableCell>
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
