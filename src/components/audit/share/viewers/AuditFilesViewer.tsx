import { useState, useEffect } from 'react';
import { FileText, Download, Eye, FileArchive, FileJson, FileCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditFile {
  id: string;
  file_type: string;
  file_url: string;
  file_size: number | null;
  created_at: string | null;
}

interface AuditFilesViewerProps {
  auditId: string;
}

export const AuditFilesViewer = ({ auditId }: AuditFilesViewerProps) => {
  const [files, setFiles] = useState<AuditFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState<AuditFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadFiles();
  }, [auditId]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_files')
        .select('*')
        .eq('audit_id', auditId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить файлы",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (file: AuditFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('audit-reports')
        .download(file.file_url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.file_url.split('/').pop() || 'file';
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Файл скачан",
        description: `${file.file_type} успешно скачан`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось скачать файл",
        variant: "destructive"
      });
    }
  };

  const viewFile = async (file: AuditFile) => {
    if (!isViewable(file.file_type)) return;

    try {
      const { data, error } = await supabase.storage
        .from('audit-reports')
        .download(file.file_url);

      if (error) throw error;

      const text = await data.text();
      setFileContent(text);
      setViewingFile(file);
    } catch (error) {
      console.error('Error viewing file:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось открыть файл",
        variant: "destructive"
      });
    }
  };

  const isViewable = (fileType: string) => {
    return ['sitemap_xml', 'audit_json', 'error_report'].includes(fileType);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'sitemap_xml':
        return <FileCode className="h-5 w-5 text-blue-500" />;
      case 'audit_json':
        return <FileJson className="h-5 w-5 text-green-500" />;
      case 'audit_pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'html_archive':
        return <FileArchive className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getFileLabel = (fileType: string) => {
    const labels: Record<string, string> = {
      sitemap_xml: 'Sitemap XML',
      audit_json: 'JSON отчет',
      audit_pdf: 'PDF отчет',
      html_archive: 'HTML архив',
      error_report: 'Отчет об ошибках'
    };
    return labels[fileType] || fileType;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const groupedFiles = files.reduce((acc, file) => {
    const type = file.file_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(file);
    return acc;
  }, {} as Record<string, AuditFile[]>);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Сгенерированные файлы ({files.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Загрузка...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Нет сгенерированных файлов</div>
          ) : (
            <ScrollArea className="h-96">
              <div className="grid gap-4">
                {Object.entries(groupedFiles).map(([type, typeFiles]) => (
                  <Card key={type}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getFileIcon(type)}
                        {getFileLabel(type)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {typeFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 border rounded hover:bg-accent/50 transition-colors"
                        >
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {formatBytes(file.file_size || 0)}
                              {file.created_at && (
                                <> • {new Date(file.created_at).toLocaleString()}</>
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {isViewable(file.file_type) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewFile(file)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => downloadFile(file)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {viewingFile && getFileLabel(viewingFile.file_type)}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <pre className="text-xs p-4 bg-muted rounded">
              {fileContent || 'Загрузка...'}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
