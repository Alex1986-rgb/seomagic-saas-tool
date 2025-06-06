
import React, { useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Globe } from 'lucide-react';
import WebsiteAnalyzerHeader from '@/components/admin/website-analyzer/WebsiteAnalyzerHeader';
import SupabaseWarning from '@/components/admin/website-analyzer/SupabaseWarning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebsiteAnalyzer } from '@/hooks/use-website-analyzer';
import ScanForm from '@/components/admin/website-analyzer/ScanForm';
import WebsiteAnalyzerTabs from '@/components/admin/website-analyzer/tabs/WebsiteAnalyzerTabs';
import { AuditProvider } from '@/contexts/AuditContext';

const WebsiteAnalyzerPage: React.FC = () => {
  const {
    url,
    isScanning,
    scanProgress,
    scanStage,
    isError,
    scannedUrls,
    handleUrlChange,
    startFullScan,
  } = useWebsiteAnalyzer();

  // Memoize the URL change handler to prevent unnecessary re-renders
  const handleUrlInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleUrlChange(event.target.value);
  }, [handleUrlChange]);

  // Memoize the card title component for better performance
  const cardTitle = useMemo(() => (
    <CardTitle className="flex items-center gap-2 text-white">
      <Globe className="h-6 w-6 text-[#36CFFF]" />
      Полное сканирование сайта и создание Sitemap
    </CardTitle>
  ), []);

  // Memoize the card description for better performance
  const cardDescription = useMemo(() => (
    <CardDescription className="text-[#A0A8FF]">
      Запустите глубокое сканирование сайта без ограничений по количеству страниц и получите подробный отчет
    </CardDescription>
  ), []);

  return (
    <AuditProvider initialUrl={url}>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      <div className="container mx-auto px-2 md:px-4 py-6 md:py-10 max-w-4xl">
        <WebsiteAnalyzerHeader />
        <SupabaseWarning />
        
        <Card className="mb-8 bg-[#181929] border-[#22213B] shadow-lg">
          <CardHeader>
            {cardTitle}
            {cardDescription}
          </CardHeader>
          <CardContent>
            <ScanForm
              url={url}
              isScanning={isScanning}
              scanProgress={scanProgress}
              scanStage={scanStage}
              isError={isError}
              onUrlChange={handleUrlInputChange}
              onStartScan={startFullScan}
            />
          </CardContent>
        </Card>

        <WebsiteAnalyzerTabs scannedUrls={scannedUrls ?? []} />
      </div>
    </AuditProvider>
  );
};

export default React.memo(WebsiteAnalyzerPage);
