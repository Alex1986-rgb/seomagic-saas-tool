
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link2Off, Loader2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface BrokenLinksAnalyzerProps {
  domain: string;
}

export function BrokenLinksAnalyzer({ domain }: BrokenLinksAnalyzerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [inputDomain, setInputDomain] = useState(domain || '');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Array<{
    url: string;
    statusCode: number;
    statusText: string;
    type: 'internal' | 'external';
    sourceUrl: string;
  }> | null>(null);
  
  const { toast } = useToast();
  
  const checkBrokenLinks = async () => {
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
    setResults(null);
    
    // Эмулируем процесс проверки
    try {
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Симулируем ответ
      const demoResults = [
        {
          url: `https://${inputDomain}/broken-link`,
          statusCode: 404,
          statusText: "Not Found",
          type: 'internal' as const,
          sourceUrl: `https://${inputDomain}/about-us`
        },
        {
          url: `https://${inputDomain}/old-page`,
          statusCode: 301,
          statusText: "Moved Permanently",
          type: 'internal' as const,
          sourceUrl: `https://${inputDomain}/blog/post-1`
        },
        {
          url: `https://external-site.com/broken-resource`,
          statusCode: 404,
          statusText: "Not Found",
          type: 'external' as const,
          sourceUrl: `https://${inputDomain}/partners`
        },
        {
          url: `https://${inputDomain}/products/discontinued`,
          statusCode: 410,
          statusText: "Gone",
          type: 'internal' as const,
          sourceUrl: `https://${inputDomain}/catalog`
        },
        {
          url: `https://api.example.org/data`,
          statusCode: 403,
          statusText: "Forbidden",
          type: 'external' as const,
          sourceUrl: `https://${inputDomain}/dashboard`
        }
      ];
      
      setResults(demoResults);
      
      toast({
        title: "Проверка завершена",
        description: `Найдено ${demoResults.length} проблемных ссылок на сайте ${inputDomain}`,
      });
    } catch (error) {
      console.error('Ошибка при проверке битых ссылок:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось проверить сайт на наличие битых ссылок",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusBadgeColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "bg-green-100 text-green-800";
    if (statusCode >= 300 && statusCode < 400) return "bg-yellow-100 text-yellow-800";
    if (statusCode >= 400 && statusCode < 500) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2Off className="h-5 w-5 text-red-500" />
            Проверка битых ссылок
          </CardTitle>
          <CardDescription>
            Сканирует сайт и находит все неработающие ссылки, помогая улучшить пользовательский опыт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-6">
            <div className="flex-1">
              <label htmlFor="links-domain" className="block text-sm font-medium mb-1">Домен для проверки</label>
              <Input
                id="links-domain"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="Введите домен, например example.com"
                disabled={isChecking}
              />
            </div>
            <Button 
              onClick={checkBrokenLinks} 
              disabled={isChecking || !inputDomain}
              className="gap-2"
            >
              {isChecking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Link2Off className="h-4 w-4" />
              )}
              {isChecking ? 'Проверка...' : 'Найти битые ссылки'}
            </Button>
          </div>

          {isChecking ? (
            <div className="my-4">
              <div className="text-sm mb-1">Сканирование ссылок: {progress}%</div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : results ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">URL ссылки</th>
                    <th className="px-4 py-2 text-center">Статус</th>
                    <th className="px-4 py-2 text-left">Тип</th>
                    <th className="px-4 py-2 text-left">Найдено на</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3 truncate max-w-[220px]">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {item.url}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={getStatusBadgeColor(item.statusCode)}>
                          {item.statusCode} {item.statusText}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={item.type === 'internal' ? 'default' : 'outline'}>
                          {item.type === 'internal' ? 'Внутренняя' : 'Внешняя'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 truncate max-w-[220px]">
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {item.sourceUrl}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="bg-muted/50 p-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Найдено битых ссылок: {results.length}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" />
                      Экспорт
                    </Button>
                    <Button variant="outline" size="sm" onClick={checkBrokenLinks} className="gap-1">
                      <RefreshCw className="h-3 w-3" />
                      Повторить проверку
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Link2Off className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
              <p className="text-muted-foreground">
                {inputDomain 
                  ? "Нажмите «Найти битые ссылки», чтобы начать проверку" 
                  : "Укажите домен для начала проверки"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
