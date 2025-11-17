import React, { useEffect, useState } from 'react';
import { FileText, Calendar, HardDrive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePdfLocalStorage, PdfReportMetadata } from '@/hooks/usePdfLocalStorage';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const PdfReportsHistory: React.FC = () => {
  const [reports, setReports] = useState<PdfReportMetadata[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { getReports, deleteReport } = usePdfLocalStorage();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const data = getReports();
    setReports(data);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    
    const success = deleteReport(deleteId);
    if (success) {
      loadReports();
    }
    setDeleteId(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>История PDF отчетов</CardTitle>
          <CardDescription>У вас пока нет сохраненных отчетов</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            История ваших PDF отчетов будет отображаться здесь
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>История PDF отчетов</CardTitle>
          <CardDescription>
            Всего отчетов: {reports.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <FileText className="h-8 w-8 text-primary mt-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {report.report_title || 'SEO Аудит'}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {report.url}
                    </p>
                    {report.company_name && (
                      <p className="text-xs text-muted-foreground">
                        Компания: {report.company_name}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(report.created_at), {
                          addSuffix: true,
                          locale: ru
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        {formatFileSize(report.file_size)}
                      </span>
                      {report.downloaded_count > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Скачан {report.downloaded_count} раз
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(report.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить запись из истории?</AlertDialogTitle>
            <AlertDialogDescription>
              Запись о PDF отчете будет удалена из локальной истории.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
