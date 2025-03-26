
import React from 'react';
import { FileText, Map } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SitemapCardProps {
  pageCount: number;
  onDownloadSitemap?: () => void;
}

const SitemapCard: React.FC<SitemapCardProps> = ({ pageCount, onDownloadSitemap }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
      <div className="flex items-center mb-2">
        <FileText className="h-4 w-4 text-primary mr-2" />
        <h4 className="text-sm font-medium">Карта сайта</h4>
      </div>
      <p className="text-xs">
        XML Sitemap создан для {formatNumber(pageCount)} страниц сайта
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Включает все основные разделы и подстраницы сайта
      </p>
      
      {onDownloadSitemap && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDownloadSitemap}
          className="mt-2 text-xs h-7 px-2"
        >
          <Map className="h-3 w-3 mr-1" />
          Скачать
        </Button>
      )}
    </div>
  );
};

export default SitemapCard;
