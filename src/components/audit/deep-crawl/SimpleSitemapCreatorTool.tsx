
import React, { useState } from 'react';
import { Rocket, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSimpleSitemapCreator } from './hooks/useSimpleSitemapCreator';
import { useToast } from "@/hooks/use-toast";
import { TextField } from '@/components/ui/textfield';

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
        title: "Error",
        description: "Please enter a URL",
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
          placeholder="Enter website URL (e.g., example.com)"
          className="flex-1"
        />
        <Button
          onClick={handleStartScan}
          variant="default"
          disabled={isScanning || isGenerating}
        >
          <Rocket className="mr-2 h-4 w-4" />
          Scan
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
            Download Sitemap
          </Button>
          
          <Button
            onClick={downloadCsv}
            variant="outline"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Download URLs as CSV
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleSitemapCreatorTool;
