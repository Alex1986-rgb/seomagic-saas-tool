
import React from 'react';
import { ExportAction } from './ExportAction';
import { FileWarning } from 'lucide-react';
import { seoApiService } from '@/api/seoApiService';

interface ExportErrorReportProps {
  taskId: string;
  className?: string;
  url?: string;
  urls?: string[];
  isExporting?: string;
  setIsExporting?: React.Dispatch<React.SetStateAction<string | null>>;
}

const ExportErrorReport: React.FC<ExportErrorReportProps> = ({ 
  taskId, 
  className,
  isExporting,
  setIsExporting
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleExport = async () => {
    if (!taskId) return;
    
    try {
      setIsDownloading(true);
      if (setIsExporting) setIsExporting('error-report');
      
      await seoApiService.downloadReport(taskId, 'errors');
      
    } catch (error) {
      console.error('Error downloading error report:', error);
    } finally {
      setIsDownloading(false);
      if (setIsExporting) setIsExporting(null);
    }
  };

  return (
    <ExportAction
      icon={<FileWarning className="w-4 h-4" />}
      label="Отчет об ошибках"
      onClick={handleExport}
      loading={isDownloading || isExporting === 'error-report'}
      className={className}
    />
  );
};

export default ExportErrorReport;
