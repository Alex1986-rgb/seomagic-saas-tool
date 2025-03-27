
import React, { useState } from 'react';
import { Rocket, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSimpleSitemapCreator } from './hooks/useSimpleSitemapCreator';

interface SimpleSitemapCreatorToolProps {
  initialUrl?: string;
  onUrlsScanned?: (urls: string[]) => void;
}

export const SimpleSitemapCreatorTool: React.FC<SimpleSitemapCreatorToolProps> = ({ 
  initialUrl = '', 
  onUrlsScanned
}) => {
  const [url, setUrl] = useState(initialUrl);
  const { 
    isGenerating, 
    progress, 
    sitemap, 
    urls, 
    generateSitemap, 
    downloadSitemap, 
    downloadCsv 
  } = useSimpleSitemapCreator();
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateSitemap(url);
      if (onUrlsScanned) {
        onUrlsScanned(urls);
      }
    } catch (error) {
      toast({
        title: "Ошибка сканирования",
        description: "Не удалось создать карту сайта",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Создание карты сайта (sitemap.xml)</CardTitle>
        </div>
        <CardDescription>
          Сканирование сайта и автоматическое создание файла sitemap.xml для улучшения индексации
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isGenerating ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>Сканирование сайта...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <>
            {sitemap ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-3 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{urls.length}</div>
                  <div className="text-sm text-muted-foreground">URL обнаружено</div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={downloadSitemap} 
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Скачать Sitemap XML
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={downloadCsv} 
                    className="gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Экспорт URLs в CSV
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    URL сайта
                  </label>
                  <Input 
                    id="url"
                    type="text" 
                    placeholder="Например: example.com или https://example.com" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full gap-2">
                  <Rocket className="h-4 w-4" />
                  Сканировать сайт и создать Sitemap
                </Button>
              </form>
            )}
          </>
        )}
      </CardContent>
      
      {sitemap && (
        <CardFooter className="pt-3 text-xs text-muted-foreground">
          Карта сайта создана успешно. Используйте её для отправки в Google Search Console и Яндекс.Вебмастер.
        </CardFooter>
      )}
    </Card>
  );
};

export default SimpleSitemapCreatorTool;
