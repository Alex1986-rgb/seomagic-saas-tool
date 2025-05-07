
import React from 'react';
import { Download, FileSpreadsheet, PieChart, FileCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ScanResultsProps {
  url: string;
  scannedUrls: string[];
  hasAuditResults: boolean;
  handleDownloadPdfReport: () => void;
  handleDownloadErrorReport: () => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({
  url,
  scannedUrls,
  hasAuditResults,
  handleDownloadPdfReport,
  handleDownloadErrorReport
}) => {
  const hasResults = scannedUrls.length > 0 || hasAuditResults;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Результаты сканирования</h3>
      
      {hasResults ? (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">URLs</h4>
                  <p className="text-2xl font-bold mt-1">{scannedUrls.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <PieChart className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Аудиты</h4>
                  <p className="text-2xl font-bold mt-1">{hasAuditResults ? 1 : 0}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:col-span-2 md:col-span-1">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Последнее сканирование</h4>
                  <p className="text-sm mt-1 text-muted-foreground">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Download Buttons */}
          <div className="pt-4 flex flex-wrap gap-2">
            <Button 
              onClick={handleDownloadPdfReport} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PDF Отчет
            </Button>
            
            <Button
              onClick={handleDownloadErrorReport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Отчет об ошибках
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {url ? "Запустите сканирование для получения результатов" : "Введите URL сайта для начала сканирования"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScanResults;
