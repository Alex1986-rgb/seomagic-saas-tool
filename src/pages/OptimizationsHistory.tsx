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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, Eye, RefreshCw, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface OptimizationJob {
  id: string;
  task_id: string;
  status: string;
  cost: number;
  created_at: string;
  updated_at: string;
  result_data: any;
  audit_tasks?: {
    url: string;
  };
}

export default function OptimizationsHistory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [optimizations, setOptimizations] = useState<OptimizationJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptimization, setSelectedOptimization] = useState<OptimizationJob | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadOptimizations();
  }, []);

  const loadOptimizations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('optimization_jobs')
        .select(`
          *,
          audit_tasks!inner(url)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setOptimizations(data || []);
    } catch (error) {
      console.error('Error loading optimizations:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить историю оптимизаций',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOptimizations = optimizations.filter(opt => {
    const url = opt.audit_tasks?.url || '';
    const matchesSearch = url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || opt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      queued: { variant: 'secondary', label: 'В очереди' },
      processing: { variant: 'default', label: 'Обработка' },
      completed: { variant: 'default', label: 'Завершено' },
      failed: { variant: 'destructive', label: 'Ошибка' },
    };

    const config = variants[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewDetails = (optimization: OptimizationJob) => {
    setSelectedOptimization(optimization);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          История оптимизаций
        </h1>
        <p className="text-muted-foreground">
          Просмотр всех AI оптимизаций и их результатов
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Всего</p>
            <p className="text-2xl font-bold">{optimizations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Завершено</p>
            <p className="text-2xl font-bold text-green-600">
              {optimizations.filter(o => o.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">В процессе</p>
            <p className="text-2xl font-bold text-primary">
              {optimizations.filter(o => ['queued', 'processing'].includes(o.status)).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Общая стоимость</p>
            <p className="text-2xl font-bold">
              ${optimizations.reduce((sum, o) => sum + (o.cost || 0), 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={loadOptimizations}
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
          <CardTitle>Оптимизации ({filteredOptimizations.length})</CardTitle>
          <CardDescription>
            История всех AI оптимизаций с использованием Lovable AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredOptimizations.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Страниц</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead>Создана</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOptimizations.map((opt) => (
                    <TableRow key={opt.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {opt.audit_tasks?.url || 'N/A'}
                      </TableCell>
                      <TableCell>{getStatusBadge(opt.status)}</TableCell>
                      <TableCell>
                        {opt.result_data?.optimized_pages || 0} / {opt.result_data?.total_pages || 0}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${(opt.cost || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(opt.created_at), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(opt)}
                          disabled={opt.status !== 'completed'}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Детали
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Оптимизации не найдены' : 'У вас пока нет оптимизаций'}
              </p>
              <Button onClick={() => navigate('/optimization-test')}>
                Запустить оптимизацию
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Результаты AI оптимизации</DialogTitle>
            <DialogDescription>
              {selectedOptimization?.audit_tasks?.url}
            </DialogDescription>
          </DialogHeader>

          {selectedOptimization?.result_data && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Оптимизировано</p>
                    <p className="text-2xl font-bold">
                      {selectedOptimization.result_data.optimized_pages}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Улучшение</p>
                    <p className="text-2xl font-bold text-green-600">
                      +{selectedOptimization.result_data.estimated_score_improvement}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Стоимость</p>
                    <p className="text-2xl font-bold">
                      ${selectedOptimization.result_data.total_cost?.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Improvements */}
              {selectedOptimization.result_data.improvements?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">
                    AI Рекомендации ({selectedOptimization.result_data.improvements.length})
                  </h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {selectedOptimization.result_data.improvements.map((imp: any, idx: number) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <p className="font-medium text-sm mb-2 truncate">{imp.url}</p>
                          <div className="bg-muted/50 rounded p-3">
                            <p className="text-sm whitespace-pre-wrap">
                              {imp.recommendations}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
