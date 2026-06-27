import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuditList } from '@/modules/audit/hooks/useAuditList';
import { auditService } from '@/modules/audit/services/auditService';
import { Loader2, Search, MoreVertical, Eye, Trash2, Download, RefreshCw, PlayCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { saveAs } from 'file-saver';

export default function AuditsHistory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [resumingTaskId, setResumingTaskId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { audits, isLoading, error, refetch } = useAuditList();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить историю аудитов',
        variant: 'destructive',
      });
    }
  }, [error]);

  const filteredAudits = audits?.filter(audit => {
    const matchesSearch = audit.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'secondary', label: 'В ожидании' },
      scanning: { variant: 'default', label: 'Сканирование' },
      completed: { variant: 'default', label: 'Завершен' },
      failed: { variant: 'destructive', label: 'Ошибка' },
      cancelled: { variant: 'secondary', label: 'Отменен' },
    };

    const config = variants[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewAudit = (auditId: string, url: string) => {
    navigate(`/audit?url=${encodeURIComponent(url)}`);
  };

  const handleDeleteAudit = async (auditId: string) => {
    if (!window.confirm('Удалить этот аудит? Действие необратимо.')) {
      return;
    }
    try {
      setDeletingId(auditId);
      await auditService.deleteAudit(auditId);
      toast({
        title: 'Аудит удалён',
        description: 'Запись успешно удалена из истории',
      });
      refetch();
    } catch (err: any) {
      toast({
        title: 'Ошибка удаления',
        description: err?.message || 'Не удалось удалить аудит',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadReport = async (auditId: string) => {
    try {
      setDownloadingId(auditId);
      const [audit, results, pages] = await Promise.all([
        auditService.getAudit(auditId),
        auditService.getAuditResults(auditId),
        auditService.getPageAnalysis(auditId),
      ]);

      if (!audit) {
        toast({
          title: 'Нет данных',
          description: 'Не удалось найти данные аудита для экспорта',
          variant: 'destructive',
        });
        return;
      }

      const report = {
        exportedAt: new Date().toISOString(),
        audit,
        results,
        pages,
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json',
      });
      const safeUrl = (audit.url || 'audit').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      saveAs(blob, `audit-report-${safeUrl || auditId}.json`);

      toast({
        title: 'Отчёт сформирован',
        description: 'Файл отчёта загружается',
      });
    } catch (err: any) {
      toast({
        title: 'Ошибка экспорта',
        description: err?.message || 'Не удалось сформировать отчёт',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleResumeAudit = async (auditId: string, url: string) => {
    // Find the task_id for this audit
    try {
      setResumingTaskId(auditId);
      
      // Get the task for this audit
      const { data: tasks } = await import('@/integrations/supabase/client').then(m => 
        m.supabase
          .from('audit_tasks')
          .select('id')
          .eq('audit_id', auditId)
          .order('created_at', { ascending: false })
          .limit(1)
      );

      if (!tasks || tasks.length === 0) {
        toast({
          title: 'Ошибка',
          description: 'Задача аудита не найдена',
          variant: 'destructive',
        });
        return;
      }

      const result = await auditService.resumeAudit(tasks[0].id);
      
      if (result.success) {
        toast({
          title: 'Аудит возобновлен',
          description: 'Сканирование продолжается с места остановки',
        });
        // Navigate to the audit page
        navigate(`/audit?url=${encodeURIComponent(url)}`);
      } else {
        toast({
          title: 'Ошибка возобновления',
          description: result.message || 'Не удалось возобновить аудит',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Ошибка',
        description: err.message || 'Не удалось возобновить аудит',
        variant: 'destructive',
      });
    } finally {
      setResumingTaskId(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">История аудитов</h1>
        <p className="text-muted-foreground">
          Просмотр и управление всеми выполненными аудитами
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Статус: {statusFilter === 'all' ? 'Все' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Фильтр по статусу</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  Все
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                  Завершенные
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                  В ожидании
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                  С ошибками
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Refresh */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Аудиты ({filteredAudits?.length || 0})</CardTitle>
          <CardDescription>
            Список всех выполненных аудитов с результатами
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAudits && filteredAudits.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Оценка</TableHead>
                    <TableHead>Страниц</TableHead>
                    <TableHead>Создан</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAudits.map((audit) => (
                    <TableRow key={audit.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        <a
                          href={audit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-primary"
                        >
                          {audit.url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(audit.status)}
                          {audit.status === 'failed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleResumeAudit(audit.id, audit.url)}
                              disabled={resumingTaskId === audit.id}
                            >
                              {resumingTaskId === audit.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <PlayCircle className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {audit.seo_score !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{audit.seo_score}</span>
                            <span className="text-xs text-muted-foreground">/100</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {audit.pages_scanned || 0}
                        {audit.total_pages && ` / ${audit.total_pages}`}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(audit.created_at), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewAudit(audit.id, audit.url)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Просмотр
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDownloadReport(audit.id)}
                              disabled={downloadingId === audit.id}
                            >
                              {downloadingId === audit.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="mr-2 h-4 w-4" />
                              )}
                              Скачать отчет
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteAudit(audit.id)}
                              disabled={deletingId === audit.id}
                              className="text-destructive"
                            >
                              {deletingId === audit.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Аудиты не найдены'
                  : 'У вас пока нет аудитов'}
              </p>
              <Button onClick={() => navigate('/audit')}>
                Запустить первый аудит
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
