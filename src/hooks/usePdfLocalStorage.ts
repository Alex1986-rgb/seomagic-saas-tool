import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PdfReportMetadata {
  id: string;
  url: string;
  report_title: string;
  company_name?: string;
  sections_included: any;
  created_at: string;
  file_size: number;
  downloaded_count: number;
}

const STORAGE_KEY = 'pdf_reports_history';
const MAX_REPORTS = 20;

export const usePdfLocalStorage = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const savePdfMetadata = async (
    metadata: {
      url: string;
      taskId?: string;
      reportTitle: string;
      companyName?: string;
      sectionsIncluded: any;
      fileSize: number;
    }
  ): Promise<PdfReportMetadata | null> => {
    setUploading(true);
    
    try {
      const report: PdfReportMetadata = {
        id: crypto.randomUUID(),
        url: metadata.url,
        report_title: metadata.reportTitle,
        company_name: metadata.companyName,
        sections_included: metadata.sectionsIncluded,
        created_at: new Date().toISOString(),
        file_size: metadata.fileSize,
        downloaded_count: 1
      };

      // Get existing reports
      const existingReports = getReports();
      
      // Add new report to beginning
      const updatedReports = [report, ...existingReports].slice(0, MAX_REPORTS);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));

      toast({
        title: "История обновлена",
        description: "PDF отчет добавлен в историю"
      });

      return report;
    } catch (error) {
      console.error('Error saving PDF metadata:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить метаданные отчета",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const getReports = (): PdfReportMetadata[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading reports:', error);
      return [];
    }
  };

  const incrementDownloadCount = (reportId: string): void => {
    try {
      const reports = getReports();
      const updated = reports.map(r => 
        r.id === reportId 
          ? { ...r, downloaded_count: r.downloaded_count + 1 }
          : r
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  };

  const deleteReport = (reportId: string): boolean => {
    try {
      const reports = getReports();
      const filtered = reports.filter(r => r.id !== reportId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      toast({
        title: "Удалено",
        description: "Запись удалена из истории"
      });

      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить запись",
        variant: "destructive"
      });
      return false;
    }
  };

  const clearAllReports = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      toast({
        title: "История очищена",
        description: "Все записи удалены"
      });
    } catch (error) {
      console.error('Error clearing reports:', error);
    }
  };

  return {
    savePdfMetadata,
    getReports,
    incrementDownloadCount,
    deleteReport,
    clearAllReports,
    uploading
  };
};
