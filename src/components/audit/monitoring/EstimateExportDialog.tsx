import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { OptimizationItem } from '@/types/audit/optimization-types';
import { exportEstimateToExcel, exportEstimateToCSV, downloadBlob, generateEstimateFilename } from '@/utils/export/estimateExporter';
import { useToast } from '@/hooks/use-toast';

interface EstimateExportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: OptimizationItem[];
  totals: {
    subtotal: number;
    discount: number;
    final: number;
  };
  url: string;
}

const EstimateExportDialog: React.FC<EstimateExportDialogProps> = ({
  isOpen,
  onOpenChange,
  items,
  totals,
  url
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const blob = await exportEstimateToExcel(items, totals, url);
      const filename = generateEstimateFilename(url, 'xlsx');
      downloadBlob(blob, filename);
      
      toast({
        title: 'Успешно экспортировано',
        description: 'Смета сохранена в формате Excel'
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: 'Ошибка экспорта',
        description: 'Не удалось экспортировать в Excel',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const blob = await exportEstimateToCSV(items, url);
      const filename = generateEstimateFilename(url, 'csv');
      downloadBlob(blob, filename);
      
      toast({
        title: 'Успешно экспортировано',
        description: 'Смета сохранена в формате CSV'
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: 'Ошибка экспорта',
        description: 'Не удалось экспортировать в CSV',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Экспорт сметы</DialogTitle>
          <DialogDescription>
            Выберите формат для экспорта сметы на оптимизацию
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportExcel}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
            )}
            Экспортировать в Excel
            <span className="ml-auto text-xs text-muted-foreground">.xlsx</span>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
            )}
            Экспортировать в CSV
            <span className="ml-auto text-xs text-muted-foreground">.csv</span>
          </Button>
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EstimateExportDialog;