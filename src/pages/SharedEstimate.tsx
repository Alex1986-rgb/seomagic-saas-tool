import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Eye, Download, FileSpreadsheet, Share2, AlertCircle } from 'lucide-react';
import { OptimizationItem } from '@/types/audit/optimization-types';
import { useToast } from '@/hooks/use-toast';
import { exportEstimateToExcel, downloadBlob, generateEstimateFilename } from '@/utils/export/estimateExporter';

interface SharedEstimateData {
  estimate_data: OptimizationItem[];
  totals: {
    subtotal: number;
    discount: number;
    final: number;
  };
  url: string;
  expires_at: string | null;
  max_views: number | null;
  views_count: number;
  password_hash: string | null;
}

const SharedEstimate: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<SharedEstimateData | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEstimate();
  }, [token]);

  const loadEstimate = async (passwordAttempt?: string) => {
    if (!token) {
      setError('Неверная ссылка');
      setIsLoading(false);
      return;
    }

    try {
      const { data: estimate, error: fetchError } = await supabase
        .from('shared_estimates')
        .select('estimate_data, totals, url, expires_at, max_views, views_count, password_hash, is_active')
        .eq('share_token', token)
        .single();

      if (fetchError) throw new Error('Смета не найдена');
      if (!estimate.is_active) throw new Error('Ссылка больше не активна');

      // Check expiration
      if (estimate.expires_at && new Date(estimate.expires_at) < new Date()) {
        throw new Error('Срок действия ссылки истек');
      }

      // Check max views
      if (estimate.max_views && estimate.views_count >= estimate.max_views) {
        throw new Error('Превышен лимит просмотров');
      }

      // Check password
      if (estimate.password_hash) {
        if (!passwordAttempt) {
          setRequiresPassword(true);
          setIsLoading(false);
          return;
        }

        // Hash provided password
        const encoder = new TextEncoder();
        const data = encoder.encode(passwordAttempt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const passwordHash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        if (passwordHash !== estimate.password_hash) {
          throw new Error('Неверный пароль');
        }
      }

      // Increment view count
      await supabase
        .from('shared_estimates')
        .update({ views_count: estimate.views_count + 1 })
        .eq('share_token', token);

      setData({
        estimate_data: estimate.estimate_data as unknown as OptimizationItem[],
        totals: estimate.totals as any,
        url: estimate.url,
        expires_at: estimate.expires_at,
        max_views: estimate.max_views,
        views_count: estimate.views_count,
        password_hash: estimate.password_hash
      });
      setRequiresPassword(false);
      setError(null);
    } catch (err: any) {
      console.error('Error loading estimate:', err);
      setError(err.message || 'Не удалось загрузить смету');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    loadEstimate(password);
  };

  const handleExportExcel = async () => {
    if (!data) return;
    
    try {
      const blob = await exportEstimateToExcel(data.estimate_data, data.totals, data.url);
      const filename = generateEstimateFilename(data.url, 'xlsx');
      downloadBlob(blob, filename);
      
      toast({
        title: 'Экспортировано',
        description: 'Смета сохранена в Excel'
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось экспортировать смету',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Ошибка доступа</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/')}>
            На главную
          </Button>
        </Card>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="text-center space-y-2 mb-6">
              <Lock className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-xl font-semibold">Защищенная смета</h2>
              <p className="text-sm text-muted-foreground">
                Для просмотра введите пароль
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full" disabled={!password}>
              <Lock className="h-4 w-4 mr-2" />
              Открыть смету
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const categoryTotals = data.estimate_data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { count: 0, cost: 0 };
    }
    acc[item.category].count += item.count;
    acc[item.category].cost += item.cost * item.count;
    return acc;
  }, {} as Record<string, { count: number; cost: number }>);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Смета на SEO-оптимизацию</h1>
              <p className="text-muted-foreground">{data.url}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Просмотров: {data.views_count}
                {data.max_views && ` / ${data.max_views}`}
              </p>
              {data.expires_at && (
                <p>Действует до: {new Date(data.expires_at).toLocaleDateString('ru-RU')}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleExportExcel} variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Скачать Excel
            </Button>
            <Button variant="outline" onClick={() => navigate(`/?url=${encodeURIComponent(data.url)}`)}>
              <Share2 className="h-4 w-4 mr-2" />
              Заказать оптимизацию
            </Button>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Итоговая стоимость</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span className="text-muted-foreground">Всего работ:</span>
              <span className="font-medium">{data.totals.subtotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            {data.totals.discount > 0 && (
              <div className="flex justify-between text-lg text-green-600">
                <span>Скидка:</span>
                <span>-{data.totals.discount.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold pt-2 border-t">
              <span>К оплате:</span>
              <span className="text-primary">{data.totals.final.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </Card>

        {/* By Category */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Работы по категориям</h2>
          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([category, categoryData]) => (
              <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{category}</p>
                  <p className="text-sm text-muted-foreground">
                    {categoryData.count} {categoryData.count === 1 ? 'работа' : 'работ'}
                  </p>
                </div>
                <p className="text-lg font-semibold">
                  {categoryData.cost.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Detailed Items */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Детализация работ</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Категория</th>
                  <th className="text-left py-2 px-2">Тип работы</th>
                  <th className="text-center py-2 px-2">Кол-во</th>
                  <th className="text-right py-2 px-2">Цена</th>
                  <th className="text-right py-2 px-2">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {data.estimate_data.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-2 text-sm">{item.category}</td>
                    <td className="py-2 px-2 text-sm">{item.type}</td>
                    <td className="py-2 px-2 text-center text-sm">{item.count}</td>
                    <td className="py-2 px-2 text-right text-sm">{item.cost.toLocaleString('ru-RU')} ₽</td>
                    <td className="py-2 px-2 text-right text-sm font-medium">
                      {(item.cost * item.count).toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Создано в SEO Audit Tool</p>
        </div>
      </div>
    </div>
  );
};

export default SharedEstimate;