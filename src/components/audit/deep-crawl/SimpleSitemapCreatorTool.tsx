
import React, { useState } from 'react';
import { Rocket, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSimpleSitemapCreator } from './hooks/useSimpleSitemapCreator';
import { useToast } from "@/hooks/use-toast";
import { TextField } from '@/components/ui/TextField';

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

  const handleStartScan = async () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Введите URL сайта",
        variant: "destructive"
      });
      return;
    }
    
    const result = await startScan();
    if (result && onUrlsScanned && result.urls) {
      onUrlsScanned(result.urls);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <TextField
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Введите URL сайта (например, example.com)"
          className="flex-1"
        />
        <Button
          onClick={handleStartScan}
          variant="default"
          disabled={isScanning || isGenerating}
        >
          <Rocket className="mr-2 h-4 w-4" />
          Сканировать
        </Button>
      </div>
      
      {sitemap && urls && urls.length > 0 && (
        <div className="flex gap-2">
          <Button
            onClick={downloadSitemap}
            variant="outline"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Скачать Sitemap
          </Button>
          
          <Button
            onClick={downloadCsv}
            variant="outline"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Скачать URL в CSV
          </Button>
        </div>
      )}
      
      {isScanning && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Сканирование: {currentUrl}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-muted-foreground">
            {urls ? `Найдено ${urls.length} URL` : 'Идёт сканирование...'}
          </div>
        </div>
      )}
      
      {urls && urls.length > 0 && !isScanning && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Найденные URL ({urls.length})</h3>
          <div className="max-h-60 overflow-y-auto p-3 border rounded-md bg-background/50">
            <ul className="space-y-1 text-sm">
              {urls.slice(0, 100).map((url, index) => (
                <li key={index} className="truncate">{url}</li>
              ))}
              {urls.length > 100 && (
                <li className="text-muted-foreground">...и ещё {urls.length - 100}</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleSitemapCreatorTool;
