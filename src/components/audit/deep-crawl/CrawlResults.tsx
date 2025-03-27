
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, BarChart2, Map, Database, 
  FileSearch, Copy, Share2, Filter, Save
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface CrawlResultsProps {
  pageCount: number;
  domain: string;
  urls: string[];
  onDownloadSitemap: () => void;
  onDownloadReport: () => void;
  onDownloadAllData: () => void;
}

const CrawlResults: React.FC<CrawlResultsProps> = ({
  pageCount,
  domain,
  urls,
  onDownloadSitemap,
  onDownloadReport,
  onDownloadAllData
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const { toast } = useToast();
  
  // Calculate URL statistics
  const urlStats = React.useMemo(() => {
    // Count URLs by directory patterns
    const directoryCount: Record<string, number> = {};
    
    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        
        // Skip URLs from other domains
        if (urlObj.hostname !== domain) return;
        
        // Count by first directory
        const firstDir = path.split('/')[1] || 'root';
        directoryCount[firstDir] = (directoryCount[firstDir] || 0) + 1;
      } catch (e) {
        // Skip invalid URLs
      }
    });
    
    return {
      directoryCount
    };
  }, [urls, domain]);
  
  const handleCopyUrls = () => {
    navigator.clipboard.writeText(urls.join('\n'));
    toast({
      title: "URLs скопированы",
      description: `${urls.length} URLs скопированы в буфер обмена`,
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileSearch className="h-5 w-5 mr-2 text-primary" />
            <span>Результаты сканирования</span>
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            {new Date().toLocaleDateString('ru-RU')}
          </div>
        </CardTitle>
        <CardDescription>
          Найдено {pageCount.toLocaleString('ru-RU')} страниц на сайте {domain}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary" className="flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4" />
              <span>Итоги</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-1.5">
              <Map className="h-4 w-4" />
              <span>Структура</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-1.5">
              <Download className="h-4 w-4" />
              <span>Экспорт</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-2">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="bg-muted/30 p-4 rounded-lg border flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-primary">{pageCount.toLocaleString('ru-RU')}</div>
                  <div className="text-sm text-muted-foreground">Всего страниц</div>
                </motion.div>
                
                <motion.div 
                  className="bg-muted/30 p-4 rounded-lg border flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-primary">
                    {Object.keys(urlStats.directoryCount).length.toLocaleString('ru-RU')}
                  </div>
                  <div className="text-sm text-muted-foreground">Разделов сайта</div>
                </motion.div>
                
                <motion.div 
                  className="bg-muted/30 p-4 rounded-lg border flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-primary">
                    {Math.max(...Object.values(urlStats.directoryCount)).toLocaleString('ru-RU') || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Страниц в разделе</div>
                </motion.div>
              </div>
              
              <div className="flex justify-between p-4 bg-background rounded-lg border mt-4">
                <div className="text-sm">
                  <div className="font-medium mb-1">Сканирование завершено</div>
                  <div className="text-muted-foreground">
                    Сканирование сайта {domain} успешно завершено. Используйте вкладки выше для просмотра 
                    и экспорта результатов анализа.
                  </div>
                </div>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1.5"
                    onClick={onDownloadSitemap}
                  >
                    <Map className="h-4 w-4" />
                    <span>Sitemap</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="structure" className="mt-2">
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg border">
                <h3 className="font-medium mb-3">Распределение страниц по разделам</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {Object.entries(urlStats.directoryCount)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .map(([directory, count]) => (
                      <div key={directory} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary/80 mr-2" />
                          <span>{directory === 'root' ? 'Корень сайта' : directory}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{count.toLocaleString('ru-RU')}</span>
                          <div 
                            className="ml-2 bg-primary/20 h-4" 
                            style={{ 
                              width: `${Math.max(3, Math.min(100, (count / pageCount) * 100 * 3))}px` 
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="flex justify-between gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1.5 flex-1"
                  onClick={handleCopyUrls}
                >
                  <Copy className="h-4 w-4" />
                  <span>Копировать все URL</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex items-center gap-1.5 flex-1"
                  onClick={onDownloadReport}
                >
                  <FileText className="h-4 w-4" />
                  <span>Скачать отчет</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="mt-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="p-4 border rounded-lg flex flex-col items-center text-center"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Map className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Карта сайта (XML)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Стандартный формат для поисковых систем
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="mt-2"
                    onClick={onDownloadSitemap}
                  >
                    Скачать XML
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="p-4 border rounded-lg flex flex-col items-center text-center"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Database className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Полный архив данных</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Все собранные данные и форматы
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="mt-2"
                    onClick={onDownloadAllData}
                  >
                    Скачать архив
                  </Button>
                </motion.div>
              </div>
              
              <div className="mt-4 p-4 border rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>Дополнительные опции</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <Save className="h-4 w-4" />
                    <span>Сохранить в проект</span>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <Filter className="h-4 w-4" />
                    <span>Фильтровать результаты</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CrawlResults;
