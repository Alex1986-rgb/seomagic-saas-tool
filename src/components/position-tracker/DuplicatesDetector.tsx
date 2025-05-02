
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertTriangle, FileCheck, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DuplicatesDetector() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    duplicateCount: number;
    duplicateContent: { url: string; similarity: number }[];
    originalContent: string;
  } | null>(null);
  const { toast } = useToast();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Введите URL страницы для проверки",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data for demonstration
      setResults({
        duplicateCount: Math.floor(Math.random() * 5),
        duplicateContent: [
          { url: 'https://example.com/page1', similarity: 87 },
          { url: 'https://example2.org/similar', similarity: 65 },
          { url: 'https://competitor.com/article', similarity: 42 }
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        originalContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl vel nisl.'
      });
      
      toast({
        title: "Анализ завершен",
        description: "Проверка на дубликаты контента завершена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить проверку на дубликаты",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Текст скопирован в буфер обмена",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Проверка на дубликаты контента</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-1">
                URL страницы
              </label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="https://example.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    'Проверить'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Результаты проверки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.duplicateCount > 0 ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Обнаружены дубликаты контента</AlertTitle>
                <AlertDescription>
                  Найдено {results.duplicateCount} страниц с похожим содержимым
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <FileCheck className="h-4 w-4" />
                <AlertTitle>Дубликатов не обнаружено</AlertTitle>
                <AlertDescription>
                  Контент на проверяемой странице уникален
                </AlertDescription>
              </Alert>
            )}

            {results.duplicateCount > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Страницы с похожим контентом:</h3>
                <ul className="space-y-2">
                  {results.duplicateContent.map((item, index) => (
                    <li key={index} className="p-2 border rounded-md">
                      <div className="flex justify-between items-center">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {item.url}
                        </a>
                        <span className="text-sm text-muted-foreground">
                          Схожесть: {item.similarity}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Оригинальный контент:</h3>
              <div className="relative">
                <Textarea 
                  value={results.originalContent} 
                  readOnly 
                  className="resize-none h-32"
                />
                <Button 
                  variant="secondary"
                  size="sm" 
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard(results.originalContent)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Рекомендации:</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Убедитесь, что контент на вашей странице уникален</li>
                <li>Используйте канонические URL для страниц с похожим содержимым</li>
                <li>Добавьте больше уникального контента на страницу</li>
                <li>Избегайте использования шаблонных текстов на разных страницах</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
