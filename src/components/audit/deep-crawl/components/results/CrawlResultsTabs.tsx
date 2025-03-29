
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import CrawlUrlsTab from './CrawlUrlsTab';
import CrawlSeoRecommendationsTab from './CrawlSeoRecommendationsTab';

interface CrawlResultsTabsProps {
  urls: string[];
  pageCount: number;
}

const CrawlResultsTabs: React.FC<CrawlResultsTabsProps> = ({ urls, pageCount }) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    
    toast({
      title: "URL скопирован",
      description: "URL успешно скопирован в буфер обмена",
    });
    
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  return (
    <Tabs defaultValue="urls" className="space-y-4">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="urls">URL (до 100)</TabsTrigger>
        <TabsTrigger value="seo">SEO Рекомендации</TabsTrigger>
      </TabsList>
      
      <TabsContent value="urls" className="space-y-4">
        <CrawlUrlsTab 
          urls={urls.slice(0, 100)} 
          totalUrls={urls.length} 
          copiedUrl={copiedUrl}
          onCopyUrl={handleCopyUrl}
        />
      </TabsContent>
      
      <TabsContent value="seo" className="space-y-4">
        <CrawlSeoRecommendationsTab pageCount={pageCount} urls={urls} />
      </TabsContent>
    </Tabs>
  );
};

export default CrawlResultsTabs;
