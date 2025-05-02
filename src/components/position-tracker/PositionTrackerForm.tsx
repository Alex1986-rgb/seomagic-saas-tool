
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';

interface PositionTrackerFormProps {
  onSearchComplete?: (results: any) => void;
}

export function PositionTrackerForm({ onSearchComplete }: PositionTrackerFormProps) {
  const [domain, setDomain] = useState('');
  const [keywords, setKeywords] = useState('');
  const [searchEngine, setSearchEngine] = useState('all');
  const [region, setRegion] = useState('moscow');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain) {
      toast({
        title: "Ошибка",
        description: "Введите домен для проверки",
        variant: "destructive"
      });
      return;
    }
    
    if (!keywords) {
      toast({
        title: "Ошибка",
        description: "Введите ключевые слова для проверки",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const keywordsList = keywords.split('\n').filter(k => k.trim());
      
      const results = {
        domain,
        keywords: keywordsList,
        searchEngine,
        region,
        timestamp: new Date().toISOString(),
        positions: keywordsList.map(keyword => ({
          keyword,
          position: Math.floor(Math.random() * 100) + 1,
          url: `https://${domain}/page-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
          searchEngine
        }))
      };
      
      setIsSuccess(true);
      
      toast({
        title: "Успешно",
        description: `Проверено ${keywordsList.length} ключевых слов для домена ${domain}`,
      });
      
      if (onSearchComplete) {
        onSearchComplete(results);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить проверку позиций",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Проверка позиций сайта</CardTitle>
        <CardDescription>
          Отследите позиции вашего сайта по ключевым словам в поисковых системах
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium mb-1">
              Домен
            </label>
            <Input
              id="domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium mb-1">
              Ключевые слова (по одному на строку)
            </label>
            <Textarea
              id="keywords"
              placeholder="SEO оптимизация&#10;продвижение сайта&#10;настройка рекламы"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={5}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search-engine" className="block text-sm font-medium mb-1">
                Поисковая система
              </label>
              <Select value={searchEngine} onValueChange={setSearchEngine}>
                <SelectTrigger id="search-engine">
                  <SelectValue placeholder="Выберите поисковую систему" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все поисковики</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="yandex">Яндекс</SelectItem>
                  <SelectItem value="mailru">Mail.ru</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium mb-1">
                Регион
              </label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moscow">Москва</SelectItem>
                  <SelectItem value="spb">Санкт-Петербург</SelectItem>
                  <SelectItem value="russia">Россия</SelectItem>
                  <SelectItem value="custom">Другой регион</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || isSuccess}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Проверка позиций...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Проверка завершена
              </>
            ) : (
              'Проверить позиции'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
