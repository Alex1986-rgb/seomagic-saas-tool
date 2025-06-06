
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface AuditLoaderSectionProps {
  url: string;
  error: string | null;
  isLoading: boolean;
  showAdvancedTools: boolean;
  scannedUrls: string[];
  handleClearError: () => void;
  handleUrlsScanned: (urls: string[]) => void;
  setShowAdvancedTools: (show: boolean) => void;
  extractedUrl: React.MutableRefObject<boolean>;
  setTimeoutOccurred: (occurred: boolean) => void;
  extractUrlParam: () => void;
}

const AuditLoaderSection: React.FC<AuditLoaderSectionProps> = ({
  url,
  error,
  isLoading,
  showAdvancedTools,
  scannedUrls,
  handleClearError,
  handleUrlsScanned,
  setShowAdvancedTools,
  extractedUrl,
  setTimeoutOccurred,
  extractUrlParam
}) => {
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ошибка</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleClearError}>
            Попробовать снова
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Загрузка аудита...</h2>
          <p className="text-muted-foreground">Анализируем {url}</p>
        </Card>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Введите URL для аудита</h2>
          <p className="text-muted-foreground">Укажите адрес сайта в параметре url</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Аудит завершен</h2>
        <p className="text-muted-foreground">URL: {url}</p>
        {scannedUrls.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Найдено страниц: {scannedUrls.length}
          </p>
        )}
      </Card>
    </div>
  );
};

export default AuditLoaderSection;
