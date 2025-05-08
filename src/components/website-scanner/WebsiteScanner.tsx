
import React from 'react';
import { Search, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import ScannerHeader from './components/ScannerHeader';
import ScannerTabs from './components/ScannerTabs';
import ScanForm from '@/components/admin/website-analyzer/ScanForm';
import { useWebsiteScan } from '@/hooks/use-website-scan';
import { useMobile } from '@/hooks/use-mobile';

const WebsiteScanner = () => {
  const {
    url,
    isScanning,
    isError,
    scanProgress,
    scanStage,
    scannedUrls,
    hasAuditResults,
    handleUrlChange,
    handleUrlsScanned,
    startFullScan,
    handleDownloadPdfReport,
    handleDownloadErrorReport
  } = useWebsiteScan();
  
  const isMobile = useMobile();

  return (
    <div className="space-y-4 md:space-y-8">
      <ScannerHeader />
      <CardContent className="p-3 md:p-6">
        <ScanForm
          url={url}
          isScanning={isScanning}
          scanProgress={scanProgress}
          scanStage={scanStage}
          isError={isError}
          onUrlChange={handleUrlChange}
          onStartScan={startFullScan}
        />
      </CardContent>

      <ScannerTabs
        url={url}
        onUrlsScanned={handleUrlsScanned}
        scannedUrls={scannedUrls}
        hasAuditResults={hasAuditResults}
        isScanning={isScanning}
        startFullScan={startFullScan}
        handleDownloadPdfReport={handleDownloadPdfReport}
        handleDownloadErrorReport={handleDownloadErrorReport}
      />
    </div>
  );
};

export default WebsiteScanner;
