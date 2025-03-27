
import React, { useState } from 'react';
import { useSimpleSitemapCreator } from './hooks/useSimpleSitemapCreator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, Globe, ExternalLink, Loader2, StopCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SimpleSitemapCreatorProps {
  initialUrl?: string;
}

export const SimpleSitemapCreatorTool: React.FC<SimpleSitemapCreatorProps> = ({ initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl);
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
    if (url) {
      scanWebsite(url);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Simple Sitemap Creator
        </CardTitle>
        <CardDescription>
          Инструмент для создания карты сайта в форматах XML и HTML
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Введите URL сайта (например, example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isScanning}
              className="flex-1"
            />
            {isScanning ? (
              <Button 
                variant="destructive" 
                type="button" 
                onClick={stopScanning}
                className="whitespace-nowrap"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Остановить
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={!url}
                className="whitespace-nowrap"
              >
                <Globe className="h-4 w-4 mr-2" />
                Сканировать
              </Button>
            )}
          </div>
        </form>
        
        {isScanning && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Сканирование...</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-2" />
            <div className="text-sm text-muted-foreground truncate">
              {currentUrl && (
                <span>Текущий URL: {currentUrl}</span>
              )}
            </div>
            <div className="text-sm font-medium mt-1">
              Найдено URL: {urlsScanned}
            </div>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!isScanning && discoveredUrls.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Результаты сканирования</h3>
              <span className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded">
                Найдено URL: {discoveredUrls.length}
              </span>
            </div>
            
            <Tabs defaultValue="download">
              <TabsList className="mb-4">
                <TabsTrigger value="download">Скачать</TabsTrigger>
                <TabsTrigger value="preview">Просмотр</TabsTrigger>
              </TabsList>
              
              <TabsContent value="download" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => downloadSitemap('xml')}
                    className="flex items-center justify-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    XML Sitemap
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => downloadSitemap('html')}
                    className="flex items-center justify-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    HTML Sitemap
                  </Button>
                  
                  <Button
                    variant="default"
                    onClick={() => downloadSitemap('package')}
                    className="flex items-center justify-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Полный пакет
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  <h4 className="font-medium mb-2">Найденные URL:</h4>
                  <ul className="space-y-1 text-sm">
                    {discoveredUrls.slice(0, 100).map((url, index) => (
                      <li key={index} className="truncate">
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          {url}
                          <ExternalLink className="h-3 w-3 ml-1 inline-block" />
                        </a>
                      </li>
                    ))}
                    {discoveredUrls.length > 100 && (
                      <li className="text-muted-foreground italic">
                        ...и еще {discoveredUrls.length - 100} URL
                      </li>
                    )}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-muted-foreground">
          {domain ? `Сайт: ${domain}` : 'Введите URL сайта для сканирования'}
        </div>
        
        {isScanning && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            Сканирование...
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
