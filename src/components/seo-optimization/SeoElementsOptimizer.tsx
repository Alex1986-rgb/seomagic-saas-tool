
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface OptimizedElement {
  original: string;
  optimized: string;
  score: number;
  suggestions: string[];
}

interface SeoOptimizationResult {
  title: OptimizedElement;
  metaDescription: OptimizedElement;
  keywords: {
    original: string[];
    optimized: string[];
    suggestions: string[];
    relevanceScore: number;
  };
  headings: {
    h1: OptimizedElement[];
    h2: OptimizedElement[];
    h3: OptimizedElement[];
  };
}

const SeoElementsOptimizer: React.FC = () => {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [pageContent, setPageContent] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [optimizationResult, setOptimizationResult] = useState<SeoOptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleOptimize = async () => {
    if (!pageContent.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите содержимое страницы для оптимизации",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      // Симуляция ИИ оптимизации
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult: SeoOptimizationResult = {
        title: {
          original: "Старый заголовок страницы",
          optimized: "SEO-оптимизированный заголовок с ключевыми словами | Бренд",
          score: 92,
          suggestions: [
            "Включены основные ключевые слова",
            "Оптимальная длина (55 символов)",
            "Добавлен брендинг"
          ]
        },
        metaDescription: {
          original: "Краткое описание страницы",
          optimized: "Подробное SEO-описание страницы с ключевыми словами, которое увеличивает CTR и привлекает целевую аудиторию. Узнайте больше!",
          score: 88,
          suggestions: [
            "Включен призыв к действию",
            "Оптимальная длина (155 символов)",
            "Использованы эмоциональные триггеры"
          ]
        },
        keywords: {
          original: targetKeywords.split(',').map(k => k.trim()).filter(Boolean),
          optimized: ["seo оптимизация", "продвижение сайта", "поисковая оптимизация", "увеличение трафика"],
          suggestions: ["seo аудит", "анализ сайта", "позиции в поиске"],
          relevanceScore: 95
        },
        headings: {
          h1: [{
            original: "Обычный заголовок",
            optimized: "SEO-оптимизированный H1 заголовок с ключевыми словами",
            score: 90,
            suggestions: ["Включены целевые ключевые слова", "Оптимальная длина"]
          }],
          h2: [
            {
              original: "Подзаголовок 1",
              optimized: "Как улучшить SEO оптимизацию сайта",
              score: 85,
              suggestions: ["Добавлен вопросительный формат"]
            },
            {
              original: "Подзаголовок 2", 
              optimized: "Преимущества профессиональной SEO оптимизации",
              score: 87,
              suggestions: ["Включены коммерческие интенции"]
            }
          ],
          h3: []
        }
      };
      
      setOptimizationResult(mockResult);
      setActiveTab('results');
      
      toast({
        title: "Оптимизация завершена",
        description: "SEO-элементы успешно оптимизированы с помощью ИИ",
      });
    } catch (error) {
      toast({
        title: "Ошибка оптимизации",
        description: "Не удалось завершить оптимизацию. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Текст скопирован в буфер обмена",
    });
  };

  const ScoreIndicator: React.FC<{ score: number }> = ({ score }) => (
    <div className="flex items-center gap-2">
      {score >= 90 ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : score >= 70 ? (
        <AlertCircle className="h-4 w-4 text-yellow-500" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-500" />
      )}
      <Badge variant={score >= 90 ? "default" : score >= 70 ? "secondary" : "destructive"}>
        {score}/100
      </Badge>
    </div>
  );

  const OptimizedElementCard: React.FC<{
    title: string;
    element: OptimizedElement;
    type: string;
  }> = ({ title, element, type }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <ScoreIndicator score={element.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Оригинал:</Label>
          <p className="text-sm p-2 bg-muted rounded mt-1">{element.original}</p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs text-green-700 dark:text-green-400">Оптимизированная версия:</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(element.optimized)}
              className="h-6 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            {element.optimized}
          </p>
        </div>
        
        <div>
          <Label className="text-xs text-muted-foreground">Улучшения:</Label>
          <ul className="text-xs mt-1 space-y-1">
            {element.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          ИИ Оптимизация SEO-элементов
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Автоматическая оптимизация заголовков, мета-описаний и ключевых слов 
          с помощью искусственного интеллекта для повышения рейтинга в поиске
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Исходные данные</TabsTrigger>
          <TabsTrigger value="results" disabled={!optimizationResult}>
            Результаты оптимизации
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Содержимое для оптимизации</CardTitle>
              <CardDescription>
                Введите текст страницы и целевые ключевые слова для генерации оптимизированных SEO-элементов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Содержимое страницы *</Label>
                <Textarea
                  id="content"
                  placeholder="Вставьте текст вашей страницы для анализа и оптимизации..."
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  className="min-h-[200px] mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="keywords">Целевые ключевые слова (через запятую)</Label>
                <Input
                  id="keywords"
                  placeholder="SEO оптимизация, продвижение сайта, поисковая оптимизация"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <Button 
                onClick={handleOptimize}
                disabled={isOptimizing || !pageContent.trim()}
                className="w-full"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Оптимизация с помощью ИИ...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Оптимизировать SEO-элементы
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {optimizationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Title Optimization */}
              <OptimizedElementCard
                title="Заголовок страницы (Title)"
                element={optimizationResult.title}
                type="title"
              />

              {/* Meta Description */}
              <OptimizedElementCard
                title="Мета-описание (Meta Description)"
                element={optimizationResult.metaDescription}
                type="description"
              />

              {/* Keywords */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Ключевые слова</CardTitle>
                    <Badge variant="default">{optimizationResult.keywords.relevanceScore}/100</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Исходные:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {optimizationResult.keywords.original.map((keyword, index) => (
                        <Badge key={index} variant="outline">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-green-700 dark:text-green-400">Оптимизированные:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {optimizationResult.keywords.optimized.map((keyword, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Дополнительные предложения:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {optimizationResult.keywords.suggestions.map((keyword, index) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Headings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Оптимизированные заголовки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {optimizationResult.headings.h1.map((heading, index) => (
                    <OptimizedElementCard
                      key={`h1-${index}`}
                      title={`H1 заголовок ${index + 1}`}
                      element={heading}
                      type="h1"
                    />
                  ))}
                  
                  {optimizationResult.headings.h2.map((heading, index) => (
                    <OptimizedElementCard
                      key={`h2-${index}`}
                      title={`H2 заголовок ${index + 1}`}
                      element={heading}
                      type="h2"
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Action buttons */}
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setActiveTab('input')} variant="outline">
                  Оптимизировать еще
                </Button>
                <Button onClick={() => copyToClipboard(JSON.stringify(optimizationResult, null, 2))}>
                  Экспортировать результаты
                </Button>
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeoElementsOptimizer;
