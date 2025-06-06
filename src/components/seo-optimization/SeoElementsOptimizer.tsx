
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Loader2, Wand2, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiOptimizationService, type SeoOptimizationResponse } from '@/services/seo/aiOptimizationService';

const SeoElementsOptimizer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SeoOptimizationResponse | null>(null);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!apiKey || !content) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите API ключ и контент для оптимизации",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      aiOptimizationService.setApiKey(apiKey);
      
      const optimizationResult = await aiOptimizationService.optimizeSeoElements({
        content,
        targetKeywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      });
      
      setResult(optimizationResult);
      
      toast({
        title: "Оптимизация завершена",
        description: "SEO элементы успешно оптимизированы с помощью ИИ",
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Ошибка оптимизации",
        description: "Произошла ошибка при оптимизации. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ИИ Оптимизация SEO Элементов
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Автоматическая оптимизация заголовков, мета-описаний и ключевых слов с помощью искусственного интеллекта
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Настройки оптимизации
          </CardTitle>
          <CardDescription>
            Введите данные для анализа и оптимизации SEO элементов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL сайта (опционально)</label>
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">OpenAI API ключ *</label>
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Целевые ключевые слова</label>
            <Input
              placeholder="SEO оптимизация, продвижение сайта, анализ контента"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Разделите ключевые слова запятыми
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Контент для анализа *</label>
            <Textarea
              placeholder="Введите текст вашей страницы для анализа и оптимизации..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>

          <Button 
            onClick={handleOptimize}
            disabled={isLoading || !content || !apiKey}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Оптимизация в процессе...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Оптимизировать SEO элементы
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Результаты оптимизации</h2>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold">
                Общий балл: <span className={getScoreColor(result.overallScore)}>{result.overallScore}/100</span>
              </span>
            </div>
          </div>

          <Tabs defaultValue="title" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="title">Заголовок</TabsTrigger>
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="keywords">Ключевые слова</TabsTrigger>
              <TabsTrigger value="headings">Заголовки</TabsTrigger>
            </TabsList>

            <TabsContent value="title" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Оптимизация заголовка</CardTitle>
                    <Badge variant={getScoreBadgeVariant(result.title.score)}>
                      {result.title.score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Исходный заголовок:</h4>
                    <p className="p-3 bg-muted rounded-lg">{result.title.original}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-green-600 mb-2">Оптимизированный заголовок:</h4>
                    <p className="p-3 bg-green-50 border border-green-200 rounded-lg">{result.title.optimized}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Длина: </span>
                      <span className="font-medium">{result.title.characterCount} символов</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Плотность ключевых слов: </span>
                      <span className="font-medium">{result.title.keywordDensity}%</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Улучшения:</h4>
                    <ul className="space-y-1">
                      {result.title.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Оптимизация мета-описания</CardTitle>
                    <Badge variant={getScoreBadgeVariant(result.metaDescription.score)}>
                      {result.metaDescription.score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Исходное описание:</h4>
                    <p className="p-3 bg-muted rounded-lg">{result.metaDescription.original}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-green-600 mb-2">Оптимизированное описание:</h4>
                    <p className="p-3 bg-green-50 border border-green-200 rounded-lg">{result.metaDescription.optimized}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Длина: </span>
                      <span className="font-medium">{result.metaDescription.characterCount} символов</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Плотность ключевых слов: </span>
                      <span className="font-medium">{result.metaDescription.keywordDensity}%</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Улучшения:</h4>
                    <ul className="space-y-1">
                      {result.metaDescription.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Анализ ключевых слов</CardTitle>
                    <Badge variant={getScoreBadgeVariant(result.keywords.relevanceScore)}>
                      {result.keywords.relevanceScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Основные ключевые слова</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.primary.map((keyword, index) => (
                        <Badge key={index} variant="default">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Дополнительные ключевые слова</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.secondary.map((keyword, index) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Длинные ключевые фразы</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.longTail.map((keyword, index) => (
                        <Badge key={index} variant="outline">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="headings" className="space-y-4">
              <div className="space-y-4">
                {result.headings.h1.map((heading, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">H1 Заголовок</CardTitle>
                        <Badge variant={getScoreBadgeVariant(heading.score)}>
                          {heading.score}/100
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Исходный:</h4>
                        <p className="p-3 bg-muted rounded-lg">{heading.original}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-green-600 mb-2">Оптимизированный:</h4>
                        <p className="p-3 bg-green-50 border border-green-200 rounded-lg">{heading.optimized}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Улучшения:</h4>
                        <ul className="space-y-1">
                          {heading.improvements.map((improvement, improvementIndex) => (
                            <li key={improvementIndex} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {result.headings.h2.map((heading, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">H2 Заголовок #{index + 1}</CardTitle>
                        <Badge variant={getScoreBadgeVariant(heading.score)}>
                          {heading.score}/100
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Исходный:</h4>
                        <p className="p-3 bg-muted rounded-lg">{heading.original}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-green-600 mb-2">Оптимизированный:</h4>
                        <p className="p-3 bg-green-50 border border-green-200 rounded-lg">{heading.optimized}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Улучшения:</h4>
                        <ul className="space-y-1">
                          {heading.improvements.map((improvement, improvementIndex) => (
                            <li key={improvementIndex} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {result.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Дополнительные рекомендации</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SeoElementsOptimizer;
