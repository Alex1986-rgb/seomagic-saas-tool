
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, FileSearch, Map, AlertTriangle, Download, Package, FileCode2, FileJson } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSimpleSitemapCreator } from './hooks/useSimpleSitemapCreator';
import { useToast } from "@/hooks/use-toast";

interface SimpleSitemapCreatorProps {
  initialUrl?: string;
}

export const SimpleSitemapCreator: React.FC<SimpleSitemapCreatorProps> = ({ initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl);
  const { toast } = useToast();
  
  const {
    isScanning,
    progress,
    urlsScanned,
    currentUrl,
    discoveredUrls,
    domain,
    error,
    scanWebsite,
    downloadSitemap,
    stopScanning
  } = useSimpleSitemapCreator();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive",
      });
      return;
    }
    
    scanWebsite(url);
  };

  const handleDownload = (format: 'xml' | 'html' | 'package') => {
    downloadSitemap(format);
  };

  return (
    <Card className="border-primary/20 bg-card/50 w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Генератор карты сайта
        </CardTitle>
        <CardDescription>
          Сканирование сайта и генерация HTML и XML карт сайта
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Введите URL сайта (например, example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
                className="w-full"
              />
            </div>
            <div>
              {isScanning ? (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={stopScanning}
                >
                  Остановить
                </Button>
              ) : (
                <Button type="submit" className="w-full sm:w-auto">
                  Сканировать
                </Button>
              )}
            </div>
          </div>
        </form>
        
        {isScanning && (
          <motion.div 
            className="space-y-4 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center text-sm">
              <span>Прогресс: {progress}%</span>
              <span>Найдено URL: {urlsScanned}</span>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="text-sm text-muted-foreground truncate">
              Сканирование: {currentUrl}
            </div>
          </motion.div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="ml-2">{error}</AlertDescription>
          </Alert>
        )}
        
        {discoveredUrls.length > 0 && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-medium">Найдено {discoveredUrls.length} URL на {domain}</h3>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDownload('xml')}
                  className="flex gap-1 items-center"
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span>XML</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDownload('html')}
                  className="flex gap-1 items-center"
                >
                  <FileSearch className="h-3.5 w-3.5" />
                  <span>HTML</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDownload('package')}
                  className="flex gap-1 items-center"
                >
                  <Package className="h-3.5 w-3.5" />
                  <span>Пакет</span>
                </Button>
              </div>
            </div>
            
            <div className="h-60 overflow-y-auto border rounded-md p-2 bg-background/50">
              <Tabs defaultValue="list">
                <TabsList className="grid grid-cols-2 mb-2">
                  <TabsTrigger value="list">Список URL</TabsTrigger>
                  <TabsTrigger value="summary">Структура</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list" className="space-y-1">
                  {discoveredUrls.map((url, index) => (
                    <div key={index} className="text-xs truncate p-1 hover:bg-muted rounded">
                      {url}
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="summary">
                  <div className="text-sm space-y-2">
                    <div>
                      <Badge>Домен</Badge> {domain}
                    </div>
                    <div>
                      <Badge>Общее количество URL</Badge> {discoveredUrls.length}
                    </div>
                    <div>
                      <Badge>Страницы верхнего уровня</Badge> {discoveredUrls.filter(u => (u.match(/\//g) || []).length <= 3).length}
                    </div>
                    <div>
                      <Badge>Вложенные страницы</Badge> {discoveredUrls.filter(u => (u.match(/\//g) || []).length > 3).length}
                    </div>
                    <div>
                      <Badge>Потенциальные продуктовые страницы</Badge> {discoveredUrls.filter(u => u.includes('product') || u.includes('tovar') || u.includes('item')).length}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end border-t pt-4">
        <div className="text-xs text-muted-foreground">
          Simple Sitemap Creator v1.0
        </div>
      </CardFooter>
    </Card>
  );
};

export const SimpleSitemapCreatorTool = SimpleSitemapCreator;
