
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CopyX, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DuplicatesDetectorProps {
  domain: string;
}

export function DuplicatesDetector({ domain }: DuplicatesDetectorProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [inputDomain, setInputDomain] = useState(domain || '');
  const [progress, setProgress] = useState(0);
  const [duplicatesFound, setDuplicatesFound] = useState<Array<{
    url: string;
    duplicateUrl: string;
    similarity: number;
  }> | null>(null);
  
  const { toast } = useToast();
  
  const checkDuplicates = async () => {
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
    setDuplicatesFound(null);
    
    // Эмулируем процесс проверки
    try {
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Симулируем ответ
      const demoResults = [
        {
          url: `https://${inputDomain}/about-us`,
          duplicateUrl: `https://${inputDomain}/about`,
          similarity: 92
        },
        {
          url: `https://${inputDomain}/services/web-design`,
          duplicateUrl: `https://${inputDomain}/web-design-services`,
          similarity: 88
        },
        {
          url: `https://${inputDomain}/contact`,
          duplicateUrl: `https://${inputDomain}/contact-us`,
          similarity: 95
        }
      ];
      
      setDuplicatesFound(demoResults);
      
      toast({
        title: "Проверка завершена",
        description: `Найдено ${demoResults.length} дубликатов на сайте ${inputDomain}`,
      });
    } catch (error) {
      console.error('Ошибка при проверке дубликатов:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось проверить сайт на дубликаты",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CopyX className="h-5 w-5 text-orange-500" />
            Обнаружение дублей контента
          </CardTitle>
          <CardDescription>
            Анализирует сайт на наличие дублирующихся страниц и похожего контента
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-6">
            <div className="flex-1">
              <label htmlFor="duplicates-domain" className="block text-sm font-medium mb-1">Домен для проверки</label>
              <Input
                id="duplicates-domain"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="Введите домен, например example.com"
                disabled={isChecking}
              />
            </div>
            <Button 
              onClick={checkDuplicates} 
              disabled={isChecking || !inputDomain}
              className="gap-2"
            >
              {isChecking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CopyX className="h-4 w-4" />
              )}
              {isChecking ? 'Проверка...' : 'Найти дубли'}
            </Button>
          </div>

          {isChecking ? (
            <div className="my-4">
              <div className="text-sm mb-1">Анализ страниц сайта: {progress}%</div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : duplicatesFound ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">URL страницы</th>
                    <th className="px-4 py-2 text-left">Дубликат</th>
                    <th className="px-4 py-2 text-center">Сходство</th>
                  </tr>
                </thead>
                <tbody>
                  {duplicatesFound.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3 truncate max-w-[180px]">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {item.url}
                        </a>
                      </td>
                      <td className="px-4 py-3 truncate max-w-[180px]">
                        <a href={item.duplicateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {item.duplicateUrl}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-medium ${
                          item.similarity > 90 ? 'text-red-500' : 
                          item.similarity > 80 ? 'text-orange-500' : 
                          'text-yellow-500'
                        }`}>
                          {item.similarity}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="bg-muted/50 p-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Найдено дубликатов: {duplicatesFound.length}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={checkDuplicates} className="gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Повторить проверку
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <CopyX className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
              <p className="text-muted-foreground">
                {inputDomain 
                  ? "Нажмите «Найти дубли», чтобы начать проверку содержимого сайта на дубликаты" 
                  : "Укажите домен для начала проверки"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
