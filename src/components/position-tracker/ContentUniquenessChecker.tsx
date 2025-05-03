
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertCircle, FileCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useProxyManager } from '@/hooks/use-proxy-manager';

interface ContentUniquenessCheckerProps {
  domain?: string;
  className?: string;
}

export const ContentUniquenessChecker: React.FC<ContentUniquenessCheckerProps> = ({ 
  domain = '',
  className = ''
}) => {
  const [inputDomain, setInputDomain] = useState(domain);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('results');
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();
  const { getRandomActiveProxy, activeProxies } = useProxyManager();
  
  // Set input domain when prop changes
  useEffect(() => {
    if (domain) {
      setInputDomain(domain);
    }
  }, [domain]);

  const handleCheck = async () => {
    if (!inputDomain) {
      toast({
        title: "Ошибка",
        description: "Введите домен для проверки",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsChecking(true);
      setProgress(0);
      
      // Check if we have active proxies
      const proxy = getRandomActiveProxy();
      
      if (!proxy && activeProxies.length === 0) {
        toast({
          title: "Внимание",
          description: "Нет активных прокси. Проверка может быть менее точной.",
          variant: "default",
        });
      }
      
      // Mock the checking progress
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress > 100) currentProgress = 100;
        setProgress(Math.round(currentProgress));
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          
          // Generate mock results after "checking" is done
          const mockResults = [
            { url: `https://${inputDomain}/about`, uniqueness: 87, wordCount: 1250, matches: 2 },
            { url: `https://${inputDomain}/services`, uniqueness: 95, wordCount: 2100, matches: 1 },
            { url: `https://${inputDomain}/blog/seo-tips`, uniqueness: 72, wordCount: 3200, matches: 5 },
            { url: `https://${inputDomain}/contact`, uniqueness: 98, wordCount: 750, matches: 0 },
            { url: `https://${inputDomain}/pricing`, uniqueness: 91, wordCount: 1500, matches: 2 },
          ];
          
          setResults(mockResults);
          setActiveTab('results');
          setIsChecking(false);
          
          toast({
            title: "Проверка завершена",
            description: `Проанализировано ${mockResults.length} страниц на сайте ${inputDomain}`,
          });
        }
      }, 500);
      
    } catch (error) {
      console.error("Ошибка при проверке уникальности:", error);
      toast({
        title: "Ошибка проверки",
        description: error instanceof Error ? error.message : "Неизвестная ошибка при проверке уникальности контента",
        variant: "destructive",
      });
      setIsChecking(false);
    }
  };
  
  // Calculate average uniqueness
  const averageUniqueness = results.length > 0 
    ? Math.round(results.reduce((acc, item) => acc + item.uniqueness, 0) / results.length) 
    : 0;
  
  // Prepare chart data
  const chartData = results.map(item => ({
    name: new URL(item.url).pathname,
    uniqueness: item.uniqueness,
    wordCount: item.wordCount / 100 // Scale down for better visualization
  }));

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Проверка уникальности контента
          </CardTitle>
          <CardDescription>
            Анализ уникальности текстового содержимого страниц вашего сайта
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="domain-input">Домен для проверки</Label>
                <Input
                  id="domain-input"
                  value={inputDomain}
                  onChange={(e) => setInputDomain(e.target.value)}
                  placeholder="example.com"
                  disabled={isChecking}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleCheck} 
                  disabled={isChecking || !inputDomain}
                  className="gap-2"
                >
                  <Search className="h-4 w-4" />
                  {isChecking ? 'Проверка...' : 'Проверить уникальность'}
                </Button>
              </div>
            </div>
            
            {isChecking && (
              <div className="space-y-2 py-4">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Проверка уникальности контента... {progress}%
                </p>
              </div>
            )}
            
            {!isChecking && results.length > 0 && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="results">Результаты</TabsTrigger>
                  <TabsTrigger value="chart">Графики</TabsTrigger>
                </TabsList>
                
                <TabsContent value="results">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Средняя уникальность контента</h4>
                        <div className={`text-lg font-bold ${
                          averageUniqueness >= 90 ? 'text-green-500' : 
                          averageUniqueness >= 70 ? 'text-amber-500' : 
                          'text-red-500'
                        }`}>
                          {averageUniqueness}%
                        </div>
                      </div>
                    </div>
                    
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">URL страницы</th>
                          <th className="text-center p-3 text-sm font-medium text-muted-foreground">Уникальность</th>
                          <th className="text-center p-3 text-sm font-medium text-muted-foreground">Объем текста</th>
                          <th className="text-center p-3 text-sm font-medium text-muted-foreground">Совпадения</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                            <td className="p-3 truncate max-w-[200px]">
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary hover:underline"
                              >
                                {new URL(item.url).pathname || '/'}
                              </a>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`font-medium ${
                                item.uniqueness >= 90 ? 'text-green-500' : 
                                item.uniqueness >= 70 ? 'text-amber-500' : 
                                'text-red-500'
                              }`}>
                                {item.uniqueness}%
                              </span>
                            </td>
                            <td className="p-3 text-center">{item.wordCount} слов</td>
                            <td className="p-3 text-center">
                              {item.matches > 0 ? (
                                <span className="text-red-500">{item.matches}</span>
                              ) : (
                                <span className="text-green-500">0</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {results.some(item => item.uniqueness < 70) && (
                    <Alert className="mt-4" variant="warning">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Обнаружены страницы с низкой уникальностью контента. Рекомендуется переработать
                        эти тексты для улучшения SEO-показателей.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
                
                <TabsContent value="chart">
                  <div className="space-y-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            label={{ value: 'Страница', position: 'insideBottom', offset: -5 }} 
                          />
                          <YAxis yAxisId="left" orientation="left" label={{ value: 'Уникальность (%)', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" label={{ value: 'Объем (x100 слов)', angle: 90, position: 'insideRight' }} />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="uniqueness" name="Уникальность %" fill="#8884d8" />
                          <Bar yAxisId="right" dataKey="wordCount" name="Объем текста" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-muted/20">
                      <h4 className="font-medium mb-2">Интерпретация результатов:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <strong className="text-green-500">Высокая уникальность (90-100%)</strong>: 
                          Отличный показатель, контент уникален и хорошо воспринимается поисковыми системами
                        </li>
                        <li>
                          <strong className="text-amber-500">Средняя уникальность (70-89%)</strong>: 
                          Приемлемый показатель, но рекомендуется улучшить уникальность для лучшего ранжирования
                        </li>
                        <li>
                          <strong className="text-red-500">Низкая уникальность (&lt;70%)</strong>: 
                          Требуется переработка текста, высокий риск пессимизации в поисковых системах
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            
            {!isChecking && results.length === 0 && !domain && (
              <div className="text-center py-8">
                <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Введите домен и нажмите "Проверить уникальность" для анализа контента
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
