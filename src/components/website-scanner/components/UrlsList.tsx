
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface UrlsListProps {
  url: string;
  scannedUrls: string[];
  onUrlsScanned: (urls: string[]) => void;
}

const UrlsList: React.FC<UrlsListProps> = ({ url, scannedUrls, onUrlsScanned }) => {
  const handleExportUrls = () => {
    // Create a text file with the URLs
    const content = scannedUrls.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `urls-${url.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold">Найденные URLs</h3>
        
        {scannedUrls.length > 0 && (
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleExportUrls}
          >
            <Download className="h-4 w-4" />
            <span>Экспорт</span>
          </Button>
        )}
      </div>
      
      {scannedUrls.length > 0 ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">Всего найдено: {scannedUrls.length}</p>
          <div className="border rounded-md max-h-[50vh] overflow-y-auto">
            <div className="divide-y">
              {scannedUrls.map((url, index) => (
                <div key={index} className="p-2 hover:bg-muted/50 truncate">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm block w-full truncate"
                  >
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {url ? "URL не найдены. Запустите сканирование, чтобы найти URLs." : "Введите URL сайта для сканирования."}
          </p>
        </div>
      )}
    </div>
  );
};

export default UrlsList;
