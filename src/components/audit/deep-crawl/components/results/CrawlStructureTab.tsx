
import React from 'react';
import { Copy, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CrawlStructureTabProps {
  directoryCount: Record<string, number>;
  pageCount: number;
  urls: string[];
  onDownloadReport: () => void;
}

const CrawlStructureTab: React.FC<CrawlStructureTabProps> = ({
  directoryCount,
  pageCount,
  urls,
  onDownloadReport
}) => {
  const { toast } = useToast();
  
  const handleCopyUrls = () => {
    navigator.clipboard.writeText(urls.join('\n'));
    toast({
      title: "URLs скопированы",
      description: `${urls.length} URLs скопированы в буфер обмена`,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-lg border">
        <h3 className="font-medium mb-3">Распределение страниц по разделам</h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {Object.entries(directoryCount)
            .sort(([, countA], [, countB]) => countB - countA)
            .map(([directory, count]) => (
              <div key={directory} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary/80 mr-2" />
                  <span>{directory === 'root' ? 'Корень сайта' : directory}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">{count.toLocaleString('ru-RU')}</span>
                  <div 
                    className="ml-2 bg-primary/20 h-4" 
                    style={{ 
                      width: `${Math.max(3, Math.min(100, (count / pageCount) * 100 * 3))}px` 
                    }} 
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-1.5 flex-1"
          onClick={handleCopyUrls}
        >
          <Copy className="h-4 w-4" />
          <span>Копировать все URL</span>
        </Button>
        
        <Button 
          variant="outline"
          className="flex items-center gap-1.5 flex-1"
          onClick={onDownloadReport}
        >
          <FileText className="h-4 w-4" />
          <span>Скачать отчет</span>
        </Button>
      </div>
    </div>
  );
};

export default CrawlStructureTab;
