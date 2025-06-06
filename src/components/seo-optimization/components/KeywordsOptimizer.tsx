
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Search, TrendingUp, Target, Lightbulb, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  opportunity: number;
  cpc: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
}

interface KeywordAnalysis {
  primary: KeywordSuggestion[];
  secondary: KeywordSuggestion[];
  longTail: KeywordSuggestion[];
  competitors: string[];
  suggestions: string[];
}

const KeywordsOptimizer: React.FC = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seedKeywords, setSeedKeywords] = useState('');
  const [contentText, setContentText] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!seedKeywords.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите исходные ключевые слова для анализа",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: KeywordAnalysis = {
        primary: [
          {
            keyword: "seo оптимизация",
            volume: 12000,
            difficulty: 65,
            opportunity: 85,
            cpc: 2.50,
            intent: 'commercial'
          },
          {
            keyword: "продвижение сайта",
            volume: 8500,
            difficulty: 58,
            opportunity: 90,
            cpc: 3.20,
            intent: 'commercial'
          },
          {
            keyword: "поисковая оптимизация",
            volume: 6800,
            difficulty: 62,
            opportunity: 75,
            cpc: 2.80,
            intent: 'informational'
          }
        ],
        secondary: [
          {
            keyword: "seo аудит сайта",
            volume: 4200,
            difficulty: 45,
            opportunity: 88,
            cpc: 1.90,
            intent: 'commercial'
          },
          {
            keyword: "оптимизация контента",
            volume: 3600,
            difficulty: 52,
            opportunity: 82,
            cpc: 2.10,
            intent: 'informational'
          },
          {
            keyword: "анализ конкурентов seo",
            volume: 2800,
            difficulty: 48,
            opportunity: 85,
            cpc: 2.30,
            intent: 'commercial'
          }
        ],
        longTail: [
          {
            keyword: "как сделать seo оптимизацию сайта",
            volume: 1200,
            difficulty: 35,
            opportunity: 95,
            cpc: 1.50,
            intent: 'informational'
          },
          {
            keyword: "лучшие инструменты для seo",
            volume: 950,
            difficulty: 42,
            opportunity: 90,
            cpc: 1.80,
            intent: 'informational'
          },
          {
            keyword: "заказать продвижение сайта недорого",
            volume: 850,
            difficulty: 38,
            opportunity: 92,
            cpc: 2.60,
            intent: 'transactional'
          }
        ],
        competitors: [
          "seotool.ru",
          "pr-cy.ru", 
          "megaindex.com",
          "serpstat.com"
        ],
        suggestions: [
          "Фокусируйтесь на длинных ключевых фразах с низкой конкуренцией",
          "Добавьте географические модификаторы для локального SEO",
          "Используйте LSI ключевые слова для контекстной релевантности",
          "Оптимизируйте под голосовой поиск с помощью вопросительных фраз"
        ]
      };
      
      setAnalysis(mockAnalysis);
      
      toast({
        title: "Анализ завершен",
        description: "Найдены релевантные ключевые слова для оптимизации",
      });
    } catch (error) {
      toast({
        title: "Ошибка анализа",
        description: "Не удалось проанализировать ключевые слова",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyKeywords = (keywords: KeywordSuggestion[]) => {
    const text = keywords.map(k => k.keyword).join(', ');
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Ключевые слова скопированы в буфер обмена",
    });
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'transactional': return 'bg-blue-100 text-blue-800';
      case 'informational': return 'bg-yellow-100 text-yellow-800';
      case 'navigational': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const KeywordCard: React.FC<{ keyword: KeywordSuggestion; index: number }> = ({ keyword, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm leading-tight">{keyword.keyword}</h4>
              <Badge className={getIntentColor(keyword.intent)} variant="secondary">
                {keyword.intent}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Объем поиска:</span>
                <span className="font-medium">{keyword.volume.toLocaleString()}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Сложность:</span>
                  <span className="font-medium">{keyword.difficulty}%</span>
                </div>
                <Progress value={keyword.difficulty} className="h-1" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Возможность:</span>
                  <span className="font-medium">{keyword.opportunity}%</span>
                </div>
                <Progress value={keyword.opportunity} className="h-1" />
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">CPC:</span>
                <span className="font-medium">${keyword.cpc}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          ИИ Анализ и Оптимизация Ключевых Слов
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Найдите наиболее релевантные ключевые слова для вашего контента 
          с помощью искусственного интеллекта и данных поисковых систем
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Исходные данные для анализа
          </CardTitle>
          <CardDescription>
            Введите информацию о вашем контенте для получения релевантных ключевых слов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="keywords">Исходные ключевые слова *</Label>
              <Input
                id="keywords"
                placeholder="SEO, оптимизация, продвижение сайта"
                value={seedKeywords}
                onChange={(e) => setSeedKeywords(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="audience">Целевая аудитория</Label>
              <Input
                id="audience"
                placeholder="Владельцы бизнеса, маркетологи"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="content">Описание контента (опционально)</Label>
            <Textarea
              id="content"
              placeholder="Опишите тематику вашего контента для более точного анализа ключевых слов..."
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !seedKeywords.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Search className="mr-2 h-4 w-4 animate-spin" />
                Анализ ключевых слов...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Найти ключевые слова
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="primary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="primary">
                <Target className="mr-2 h-4 w-4" />
                Основные
              </TabsTrigger>
              <TabsTrigger value="secondary">Дополнительные</TabsTrigger>
              <TabsTrigger value="longtail">Длинные фразы</TabsTrigger>
              <TabsTrigger value="suggestions">Рекомендации</TabsTrigger>
            </TabsList>

            <TabsContent value="primary" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Основные ключевые слова</h3>
                <Button variant="outline" onClick={() => copyKeywords(analysis.primary)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Копировать все
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.primary.map((keyword, index) => (
                  <KeywordCard key={keyword.keyword} keyword={keyword} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="secondary" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Дополнительные ключевые слова</h3>
                <Button variant="outline" onClick={() => copyKeywords(analysis.secondary)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Копировать все
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.secondary.map((keyword, index) => (
                  <KeywordCard key={keyword.keyword} keyword={keyword} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="longtail" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Длинные ключевые фразы</h3>
                <Button variant="outline" onClick={() => copyKeywords(analysis.longTail)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Копировать все
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.longTail.map((keyword, index) => (
                  <KeywordCard key={keyword.keyword} keyword={keyword} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Рекомендации по оптимизации
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.suggestions.map((suggestion, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <p className="text-sm">{suggestion}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Анализ конкурентов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Основные конкуренты в поисковой выдаче:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.competitors.map((competitor, index) => (
                        <Badge key={index} variant="outline">
                          {competitor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
};

export default KeywordsOptimizer;
