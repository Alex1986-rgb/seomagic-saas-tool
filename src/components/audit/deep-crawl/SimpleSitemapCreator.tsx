
import React, { useState } from 'react';
import { Rocket, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSimpleSitemapCreator } from './hooks/useSimpleSitemapCreator';
import { DeepCrawlProgressDialog } from './DeepCrawlProgressDialog';

interface SimpleSitemapCreatorProps {
  domain?: string;
  initialUrl?: string;
  onUrlsScanned?: (urls: string[]) => void;
}

const SimpleSitemapCreator: React.FC<SimpleSitemapCreatorProps> = ({ 
  domain, 
  initialUrl,
  onUrlsScanned 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    isGenerating,
    progress,
    sitemap,
    urls,
    currentUrl,
    generateSitemap,
    downloadSitemap,
    downloadCsv
  } = useSimpleSitemapCreator();

  const handleStartCrawl = async () => {
    setIsDialogOpen(true);
    
    try {
      // Use initialUrl if provided, otherwise fall back to domain
      const urlToScan = initialUrl || domain || '';
      await generateSitemap(urlToScan);
      if (onUrlsScanned && urls.length > 0) {
        onUrlsScanned(urls);
      }
    } catch (error) {
      console.error("Error during sitemap generation:", error);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleStartCrawl}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover-lift"
          disabled={isGenerating}
        >
          <Rocket className="h-4 w-4" />
          <span>Создать карту сайта</span>
        </Button>
        
        {sitemap && urls.length > 0 && (
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
              <Download className="h-4 w-4" />
              <span>Скачать URLs (CSV)</span>
            </Button>
          </div>
        )}
      </div>

      <DeepCrawlProgressDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        url={initialUrl || domain || ''}
        initialStage="starting"
      />
    </div>
  );
};

export default SimpleSitemapCreator;
