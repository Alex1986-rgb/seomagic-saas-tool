
import React, { useState } from 'react';
import { Rocket, Download, FileText, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSimpleSitemapCreator } from './hooks/useSimpleSitemapCreator';
import { DeepCrawlProgressDialog } from './DeepCrawlProgressDialog';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SimpleSitemapCreatorToolProps {
  domain?: string;
  initialUrl?: string;
  onUrlsScanned?: (urls: string[]) => void;
}

const SimpleSitemapCreatorTool: React.FC<SimpleSitemapCreatorToolProps> = ({ 
  domain, 
  initialUrl,
  onUrlsScanned 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState(initialUrl || domain || '');
  const { toast } = useToast();
  
  const {
    isScanning,
    isGenerating,
    progress,
    sitemap,
    urls,
    currentUrl,
    startScan,
    generateSitemap,
    downloadSitemap,
    downloadCsv
  } = useSimpleSitemapCreator({ url });

  const handleStartCrawl = async () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Opening dialog with URL:", url);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (pageCount?: number, scannedUrls?: string[]) => {
    setIsDialogOpen(false);
    
    if (scannedUrls && scannedUrls.length > 0 && onUrlsScanned) {
      console.log(`Dialog closed with ${scannedUrls.length} URLs scanned`);
      onUrlsScanned(scannedUrls);
    }
  };

  // Update URL when props change
  React.useEffect(() => {
    const newUrl = initialUrl || domain || '';
    console.log("Setting URL from props:", newUrl);
    setUrl(newUrl);
  }, [initialUrl, domain]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          Создание карты сайта
        </CardTitle>
        <CardDescription>
          Сканирование сайта и создание карты сайта с извлечением контента
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleStartCrawl}
            variant="default"
            size="sm"
            className="flex items-center gap-2 hover-lift"
            disabled={isGenerating || !url}
          >
            <Rocket className="h-4 w-4" />
            <span>Начать глубокое сканирование</span>
          </Button>
          
          {sitemap && urls && urls.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={downloadSitemap}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Скачать sitemap.xml</span>
              </Button>
              
              <Button
                onClick={downloadCsv}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Скачать URLs (CSV)</span>
              </Button>
            </div>
          )}
        </div>

        <DeepCrawlProgressDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          url={url}
          initialStage="starting"
        />
      </CardContent>
    </Card>
  );
};

export default SimpleSitemapCreatorTool;
