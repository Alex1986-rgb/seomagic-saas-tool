
import React from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardCopy, CheckCircle } from 'lucide-react';

interface CrawlUrlsTabProps {
  urls: string[];
  totalUrls: number;
  copiedUrl: string | null;
  onCopyUrl: (url: string) => void;
}

const CrawlUrlsTab: React.FC<CrawlUrlsTabProps> = ({ 
  urls, 
  totalUrls, 
  copiedUrl, 
  onCopyUrl 
}) => {
  return (
    <div className="h-60 overflow-y-auto border rounded-md p-2 bg-background/50">
      {urls.map((url, index) => (
        <div key={index} className="flex justify-between text-xs truncate p-1 hover:bg-muted rounded group">
          <div className="truncate">{url}</div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 opacity-0 group-hover:opacity-100"
            onClick={() => onCopyUrl(url)}
          >
            {copiedUrl === url ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <ClipboardCopy className="h-3 w-3" />
            )}
          </Button>
        </div>
      ))}
      {totalUrls > 100 && (
        <div className="text-xs text-muted-foreground text-center mt-2">
          Показано первые 100 URL из {totalUrls}
        </div>
      )}
    </div>
  );
};

export default CrawlUrlsTab;
