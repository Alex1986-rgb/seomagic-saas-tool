
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, ArrowRight, AlertTriangle, AlertCircle, Info, Lightbulb, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface OptimizationSectionProps {
  url: string;
  auditData: any;
}

const OptimizationSection: React.FC<OptimizationSectionProps> = ({ url, auditData }) => {
  const [optimizationInProgress, setOptimizationInProgress] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationStage, setOptimizationStage] = useState('');
  
  // Extract issues data from audit
  const criticalIssues = auditData?.issues?.critical || [];
  const importantIssues = auditData?.issues?.important || [];
  const opportunities = auditData?.issues?.opportunities || [];
  const minorIssues = auditData?.issues?.minor || [];
  const passedChecks = auditData?.issues?.passed || [];
  
  // Calculate total issues count
  const totalIssuesCount = criticalIssues.length + importantIssues.length + 
                          opportunities.length + minorIssues.length;
  
  // Calculate optimization costs based on issues
  const calculateCost = () => {
    const baseCost = 5000;
    const criticalCost = criticalIssues.length * 1500;
    const importantCost = importantIssues.length * 800;
    const opportunitiesCost = opportunities.length * 400;
    const minorCost = minorIssues.length * 200;
    
    return {
      baseCost,
      criticalCost,
      importantCost,
      opportunitiesCost,
      minorCost,
      total: baseCost + criticalCost + importantCost + opportunitiesCost + minorCost
    };
  };
  
  const costs = calculateCost();
  
  // Prepare optimization items
  const optimizationItems = [
    {
      name: "Исправление критических проблем",
      description: "Устранение серьезных проблем, блокирующих продвижение сайта",
      count: criticalIssues.length,
      price: 1500,
      totalPrice: costs.criticalCost
    },
    {
      name: "Исправление важных проблем",
      description: "Решение важных проблем, влияющих на SEO-показатели",
      count: importantIssues.length,
      price: 800,
      totalPrice: costs.importantCost
    },
    {
      name: "Реализация возможностей улучшения",
      description: "Внедрение рекомендаций по улучшению SEO",
      count: opportunities.length,
      price: 400,
      totalPrice: costs.opportunitiesCost
    },
    {
      name: "Исправление незначительных проблем",
      description: "Устранение мелких проблем и улучшений",
      count: minorIssues.length,
      price: 200,
      totalPrice: costs.minorCost
    }
  ];
  
  // Issues with specific counts
  const issueCategories = {
    "Мета-теги": {
      count: criticalIssues.filter(i => i.title.includes("мета") || i.description.includes("мета")).length +
             importantIssues.filter(i => i.title.includes("мета") || i.description.includes("мета")).length,
      price: 500
    },
    "Скорость загрузки": {
      count: criticalIssues.filter(i => i.title.includes("скорость") || i.description.includes("скорость")).length +
             importantIssues.filter(i => i.title.includes("скорость") || i.description.includes("скорость")).length,
      price: 1200
    },
    "Структура заголовков": {
      count: criticalIssues.filter(i => i.title.includes("заголовк") || i.description.includes("заголовк")).length +
             importantIssues.filter(i => i.title.includes("заголовк") || i.description.includes("заголовк")).length,
      price: 600
    },
    "Оптимизация изображений": {
      count: criticalIssues.filter(i => i.title.includes("изображени") || i.description.includes("изображени")).length +
             importantIssues.filter(i => i.title.includes("изображени") || i.description.includes("изображени")).length,
      price: 400
    },
    "Внутренние ссылки": {
      count: criticalIssues.filter(i => i.title.includes("ссылк") || i.description.includes("ссылк")).length +
             importantIssues.filter(i => i.title.includes("ссылк") || i.description.includes("ссылк")).length,
      price: 700
    },
    "Мобильная оптимизация": {
      count: criticalIssues.filter(i => i.title.includes("мобильн") || i.description.includes("мобильн")).length +
             importantIssues.filter(i => i.title.includes("мобильн") || i.description.includes("мобильн")).length,
      price: 900
    },
    "Контент": {
      count: criticalIssues.filter(i => i.title.includes("контент") || i.description.includes("контент")).length +
             importantIssues.filter(i => i.title.includes("контент") || i.description.includes("контент")).length,
      price: 1500
    },
  };
  
  // Get issue icon based on impact level
  const getIssueIcon = (impact: string) => {
    switch(impact) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'medium': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'low': return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Info className="h-5 w-5 text-blue-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5" />;
    }
  };
  
  // Get badge variant based on impact
  const getBadgeVariant = (impact: string) => {
    switch(impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      case 'info': return 'outline';
      case 'success': return 'success';
      default: return 'outline';
    }
  };
  
  // Simulate optimization process
  const handleStartOptimization = () => {
    setOptimizationInProgress(true);
    setOptimizationProgress(0);
    setOptimizationStage('Подготовка к оптимизации');
    
    // Simulate optimization progress
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        const newProgress = prev + 2;
        
        // Update stage based on progress
        if (newProgress === 20) {
          setOptimizationStage('Анализ метатегов и содержимого');
        } else if (newProgress === 40) {
          setOptimizationStage('Оптимизация контента');
        } else if (newProgress === 60) {
          setOptimizationStage('Оптимизация изображений');
        } else if (newProgress === 80) {
          setOptimizationStage('Проверка результатов');
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setOptimizationStage('Оптимизация завершена');
        }
        
        return Math.min(newProgress, 100);
      });
    }, 300);
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Оптимизация сайта {url}</CardTitle>
            <CardDescription>
              Комплексная оптимизация для улучшения SEO-показателей и повышения производительности
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Основные метрики */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-muted-foreground mb-1">Всего проблем</div>
                <div className="text-3xl font-semibold">{totalIssuesCount}</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-muted-foreground mb-1">Текущий SEO-рейтинг</div>
                <div className="text-3xl font-semibold">{auditData.score}/100</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-muted-foreground mb-1">Потенциальный рост</div>
                <div className="text-3xl font-semibold text-green-600">+{Math.min(100 - auditData.score, 30)}%</div>
              </div>
            </div>
            
            {/* Детализация проблем */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="issues">
                <AccordionTrigger className="text-lg">Детализация проблем ({totalIssuesCount})</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {criticalIssues.length > 0 && (
                      <div>
                        <h4 className="text-red-600 flex items-center gap-2 font-semibold mb-2">
                          <AlertTriangle className="h-4 w-4" /> Критические проблемы ({criticalIssues.length})
                        </h4>
                        <div className="space-y-2">
                          {criticalIssues.map((issue, index) => (
                            <div key={issue.id} className="border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10 p-3 rounded-r-md">
                              <div className="flex items-start gap-2">
                                {getIssueIcon(issue.impact)}
                                <div>
                                  <div className="font-medium">{issue.title}</div>
                                  <div className="text-sm text-muted-foreground">{issue.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {importantIssues.length > 0 && (
                      <div>
                        <h4 className="text-orange-600 flex items-center gap-2 font-semibold mb-2">
                          <AlertCircle className="h-4 w-4" /> Важные проблемы ({importantIssues.length})
                        </h4>
                        <div className="space-y-2">
                          {importantIssues.map((issue, index) => (
                            <div key={issue.id} className="border-l-4 border-orange-500 bg-orange-50/50 dark:bg-orange-900/10 p-3 rounded-r-md">
                              <div className="flex items-start gap-2">
                                {getIssueIcon(issue.impact)}
                                <div>
                                  <div className="font-medium">{issue.title}</div>
                                  <div className="text-sm text-muted-foreground">{issue.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {opportunities.length > 0 && (
                      <div>
                        <h4 className="text-yellow-600 flex items-center gap-2 font-semibold mb-2">
                          <Lightbulb className="h-4 w-4" /> Возможности улучшения ({opportunities.length})
                        </h4>
                        <div className="space-y-2">
                          {opportunities.map((issue, index) => (
                            <div key={issue.id} className="border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10 p-3 rounded-r-md">
                              <div className="flex items-start gap-2">
                                {getIssueIcon(issue.impact)}
                                <div>
                                  <div className="font-medium">{issue.title}</div>
                                  <div className="text-sm text-muted-foreground">{issue.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {minorIssues.length > 0 && (
                      <div>
                        <h4 className="text-blue-600 flex items-center gap-2 font-semibold mb-2">
                          <Info className="h-4 w-4" /> Незначительные проблемы ({minorIssues.length})
                        </h4>
                        <div className="space-y-2">
                          {minorIssues.map((issue, index) => (
                            <div key={issue.id} className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-r-md">
                              <div className="flex items-start gap-2">
                                {getIssueIcon(issue.impact)}
                                <div>
                                  <div className="font-medium">{issue.title}</div>
                                  <div className="text-sm text-muted-foreground">{issue.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="optimization-by-category">
                <AccordionTrigger className="text-lg">Категории оптимизации</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {Object.entries(issueCategories).map(([category, data]) => (
                      data.count > 0 ? (
                        <div key={category} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <div className="font-medium">{category}</div>
                            <div className="text-sm text-muted-foreground">Проблем: {data.count}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{data.price.toLocaleString()} ₽</div>
                            <div className="text-sm text-muted-foreground">за исправление</div>
                          </div>
                        </div>
                      ) : null
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Детали стоимости */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Стоимость оптимизации</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                  <div className="font-medium">Базовая стоимость</div>
                  <div className="font-semibold">{costs.baseCost.toLocaleString()} ₽</div>
                </div>
                
                {optimizationItems.map((item, index) => (
                  item.count > 0 ? (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.count} {item.count === 1 ? 'проблема' : 
                                       item.count < 5 ? 'проблемы' : 
                                       'проблем'} × {item.price.toLocaleString()} ₽
                        </div>
                      </div>
                      <div className="font-semibold">{item.totalPrice.toLocaleString()} ₽</div>
                    </div>
                  ) : null
                ))}
                
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-md mt-4">
                  <div className="font-medium text-lg">Итоговая стоимость</div>
                  <div className="font-bold text-xl">{costs.total.toLocaleString()} ₽</div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            {optimizationInProgress ? (
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{optimizationStage}</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="w-full" />
                {optimizationProgress >= 100 ? (
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                    <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                      <Check className="mr-2 h-4 w-4" /> Скачать оптимизированную версию
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Посмотреть отчет
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Button size="lg" className="w-full sm:w-auto" onClick={handleStartOptimization}>
                Заказать оптимизацию за {costs.total.toLocaleString()} ₽
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default OptimizationSection;
