
import React, { useState, useEffect } from 'react';
import { FileSearch, X, DownloadCloud, Loader2, BarChart4, ArrowRight, Bot } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CrawlResults from './CrawlResults';
import CrawlProgressView from './components/CrawlProgressView';
import { useCrawlProgress } from './hooks/useCrawlProgress';
import { getStageTitleAndInfo } from './utils/crawlStageUtils';

interface DeepCrawlProgressDialogProps {
  open: boolean;
  onClose: (pageCount?: number) => void;
  url: string;
}

export const DeepCrawlProgressDialog: React.FC<DeepCrawlProgressDialogProps> = ({ 
  open, 
  onClose, 
  url 
}) => {
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("progress");
  const [seoPrompt, setSeoPrompt] = useState<string>("");
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>("");
  const [isCrawlInitiated, setIsCrawlInitiated] = useState(false);
  
  const {
    progress,
    currentUrl,
    pagesScanned,
    estimatedPages,
    sitemap,
    crawlStage,
    isCompleted,
    error,
    domain,
    scannedUrls,
    startCrawling,
    downloadSitemap,
    downloadAllData,
    downloadReport,
    optimizeSite,
    downloadOptimizedSite,
    isOptimizing
  } = useCrawlProgress(url);

  // Предопределенные шаблоны промптов для SEO
  const promptTemplates = [
    {
      id: "general",
      name: "Общая SEO оптимизация",
      prompt: "Оптимизируй все тексты для поисковых систем, добавь ключевые слова и улучши читаемость. Убедись, что все заголовки содержат ключевые слова, а описания привлекательны для пользователей."
    },
    {
      id: "meta",
      name: "Оптимизация мета-тегов",
      prompt: "Улучши все мета-заголовки и мета-описания. Добавь ключевые слова в Title теги. Убедись, что длина Title не превышает 60 символов, а Description находится в пределах 150-160 символов."
    },
    {
      id: "content",
      name: "Обогащение контента",
      prompt: "Расширь и обогати текстовый контент на всех страницах. Добавь тематические ключевые слова, улучши структуру с помощью подзаголовков (H2, H3), добавь списки и таблицы где уместно."
    },
    {
      id: "technical",
      name: "Техническая оптимизация",
      prompt: "Исправь все технические проблемы: добавь атрибуты alt к изображениям, оптимизируй внутренние ссылки, исправь структуру URL, добавь микроразметку Schema.org для улучшения отображения в поиске."
    },
    {
      id: "keywords",
      name: "Плотность ключевых слов",
      prompt: "Оптимизируй плотность ключевых слов в текстах. Добавь ключевые слова в первый и последний абзацы, в заголовки. Убедись, что плотность основных ключевых слов составляет 1-3%."
    },
    {
      id: "local",
      name: "Локальная оптимизация",
      prompt: "Оптимизируй контент для локального поиска. Добавь упоминания местоположения, района и региона. Убедись, что контактная информация представлена структурированно и легко доступна."
    },
    {
      id: "ecommerce",
      name: "Оптимизация для интернет-магазина",
      prompt: "Оптимизируй страницы товаров, добавь подробные описания, технические характеристики, отзывы. Улучши категории и навигацию. Добавь микроразметку для товаров и цен."
    },
    {
      id: "mobile",
      name: "Мобильная оптимизация",
      prompt: "Оптимизируй контент для мобильных устройств. Сократи длинные абзацы, используй более короткие предложения, увеличь размер шрифта где необходимо."
    },
    {
      id: "readability",
      name: "Улучшение читаемости",
      prompt: "Повысь читаемость всех текстов. Разбей длинные абзацы, используй подзаголовки, списки, выделение важных фраз. Упрости сложные предложения, избегай технического жаргона где это возможно."
    },
    {
      id: "social",
      name: "Оптимизация для соцсетей",
      prompt: "Добавь метатеги для социальных сетей (Open Graph, Twitter Cards), оптимизируй заголовки и описания для шеринга в социальных сетях."
    }
  ];

  useEffect(() => {
    if (open && !isCrawlInitiated) {
      // Добавляем небольшую задержку перед запуском
      const timer = setTimeout(() => {
        startCrawling();
        setIsCrawlInitiated(true);
      }, 300);
      return () => clearTimeout(timer);
    }
    
    if (!open) {
      setIsCrawlInitiated(false);
    }
  }, [open, isCrawlInitiated, startCrawling]);

  const handleClose = () => {
    if (isCompleted) {
      onClose(pagesScanned);
    } else {
      // Запрашиваем подтверждение
      if (window.confirm("Вы уверены, что хотите прервать сканирование?")) {
        onClose();
      }
    }
  };
  
  const toggleResults = () => {
    setShowResults(!showResults);
  };

  const handlePromptTemplateChange = (value: string) => {
    setSelectedPromptTemplate(value);
    const template = promptTemplates.find(t => t.id === value);
    if (template) {
      setSeoPrompt(template.prompt);
    }
  };

  const handleOptimizeSite = () => {
    if (seoPrompt.trim()) {
      optimizeSite(seoPrompt);
    }
  };

  // Получаем информацию о текущем этапе
  const { title, info } = getStageTitleAndInfo(crawlStage, error, pagesScanned);

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
            <TabsTrigger value="results" disabled={!isCompleted}>Результаты</TabsTrigger>
            <TabsTrigger value="optimize" disabled={!isCompleted}>Оптимизация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="mt-4">
            <CrawlProgressView
              progress={progress}
              pagesScanned={pagesScanned}
              estimatedPages={estimatedPages}
              currentUrl={currentUrl}
              error={error}
              info={info}
            />
          </TabsContent>
          
          <TabsContent value="results" className="mt-4">
            {isCompleted && !error && (
              <CrawlResults 
                pageCount={pagesScanned}
                domain={domain}
                urls={scannedUrls}
                onDownloadSitemap={downloadSitemap}
                onDownloadReport={downloadReport}
                onDownloadAllData={downloadAllData}
              />
            )}
          </TabsContent>
          
          <TabsContent value="optimize" className="mt-4 space-y-4">
            <div className="space-y-3">
              <div className="mb-2">
                <h3 className="text-sm font-medium mb-1">Выберите шаблон для SEO оптимизации</h3>
                <Select onValueChange={handlePromptTemplateChange} value={selectedPromptTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите шаблон" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Выберите шаблон</SelectItem>
                    {promptTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Опишите, как должен быть оптимизирован сайт</h3>
                <Textarea 
                  placeholder="Например: Оптимизируй все тексты для SEO, добавь ключевые слова, улучши мета-теги и заголовки..."
                  className="min-h-[100px]"
                  value={seoPrompt}
                  onChange={(e) => setSeoPrompt(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleOptimizeSite}
                disabled={!seoPrompt.trim() || isOptimizing}
                className="w-full gap-2"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Оптимизация...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4" />
                    Оптимизировать сайт с помощью ИИ
                  </>
                )}
              </Button>
              
              {isOptimizing && (
                <div className="text-xs text-muted-foreground text-center animate-pulse">
                  Оптимизация сайта с помощью ИИ. Это может занять несколько минут...
                </div>
              )}
              
              <Button 
                onClick={downloadOptimizedSite}
                disabled={isOptimizing || !isCompleted}
                variant="outline"
                className="w-full gap-2"
              >
                <DownloadCloud className="h-4 w-4" />
                Скачать оптимизированную версию сайта
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
          >
            Закрыть
          </Button>
          
          {isCompleted && (
            <div className="flex items-center gap-2">
              {activeTab === "progress" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab("results")}
                  className="gap-2"
                >
                  <BarChart4 className="h-4 w-4" />
                  Результаты
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
              
              {activeTab === "results" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab("optimize")}
                  className="gap-2"
                >
                  <Bot className="h-4 w-4" />
                  Оптимизировать
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
              
              {activeTab === "optimize" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab("progress")}
                  className="gap-2"
                >
                  <ArrowRight className="h-3 w-3 rotate-180" />
                  Вернуться
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
