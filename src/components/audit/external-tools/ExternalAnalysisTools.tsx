
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Computer, Download, ExternalLink, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ExternalAnalysisToolsProps {
  url: string;
}

const ExternalAnalysisTools: React.FC<ExternalAnalysisToolsProps> = ({ url }) => {
  const [exportFormat, setExportFormat] = useState<'xml' | 'csv'>('xml');
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportData, setExportData] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();

  const generateExportFile = async () => {
    setIsGenerating(true);
    
    try {
      // Имитируем генерацию данных для экспорта
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (exportFormat === 'xml') {
        const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<site url="${url}">
  <pages>
    <page url="${url}">
      <title>Sample Page Title</title>
      <meta-description>Sample meta description for analysis</meta-description>
      <h1>Sample H1 Tag</h1>
      <issues>
        <issue type="meta-description" severity="medium">Meta description is too short</issue>
        <issue type="images" severity="high">Missing alt tags on 3 images</issue>
      </issues>
    </page>
    <page url="${url}/sample-page">
      <title>Another Page Title</title>
      <meta-description>Another sample meta description</meta-description>
      <h1>Another H1 Tag</h1>
      <issues>
        <issue type="links" severity="low">2 links have no descriptive text</issue>
      </issues>
    </page>
  </pages>
</site>`;
        setExportData(xmlData);
      } else {
        const csvData = `URL,Title,Meta Description,H1,Issue Type,Severity,Description
${url},"Sample Page Title","Sample meta description for analysis","Sample H1 Tag",meta-description,medium,"Meta description is too short"
${url},"Sample Page Title","Sample meta description for analysis","Sample H1 Tag",images,high,"Missing alt tags on 3 images"
${url}/sample-page,"Another Page Title","Another sample meta description","Another H1 Tag",links,low,"2 links have no descriptive text"`;
        setExportData(csvData);
      }
      
      toast({
        title: "Данные сгенерированы",
        description: `Файл в формате ${exportFormat.toUpperCase()} готов к экспорту`,
      });
    } catch (error) {
      toast({
        title: "Ошибка генерации",
        description: "Не удалось сгенерировать данные для экспорта",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadExportFile = () => {
    if (!exportData) return;
    
    const blob = new Blob([exportData], { 
      type: exportFormat === 'xml' ? 'application/xml' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-analysis-${exportFormat}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Файл скачан",
      description: `Анализ сайта экспортирован в формате ${exportFormat.toUpperCase()}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Computer className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Интеграция с Desktop-инструментами</CardTitle>
          </div>
          <CardDescription>
            Экспортируйте данные анализа для использования в программах для компьютера
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="export">Экспорт данных</TabsTrigger>
              <TabsTrigger value="analyzer">SiteAnalyzer</TabsTrigger>
              <TabsTrigger value="instructions" onClick={() => setShowInstructions(true)}>
                Инструкция
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="export" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-2">
                  <div className="text-sm font-medium">URL сайта:</div>
                  <Input readOnly value={url} />
                </div>
                <div className="w-32">
                  <div className="text-sm font-medium">Формат:</div>
                  <select 
                    className="mt-2 w-full p-2 rounded-md border bg-background"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as 'xml' | 'csv')}
                  >
                    <option value="xml">XML</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={generateExportFile}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Генерация..." : "Сгенерировать"}
                </Button>
                <Button
                  onClick={downloadExportFile}
                  disabled={!exportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Скачать
                </Button>
              </div>
              
              {exportData && (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Предпросмотр данных:</div>
                  <pre className="bg-background p-3 rounded-md text-xs overflow-auto max-h-40">
                    {exportData}
                  </pre>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analyzer" className="space-y-4">
              <div className="rounded-lg border p-4 bg-background/50">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Computer className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">SiteAnalyzer - Профессиональный инструмент</h3>
                    <p className="text-sm text-muted-foreground">
                      Бесплатная программа для Windows, предназначенная для анализа сайтов и выявления 
                      технических ошибок. Она позволяет сканировать сайты, находить битые ссылки, 
                      дубликаты страниц и другие SEO-проблемы.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => window.open('https://site-analyzer.ru/download/', '_blank')}
                      >
                        <Download className="h-4 w-4" />
                        Скачать программу
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => {
                          const exportUrl = `https://site-analyzer.ru/api/analyze?url=${encodeURIComponent(url)}&source=web-app`;
                          window.open(exportUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Открыть сайт в SiteAnalyzer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="ml-2 text-sm">
                  Для анализа в SiteAnalyzer необходимо установить программу на компьютер с Windows.
                  После установки вы можете использовать экспортированные данные или напрямую открыть 
                  URL сайта в программе.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="instructions" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Инструкция по использованию</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm font-medium">1</span>
                    </div>
                    <p className="text-sm">
                      Экспортируйте данные анализа вашего сайта в формате XML или CSV.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <p className="text-sm">
                      Скачайте и установите программу SiteAnalyzer на ваш компьютер с Windows.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <p className="text-sm">
                      Запустите программу и импортируйте скачанный файл анализа или укажите URL для 
                      сканирования непосредственно в программе.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm font-medium">4</span>
                    </div>
                    <p className="text-sm">
                      Используйте расширенные возможности программы для детального анализа структуры 
                      сайта, внутренних и внешних ссылок, мета-тегов и других SEO-параметров.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="text-xs text-muted-foreground flex justify-between">
          <span>Требуется Windows 7/8/10/11</span>
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs p-0 h-auto"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? "Скрыть инструкцию" : "Показать инструкцию"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ExternalAnalysisTools;
