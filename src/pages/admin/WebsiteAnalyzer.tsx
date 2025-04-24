
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { openaiService } from '@/services/api/openaiService';
import { useToast } from '@/hooks/use-toast';
import { Search, Link2, Download, FileText, AlertTriangle, Sparkles } from 'lucide-react';
import ContentOptimizationAI from '../components/audit/results/components/ContentOptimizationAI';

const WebsiteAnalyzer: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [aiOptimizationResults, setAIOptimizationResults] = useState<any>(null);
  const { toast } = useToast();
  
  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: "URL не указан",
        description: "Пожалуйста, введите URL сайта для анализа",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Анализ начат",
        description: `Анализируем сайт: ${url}`,
      });
      
      // Имитация анализа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Имитация результатов анализа
      const mockResults = {
        title: "Пример сайта - Главная страница",
        metaTags: {
          description: "Это пример описания для демонстрации анализа сайта.",
          keywords: "анализ, сайт, пример, демонстрация"
        },
        pageCount: 12,
        issuesCount: 8,
        score: 65,
        recommendations: [
          "Добавить мета-описания на 3 страницы",
          "Оптимизировать заголовки H1 на 5 страницах",
          "Улучшить содержимое на 2 страницах"
        ]
      };
      
      setAnalysisResults(mockResults);
      
      toast({
        title: "Анализ завершен",
        description: "Результаты анализа готовы",
      });
    } catch (error) {
      toast({
        title: "Ошибка анализа",
        description: "Произошла ошибка при анализе сайта",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleAIOptimizationStart = () => {
    setAIOptimizationResults(null);
    toast({
      title: "AI Оптимизация",
      description: "Начинаем оптимизацию с помощью OpenAI",
    });
  };
  
  const handleAIOptimizationComplete = (results: any) => {
    setAIOptimizationResults(results);
  };

  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-[#222222] to-[#1a1a1a] text-white shadow-lg flex flex-col md:flex-row items-center gap-8 border border-white/10">
          <div className="flex-shrink-0 bg-primary/20 text-primary rounded-full p-6 shadow-inner border border-primary/20">
            <Search className="h-12 w-12" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Анализатор сайтов
            </h1>
            <p className="text-gray-400 text-lg">
              Анализируйте и оптимизируйте SEO параметры любого сайта с помощью OpenAI
            </p>
            
            <div className="mt-6 flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Введите URL сайта (например, example.com)"
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing} 
                className="whitespace-nowrap"
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white mr-2" />
                    Анализ...
                  </span>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Анализировать
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {!openaiService.getApiKey() && (
          <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-yellow-700/30 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-300 mb-1">API ключ OpenAI не настроен</h4>
                  <p className="text-sm text-yellow-200/70">
                    Для использования AI оптимизации необходимо настроить API ключ OpenAI.
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-yellow-400 mt-2"
                    onClick={() => window.location.href = '/admin/settings/openai'}
                  >
                    Перейти к настройкам
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {analysisResults && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg">
                <CardHeader className="border-b border-white/10 bg-black/20">
                  <CardTitle>Результаты анализа</CardTitle>
                  <CardDescription>
                    Основная информация и рекомендации для сайта {url}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <Tabs defaultValue="summary">
                    <TabsList className="bg-black/20 border-white/10">
                      <TabsTrigger value="summary">Сводка</TabsTrigger>
                      <TabsTrigger value="issues">Проблемы</TabsTrigger>
                      <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary" className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Информация о сайте</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-white/10 rounded-md p-3 bg-black/20">
                              <div className="text-sm text-gray-400">Заголовок</div>
                              <div className="font-medium">{analysisResults.title}</div>
                            </div>
                            <div className="border border-white/10 rounded-md p-3 bg-black/20">
                              <div className="text-sm text-gray-400">Мета-описание</div>
                              <div className="font-medium">{analysisResults.metaTags.description}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Общие показатели</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="border border-white/10 rounded-md p-3 bg-black/20 flex flex-col items-center">
                              <div className="text-sm text-gray-400">SEO Оценка</div>
                              <div className="font-medium text-xl text-primary">{analysisResults.score}/100</div>
                            </div>
                            <div className="border border-white/10 rounded-md p-3 bg-black/20 flex flex-col items-center">
                              <div className="text-sm text-gray-400">Кол-во страниц</div>
                              <div className="font-medium text-xl">{analysisResults.pageCount}</div>
                            </div>
                            <div className="border border-white/10 rounded-md p-3 bg-black/20 flex flex-col items-center">
                              <div className="text-sm text-gray-400">Проблемы</div>
                              <div className="font-medium text-xl text-amber-500">{analysisResults.issuesCount}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="issues" className="pt-4">
                      <div className="space-y-3">
                        <div className="p-3 border border-white/10 rounded-md bg-black/20">
                          <div className="flex items-center gap-2 text-amber-500 mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Отсутствующие мета-описания</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            На 3 страницах отсутствуют мета-описания, что негативно влияет на их отображение в результатах поиска.
                          </p>
                        </div>
                        
                        <div className="p-3 border border-white/10 rounded-md bg-black/20">
                          <div className="flex items-center gap-2 text-amber-500 mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Проблемы с заголовками</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            На 5 страницах заголовки H1 не оптимизированы для ключевых слов или отсутствуют.
                          </p>
                        </div>
                        
                        <div className="p-3 border border-white/10 rounded-md bg-black/20">
                          <div className="flex items-center gap-2 text-amber-500 mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Недостаточное содержимое</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            На 2 страницах недостаточно контента для эффективной индексации.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="recommendations" className="pt-4">
                      <ul className="space-y-3">
                        {analysisResults.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="p-3 border border-white/10 rounded-md bg-black/20">
                            <div className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-medium text-xs">
                                {index + 1}
                              </div>
                              <span className="text-gray-200">{rec}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <ContentOptimizationAI
                url={url}
                onOptimizationStart={handleAIOptimizationStart}
                onOptimizationComplete={handleAIOptimizationComplete}
              />
              
              <div className="grid grid-cols-1 gap-4 mt-6">
                <Button variant="outline" className="bg-black/20 border-white/10 text-white hover:bg-white/5">
                  <Download className="mr-2 h-4 w-4" />
                  Скачать отчет PDF
                </Button>
                
                <Button variant="outline" className="bg-black/20 border-white/10 text-white hover:bg-white/5">
                  <Link2 className="mr-2 h-4 w-4" />
                  Скачать копию сайта
                </Button>
                
                <Button variant="outline" className="bg-black/20 border-white/10 text-white hover:bg-white/5">
                  <FileText className="mr-2 h-4 w-4" />
                  Экспорт данных JSON
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {aiOptimizationResults && (
          <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-primary/20 shadow-lg">
            <CardHeader className="border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Результаты AI оптимизации</CardTitle>
              </div>
              <CardDescription>
                Улучшения, выполненные с помощью OpenAI
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-md border border-white/10">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Рекомендации по оптимизации
                  </h3>
                  
                  <ul className="space-y-2">
                    {aiOptimizationResults.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-medium text-xs">
                          {index + 1}
                        </span>
                        <span className="text-gray-200">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default WebsiteAnalyzer;
