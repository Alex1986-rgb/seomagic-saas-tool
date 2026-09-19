import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, FileText, ExternalLink, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Аудиты всех пользователей.
 *
 * Раньше таблица показывала пять выдуманных строк с несуществующими людьми.
 * Теперь это реальные записи: администратору их отдаёт RLS-политика
 * «Admins can view all audits», обычный пользователь сюда не попадает.
 */

interface AdminAuditRow {
  id: string;
  url: string;
  seoScore: number | null;
  status: string;
  createdAt: string | null;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
}

const statusLabels: Record<string, string> = {
  pending: 'В ожидании',
  scanning: 'Сканирование',
  processing: 'Обрабатывается',
  completed: 'Завершён',
  failed: 'Ошибка',
  cancelled: 'Отменён',
};

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' {
  if (status === 'completed') return 'default';
  if (status === 'failed') return 'destructive';
  return 'secondary';
}

function scoreColor(score: number | null): string {
  if (score === null) return 'text-muted-foreground';
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

const AdminAudits: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [audits, setAudits] = useState<AdminAuditRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: auditsError } = await supabase
        .from('audits')
        .select('id, url, seo_score, status, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(200);

      if (auditsError) throw auditsError;

      // Почта владельца лежит в profiles — подтягиваем одним запросом на всех.
      const userIds = [...new Set((data ?? []).map((row) => row.user_id).filter(Boolean))] as string[];
      const profiles = new Map<string, { email: string | null; full_name: string | null }>();

      if (userIds.length > 0) {
        const { data: profileRows } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        for (const profile of profileRows ?? []) {
          profiles.set(profile.id, { email: profile.email, full_name: profile.full_name });
        }
      }

      setAudits((data ?? []).map((row) => ({
        id: row.id,
        url: row.url,
        seoScore: row.seo_score,
        status: row.status,
        createdAt: row.created_at,
        userId: row.user_id,
        userEmail: row.user_id ? profiles.get(row.user_id)?.email ?? null : null,
        userName: row.user_id ? profiles.get(row.user_id)?.full_name ?? null : null,
      })));
    } catch (err) {
      console.error('Не удалось загрузить аудиты:', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить аудиты');
      setAudits([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredAudits = useMemo(() => audits.filter((audit) => {
    const haystack = [audit.url, audit.userEmail, audit.userName].filter(Boolean).join(' ').toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [audits, searchTerm, statusFilter]);

  const exportCsv = () => {
    if (filteredAudits.length === 0) {
      toast({ title: 'Нечего выгружать', description: 'В выборке нет аудитов' });
      return;
    }

    const rows = [
      ['URL', 'Пользователь', 'SEO балл', 'Дата', 'Статус'],
      ...filteredAudits.map((audit) => [
        audit.url,
        audit.userEmail ?? 'без входа',
        audit.seoScore === null ? '' : String(audit.seoScore),
        audit.createdAt ? new Date(audit.createdAt).toLocaleString('ru-RU') : '',
        statusLabels[audit.status] ?? audit.status,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // BOM в начале — чтобы Excel открыл кириллицу без перекодировки.
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audits-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-border">
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по URL или пользователю..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-border"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card/50 border-border">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="completed">Завершённые</SelectItem>
              <SelectItem value="scanning">Сканирование</SelectItem>
              <SelectItem value="pending">В ожидании</SelectItem>
              <SelectItem value="failed">С ошибками</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 bg-card/50 border-border" onClick={load}>
            <RefreshCw className="h-4 w-4" />
            <span>Обновить</span>
          </Button>

          <Button className="gap-2" onClick={exportCsv}>
            <FileText className="h-4 w-4" />
            <span>Экспорт CSV</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-destructive">
          Не удалось загрузить данные: {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : filteredAudits.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {audits.length === 0 ? 'Аудитов пока нет' : 'Под фильтр ничего не подошло'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">URL</th>
                <th className="text-left py-3 px-4 font-medium">Пользователь</th>
                <th className="text-left py-3 px-4 font-medium">SEO оценка</th>
                <th className="text-left py-3 px-4 font-medium">Дата</th>
                <th className="text-left py-3 px-4 font-medium">Статус</th>
                <th className="text-left py-3 px-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map((audit) => (
                <tr key={audit.id} className="border-b border-border">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a
                        href={audit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-400 truncate max-w-[280px]"
                      >
                        {audit.url}
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {audit.userEmail || audit.userName ? (
                      <div>
                        {audit.userName && <div className="font-medium">{audit.userName}</div>}
                        <div className="text-sm text-muted-foreground">{audit.userEmail}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">без входа</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {audit.seoScore === null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className={`font-bold ${scoreColor(audit.seoScore)}`}>
                        {audit.seoScore}/100
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {audit.createdAt ? new Date(audit.createdAt).toLocaleString('ru-RU') : '—'}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={statusVariant(audit.status)}>
                      {statusLabels[audit.status] ?? audit.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={audit.url} target="_blank" rel="noopener noreferrer" aria-label="Открыть сайт">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default AdminAudits;
