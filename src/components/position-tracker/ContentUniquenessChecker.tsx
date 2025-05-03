
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Search } from 'lucide-react';

interface ContentUniquenessCheckerProps {
  domain: string;
}

export function ContentUniquenessChecker({ domain }: ContentUniquenessCheckerProps) {
  const [url, setUrl] = useState(domain || '');
  const [content, setContent] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    isUnique: boolean;
    score: number;
    matches?: Array<{url: string, similarity: number}>
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsChecking(true);
    setResult(null);
    
    try {
      // Симуляция проверки контента
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      // Демонстрационные данные
      const demoScore = Math.random() * 100;
      setResult({
        isUnique: demoScore > 70,
        score: Math.round(demoScore),
        matches: demoScore < 90 ? [
          { url: 'https://example.com/similar-page', similarity: Math.round(Math.random() * 60) },
          { url: 'https://another-site.com/content', similarity: Math.round(Math.random() * 40) },
        ] : []
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Проверка уникальности контента</CardTitle>
          <CardDescription>
            Анализ текста на уникальность и сравнение с другими источниками в интернете
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-1">
                URL страницы или домен
              </label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Например, example.com"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Контент для проверки
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Вставьте текст для проверки уникальности..."
                rows={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isChecking || !content || !url}
            >
              {isChecking ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Проверка...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Проверить уникальность
                </>
              )}
            </Button>
          </form>
          
          {result && (
            <div className="mt-6 space-y-4">
              <Alert variant={result.isUnique ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {result.isUnique ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {result.isUnique 
                      ? "Контент является достаточно уникальным!" 
                      : "Обнаружены совпадения с другими источниками."}
                  </AlertDescription>
                </div>
              </Alert>
              
              <div className="p-4 border rounded-md">
                <div className="text-lg font-semibold mb-2">
                  Уникальность: {result.score}%
                </div>
                
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-3 rounded-full ${
                      result.score > 90 
                        ? "bg-green-500" 
                        : result.score > 70 
                        ? "bg-yellow-500" 
                        : "bg-red-500"
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                
                {result.matches && result.matches.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Найденные совпадения:</h4>
                    <ul className="space-y-2 text-sm">
                      {result.matches.map((match, index) => (
                        <li key={index} className="flex justify-between">
                          <a 
                            href={match.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline truncate"
                          >
                            {match.url}
                          </a>
                          <span>{match.similarity}% совпадение</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
