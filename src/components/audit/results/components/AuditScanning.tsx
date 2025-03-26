
import React from 'react';
import { FileSearch } from 'lucide-react';

interface AuditScanningProps {
  url: string;
  scanDetails: {
    pagesScanned: number;
    totalPages: number;
    currentUrl: string;
  };
}

const AuditScanning: React.FC<AuditScanningProps> = ({ url, scanDetails }) => {
  return (
    <div className="neo-card p-6">
      <div className="text-center mb-6">
        <FileSearch className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Глубокое сканирование сайта</h3>
        <p className="text-muted-foreground mb-4">Анализируем страницы сайта {url}</p>
        
        <div className="flex justify-between items-center mb-2 text-sm">
          <span>Прогресс сканирования:</span>
          <span>{scanDetails.pagesScanned} / {scanDetails.totalPages || '?'} страниц</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ 
              width: scanDetails.totalPages ? 
                `${(scanDetails.pagesScanned / scanDetails.totalPages) * 100}%` : 
                `${Math.min(scanDetails.pagesScanned, 100)}%` 
            }}
          ></div>
        </div>
        
        {scanDetails.currentUrl && (
          <p className="text-xs text-muted-foreground truncate mb-4">
            Сканирование: {scanDetails.currentUrl}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuditScanning;
