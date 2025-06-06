
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, Wand2, Copy, CheckCircle2, AlertTriangle, Target, TrendingUp, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { aiOptimizationService, type OptimizationResult } from "@/services/seo/aiOptimizationService";
import { useMobile } from "@/hooks/use-mobile";

const SeoElementsOptimizer: React.FC = () => {
  const { toast } = useToast();
  const { isMobile } = useMobile();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [content, setContent] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleOptimize = useCallback(async () => {
    if (!content.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите контент для оптимизации",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      const keywords = targetKeywords.split(',').map(k => k.trim()).filter(Boolean);
      const result = await aiOptimizationService.optimizeContent(content, keywords);
      
      setOptimizationResult(result);
      setActiveTab('results');
      
      toast({
        title: "Оптимизация завершена",
        description: "SEO элементы успешно оптимизированы",
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Ошибка оптимизации",
        description: "Не удалось завершить оптимизацию. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  }, [content, targetKeywords, toast]);

  const copyToClipboard = useCallback((text: string) => {
    if (!navigator.clipboard) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Скопировано",
          description: "Текст скопирован в буфер обмена",
        });
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Скопировано",
        description: "Текст скопирован в буфер обмена",
      });
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  }, [toast]);

  const getScoreColor = useMemo(() => (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }, []);

  const getScoreIcon = useMemo(() => (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
    return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-6 md:mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold mb-3 md:mb-4"
        >
          ИИ Оптимизация SEO Элементов
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base"
        >
          Автоматическая оптимизация заголовков, мета-описаний и ключевых слов с помощью искусственного интеллекта
        </motion.p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
          <TabsTrigger value="input" className="text-xs md:text-sm">
            <Wand2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            {isMobile ? 'Ввод' : 'Исходные данные'}
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!optimizationResult} className="text-xs md:text-sm">
            <Target className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            {isMobile ? 'Результат' : 'Результаты'}
          </TabsTrigger>
          {!isMobile && (
            <TabsTrigger value="analytics" disabled={!optimizationResult} className="text-xs md:text-sm">
              <TrendingUp className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              Аналитика
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="input" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Оптимизация SEO-элементов</CardTitle>
              <CardDescription className="text-sm">
                Введите контент страницы и целевые ключевые слова
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content" className="text-sm font-medium">Контент страницы *</Label>
                <Textarea
                  id="content"
                  placeholder="Вставьте текст страницы или HTML-код для анализа и оптимизации..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] md:min-h-[200px] mt-2 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="keywords" className="text-sm font-medium">Целевые ключевые слова (через запятую)</Label>
                <Input
                  id="keywords"
                  placeholder="SEO оптимизация, продвижение сайта, поисковая оптимизация"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                  className="mt-2 text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Необязательно. Если не указаны, ключевые слова будут извлечены автоматически
                </p>
              </div>
              
              <Button 
                onClick={handleOptimize}
                disabled={isOptimizing || !content.trim()}
                className="w-full"
                size={isMobile ? "default" : "lg"}
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Оптимизация...
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
        </TabsContent>

        <TabsContent value="results" className="space-y-4 md:space-y-6">
          <AnimatePresence>
            {optimizationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 md:space-y-6"
              >
                {/* Общий рейтинг SEO */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="text-lg md:text-2xl">SEO Рейтинг</CardTitle>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {getScoreIcon(optimizationResult.overallScore)}
                      <span className={`text-2xl md:text-3xl font-bold ${getScoreColor(optimizationResult.overallScore)}`}>
                        {optimizationResult.overallScore}/100
                      </span>
                    </div>
                    <Progress value={optimizationResult.overallScore} className="w-32 md:w-48 mx-auto mt-2" />
                  </CardHeader>
                </Card>

                {/* Оптимизированные элементы */}
                <div className="grid gap-4 md:gap-6">
                  {/* Title */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base md:text-lg flex items-center gap-2">
                          <Search className="h-4 w-4 md:h-5 md:w-5" />
                          Заголовок (Title)
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={optimizationResult.title.length <= 60 ? 'default' : 'destructive'} className="text-xs">
                            {optimizationResult.title.length}/60
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(optimizationResult.title)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 md:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm md:text-base">
                        {optimizationResult.title}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base md:text-lg">Мета-описание (Description)</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={optimizationResult.description.length <= 160 ? 'default' : 'destructive'} className="text-xs">
                            {optimizationResult.description.length}/160
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(optimizationResult.description)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 md:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm md:text-base">
                        {optimizationResult.description}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base md:text-lg">Ключевые слова</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {optimizationResult.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs md:text-sm">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(optimizationResult.keywords.join(', '))}
                        className="mt-3 text-xs"
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Копировать все
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  {optimizationResult.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base md:text-lg">Рекомендации</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {optimizationResult.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 border rounded-lg text-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                                  {rec.priority === 'high' ? 'Высокий' : rec.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                                </Badge>
                                <span className="font-medium text-xs md:text-sm">{rec.category}</span>
                              </div>
                              <p className="text-muted-foreground text-xs md:text-sm">{rec.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {!isMobile && (
          <TabsContent value="analytics" className="space-y-6">
            {optimizationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Детальная аналитика SEO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded">
                        <div className="text-2xl font-bold">{optimizationResult.title.length}</div>
                        <div className="text-sm text-muted-foreground">Символов в заголовке</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded">
                        <div className="text-2xl font-bold">{optimizationResult.description.length}</div>
                        <div className="text-sm text-muted-foreground">Символов в описании</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded">
                        <div className="text-2xl font-bold">{optimizationResult.keywords.length}</div>
                        <div className="text-sm text-muted-foreground">Ключевых слов</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SeoElementsOptimizer;
