
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, Monitor, Search, BarChart4 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScanResults from './ScanResults';
import UrlsList from './UrlsList';
import AuditSection from './AuditSection';
import AnalyticsSection from './AnalyticsSection';

interface ScannerTabsProps {
  url: string;
  onUrlsScanned: (urls: string[]) => void;
  scannedUrls: string[];
  hasAuditResults: boolean;
  isScanning: boolean;
  startFullScan: () => void;
  handleDownloadPdfReport: () => void;
  handleDownloadErrorReport: () => void;
}

const ScannerTabs: React.FC<ScannerTabsProps> = ({
  url,
  onUrlsScanned,
  scannedUrls,
  hasAuditResults,
  isScanning,
  startFullScan,
  handleDownloadPdfReport,
  handleDownloadErrorReport
}) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <Monitor className="h-4 w-4" />
          <span className="hidden sm:inline">Обзор</span>
        </TabsTrigger>
        <TabsTrigger value="urls" className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">URLs</span>
        </TabsTrigger>
        <TabsTrigger value="audit" className="flex items-center space-x-2">
          <File className="h-4 w-4" />
          <span className="hidden sm:inline">Аудит</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center space-x-2">
          <BarChart4 className="h-4 w-4" />
          <span className="hidden sm:inline">Аналитика</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardContent className="p-4 md:p-6">
            <ScanResults 
              url={url}
              scannedUrls={scannedUrls} 
              hasAuditResults={hasAuditResults} 
              handleDownloadPdfReport={handleDownloadPdfReport}
              handleDownloadErrorReport={handleDownloadErrorReport}
            />
            
            {!hasAuditResults && !isScanning && url && (
              <div className="flex justify-center mt-4">
                <Button onClick={startFullScan}>
                  Запустить полное сканирование
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="urls">
        <Card>
          <CardContent className="p-4 md:p-6">
            <UrlsList 
              url={url}
              scannedUrls={scannedUrls} 
              onUrlsScanned={onUrlsScanned}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="audit">
        <Card>
          <CardContent className="p-4 md:p-6">
            <AuditSection 
              url={url} 
              hasAuditResults={hasAuditResults} 
              isScanning={isScanning}
              startFullScan={startFullScan}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analytics">
        <Card>
          <CardContent className="p-4 md:p-6">
            <AnalyticsSection 
              url={url} 
              hasResults={hasAuditResults || scannedUrls.length > 0} 
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ScannerTabs;
