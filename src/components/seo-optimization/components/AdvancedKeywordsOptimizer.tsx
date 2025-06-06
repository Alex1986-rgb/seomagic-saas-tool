
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, Target, TrendingUp, BarChart3, Search, Copy, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { advancedSeoService, type SeoOptimizationResult } from "@/services/seo/advancedSeoService";

const AdvancedKeywordsOptimizer: React.FC = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [analysisResult, setAnalysisResult] = useState<SeoOptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleAnalyze = async () => {
    if (!content.trim() || !keywords.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите контент и ключевые слова для анализа",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
      const result = await advancedSeoService.analyzeContent(content, keywordList);
      
      setAnalysisResult(result);
      setActiveTab('results');
      
      toast({
        title: "Анализ завершен",
        description: `Общий SEO-рейтинг: ${result.overallScore}/100`,
      });
    } catch (error) {
      toast({
        title: "Ошибка анализа",
        description: "Не удалось завершить анализ. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Текст скопирован в буфер обмена",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const KeywordCard: React.FC<{ keyword: any; type: 'primary' | 'secondary' }> = ({ keyword, type }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <CardTitle className="text-sm">{type === 'primary' ? 'Основное' : 'Вторичное'} ключевое слово</CardTitle>
          </div>
          <Badge variant={keyword.type === 'ВЧ' ? 'destructive' : keyword.type === 'СЧ' ? 'default' : 'secondary'}>
            {keyword.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Частота в тексте</Label>
            <p className="font-medium">{keyword.frequency} вхождений</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Объем поиска</Label>
            <p className="font-medium">{keyword.searchVolume.toLocaleString()}/мес</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Конкуренция</Label>
            <Badge variant={keyword.competition === 'высокая' ? 'destructive' : keyword.competition === 'средняя' ? 'default' : 'secondary'}>
              {keyword.competition}
            </Badge>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Сложность</Label>
            <div className="flex items-center gap-2">
              <Progress value={keyword.difficulty} className="w-16" />
              <span className="text-sm">{keyword.difficulty}%</span>
            </div>
          </div>
        </div>
        
        <div>
          <Label className="text-xs text-muted-foreground">LSI ключевые слова</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {keyword.lsiKeywords.slice(0, 3).map((lsi: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {lsi}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Продвинутый анализ ключевых слов
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Комплексный анализ SEO-оптимизации контента с учетом современных требований поисковых систем
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Исходные данные</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResult}>
            Результаты анализа
          </TabsTrigger>
          <TabsTrigger value="rules" disabled={!analysisResult}>
            Рекомендации
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Анализ SEO-оптимизации</CardTitle>
              <CardDescription>
                Введите контент страницы и целевые ключевые слова для глубокого анализа
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Контент страницы *</Label>
                <Textarea
                  id="content"
                  placeholder="Вставьте HTML-код страницы или текстовое содержимое для анализа..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="keywords">Целевые ключевые слова (через запятую)</Label>
                <Input
                  id="keywords"
                  placeholder="SEO оптимизация, продвижение сайта, поисковая оптимизация, анализ контента"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Укажите ВЧ, СЧ и НЧ запросы для комплексного анализа
                </p>
              </div>
              
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !content.trim() || !keywords.trim()}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Анализ SEO-оптимизации...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Провести анализ
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Общий рейтинг */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">SEO Рейтинг</CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {getScoreIcon(analysisResult.overallScore)}
                    <span className={`text-3xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                      {analysisResult.overallScore}/100
                    </span>
                  </div>
                  <Progress value={analysisResult.overallScore} className="w-48 mx-auto mt-2" />
                </CardHeader>
              </Card>

              {/* Анализ ключевых слов */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Анализ ключевых слов
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span>Плотность:</span>
                      <Badge variant={analysisResult.keywords.density >= 1 && analysisResult.keywords.density <= 2 ? 'default' : 'destructive'}>
                        {analysisResult.keywords.density.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-3">Основные ключевые слова</h4>
                      {analysisResult.keywords.primary.map((keyword, index) => (
                        <KeywordCard key={index} keyword={keyword} type="primary" />
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Вторичные ключевые слова</h4>
                      {analysisResult.keywords.secondary.map((keyword, index) => (
                        <KeywordCard key={index} keyword={keyword} type="secondary" />
                      ))}
                    </div>
                  </div>

                  {/* Распределение ключевых слов */}
                  <div>
                    <h4 className="font-medium mb-3">Распределение по элементам страницы</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(analysisResult.keywords.distribution).map(([element, hasKeyword]) => (
                        <div key={element} className="flex items-center gap-2 p-2 bg-muted rounded">
                          {hasKeyword ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm capitalize">{element}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Структура контента */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Структура контента
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold">{analysisResult.structure.headingStructure.h1.length}</div>
                      <div className="text-sm text-muted-foreground">H1 заголовки</div>
                      {analysisResult.structure.headingStructure.h1.length !== 1 && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mx-auto mt-1" />
                      )}
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold">{analysisResult.structure.headingStructure.h2.length}</div>
                      <div className="text-sm text-muted-foreground">H2 заголовки</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold">{analysisResult.structure.paragraphs.count}</div>
                      <div className="text-sm text-muted-foreground">Абзацы</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold">{analysisResult.structure.paragraphs.readabilityScore}</div>
                      <div className="text-sm text-muted-foreground">Читаемость</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Мета-данные */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Мета-данные
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">Заголовок (Title)</Label>
                        <div className="flex items-center gap-2">
                          <Badge variant={analysisResult.metadata.title.length <= 60 ? 'default' : 'destructive'}>
                            {analysisResult.metadata.title.length}/60
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(analysisResult.metadata.title.optimized)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                        {analysisResult.metadata.title.optimized}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">Описание (Description)</Label>
                        <div className="flex items-center gap-2">
                          <Badge variant={analysisResult.metadata.description.length <= 160 ? 'default' : 'destructive'}>
                            {analysisResult.metadata.description.length}/160
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(analysisResult.metadata.description.optimized)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                        {analysisResult.metadata.description.optimized}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Рекомендации */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Рекомендации по оптимизации
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={rec.priority === 'высокий' ? 'destructive' : rec.priority === 'средний' ? 'default' : 'secondary'}>
                            {rec.priority} приоритет
                          </Badge>
                          <span className="font-medium">{rec.category}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        <p className="text-sm">{rec.implementation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Правила SEO оптимизации */}
              <Card>
                <CardHeader>
                  <CardTitle>Правила SEO-оптимизированных текстов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        🔍 Ключевые слова и фразы
                      </h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Использовать ВЧ, СЧ, НЧ запросы (высокочастотные, среднечастотные, низкочастотные)</li>
                        <li>• Равномерно распределить по тексту: в заголовке, подзаголовках, первом абзаце, в теле и в мета-данных</li>
                        <li>• Не переоптимизировать: плотность — 1–2%</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        🧱 Структура текста
                      </h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Логичная и читаемая структура: H1 → H2 → H3</li>
                        <li>• Использование маркированных/нумерованных списков, абзацев, блоков с фактами</li>
                        <li>• Каждый блок должен отвечать на один конкретный вопрос</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        📚 Полнота раскрытия темы (LSI-контент)
                      </h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Текст должен содержать семантически близкие термины, связанные темы и подтемы</li>
                        <li>• Использовать подсказки из Google/Yandex и вопросы из People Also Ask</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        ⚙️ Мета-данные
                      </h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Title — до 60 символов, с ключом и УТП</li>
                        <li>• Description — до 160 символов, с ключом и призывом к действию</li>
                        <li>• Slug/URL — короткий, понятный, с ключевым словом</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        📈 Юзабилити и поведенческие факторы
                      </h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Удобочитаемость: короткие абзацы, читабельный шрифт</li>
                        <li>• Внутренние ссылки на другие статьи сайта</li>
                        <li>• Внешние ссылки на авторитетные источники (если уместно)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        📱 Адаптивность и скорость загрузки
                      </h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Адаптация под мобильные устройства</li>
                        <li>• Избегание тяжёлых элементов, оптимизация изображений</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        🔐 Уникальность и экспертность
                      </h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Уникальность текста &gt;90%</li>
                        <li>• Подтверждение экспертности — факты, статистика, ссылки на исследования, цитаты</li>
                        <li>• Использование тональности бренда (tone of voice)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        📊 Аналитика и обновление
                      </h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Установка целей в Google Analytics / Яндекс.Метрика</li>
                        <li>• Обновление текста при изменении алгоритмов или запросов</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedKeywordsOptimizer;
