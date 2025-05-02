
import React, { useState, useEffect } from 'react';
import { Link2Off, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface BrokenLink {
  url: string;
  status: number;
  referrer: string;
  found: string; // датавремя обнаружения
}

interface BrokenLinksAnalyzerProps {
  domain?: string;
  urls: string[];
}

export function BrokenLinksAnalyzer({ domain = '', urls = [] }: BrokenLinksAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputDomain, setInputDomain] = useState(domain);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (domain) {
      setInputDomain(domain);
    }
  }, [domain]);

  const analyzeBrokenLinks = async () => {
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
    setBrokenLinks([]);

    try {
      // Здесь в реальном приложении был бы настоящий анализ
      // Для демо генерируем моковые данные
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Последовательно обновляем прогресс для реалистичности
      for (let i = 1; i <= 5; i++) {
        setProgress(i * 20);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Генерируем фиктивные данные о битых ссылках
      const mockBrokenLinks: BrokenLink[] = [
        {
          url: `https://${inputDomain}/broken-page-1`,
          status: 404,
          referrer: `https://${inputDomain}/about`,
          found: new Date().toISOString()
        },
        {
          url: `https://${inputDomain}/old-product`,
          status: 410,
          referrer: `https://${inputDomain}/catalog`,
          found: new Date().toISOString()
        },
        {
          url: `https://${inputDomain}/services/unavailable`,
          status: 503,
          referrer: `https://${inputDomain}/services`,
          found: new Date().toISOString()
        },
        {
          url: `https://${inputDomain}/images/missing.jpg`,
          status: 404,
          referrer: `https://${inputDomain}/gallery`,
          found: new Date().toISOString()
        }
      ];
      
      setBrokenLinks(mockBrokenLinks);
      
      toast({
        title: "Анализ завершен",
        description: `Обнаружено ${mockBrokenLinks.length} битых ссылок на сайте`,
      });
    } catch (error) {
      console.error('Ошибка анализа:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить анализ битых ссылок",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2Off className="h-5 w-5 text-destructive" />
            Анализатор битых ссылок
          </CardTitle>
          <CardDescription>
            Сканирует сайт на наличие неработающих ссылок, которые могут ухудшать пользовательский опыт и SEO
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
              onClick={analyzeBrokenLinks} 
              disabled={isAnalyzing || !inputDomain}
              className="gap-2"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Link2Off className="h-4 w-4" />
              )}
              {isAnalyzing ? 'Анализируем...' : 'Найти битые ссылки'}
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

          {brokenLinks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-center">Код ошибки</TableHead>
                  <TableHead>Откуда ссылка</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokenLinks.map((link, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{link.url}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded">
                        {link.status}
                      </span>
                    </TableCell>
                    <TableCell>{link.referrer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : !isAnalyzing && (
            <div className="text-center py-6 text-muted-foreground">
              {inputDomain ? 'Запустите анализ для поиска битых ссылок' : 'Введите домен для начала анализа'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
