import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Loader2, Search, AlertTriangle, Globe } from 'lucide-react';

/**
 * Аудит больших сайтов через локальный движок (scripts/audit-server.cjs).
 * Обходит CPU-лимиты edge: реальный обход тысяч страниц (sitemap/BFS).
 * Требует запущенного сервиса: `node scripts/audit-server.cjs` (по умолчанию :8090).
 */

const SERVICE_URL = (import.meta as any).env?.VITE_AUDIT_SERVICE_URL || 'http://localhost:8090';

const ISSUE_NAMES: Record<string, string> = {
  missing_title: 'Нет title', bad_title_len: 'Длина title вне 10–65', dup_title: 'Дубли title',
  missing_desc: 'Нет description', missing_h1: 'Нет H1', missing_canonical: 'Нет canonical',
  missing_og: 'Нет og:image', thin: 'Тонкий контент (<250 слов)', no_jsonld: 'Нет JSON-LD',
};
const col = (v: number) => (v >= 80 ? '#22c55e' : v >= 60 ? '#f5a623' : '#ef4444');

interface AuditData {
  site: string; scanned: number; duration_sec: number;
  scores: { global: number; seo: number; content: number; technical: number; social: number };
  issues_count: Record<string, number>; issues_pct: Record<string, number>;
}

const BigSiteAudit: React.FC = () => {
  const [url, setUrl] = useState('');
  const [max, setMax] = useState('2000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditData | null>(null);

  const runAudit = async () => {
    if (!/^https?:\/\//.test(url.trim())) { setError('Укажите URL с http:// или https://'); return; }
    setLoading(true); setError(null); setData(null);
    try {
      const r = await fetch(`${SERVICE_URL}/api/audit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), max: Number(max) }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'Ошибка аудита');
      if (!j.data || j.data.scores == null || j.data.error) {
        throw new Error(j.data?.error || 'Сайт недоступен для обхода (0 страниц)');
      }
      setData(j.data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(/Failed to fetch|NetworkError/i.test(msg)
        ? `Сервис аудита недоступен. Запустите: node scripts/audit-server.cjs (${SERVICE_URL})`
        : msg);
    } finally {
      setLoading(false);
    }
  };

  const bars: [string, number][] = data
    ? [['SEO', data.scores.seo], ['Контент', data.scores.content], ['Технический', data.scores.technical], ['Соцсети', data.scores.social]]
    : [];
  const rows = data ? Object.entries(data.issues_count).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]) : [];

  return (
    <Layout>
      <SEO
        title="Аудит больших сайтов | SeoMarket"
        description="Реальный SEO-аудит крупных сайтов (тысячи страниц) через локальный движок без ограничений."
        canonicalUrl="/big-audit"
        keywords="аудит большого сайта, краулер, массовый SEO анализ"
      />
      <div className="container mx-auto px-4 pt-32 pb-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Аудит больших сайтов</h1>
        <p className="text-muted-foreground mb-8">
          Реальный обход тысяч страниц (sitemap или ссылки) локальным движком — без ограничений edge.
        </p>

        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <Input placeholder="https://ваш-сайт.ру" value={url} onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runAudit()} className="flex-1" />
            <select value={max} onChange={(e) => setMax(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="500">до 500 стр.</option>
              <option value="2000">до 2000 стр.</option>
              <option value="5000">до 5000 стр.</option>
            </select>
            <Button onClick={runAudit} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? 'Обход…' : 'Аудитировать'}
            </Button>
          </CardContent>
        </Card>

        {loading && (
          <p className="text-sm text-muted-foreground flex items-center gap-2 mb-6">
            <Loader2 className="h-4 w-4 animate-spin" /> Идёт реальный обход сайта — большие сайты занимают несколько минут…
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3 mb-6">
            <AlertTriangle className="h-5 w-5 text-destructive flex-none mt-0.5" />
            <div className="text-sm text-destructive">{error}</div>
          </div>
        )}

        {data && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Результат</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6 items-center mb-5">
                <div className="flex h-28 w-28 flex-none flex-col items-center justify-center rounded-full"
                  style={{ border: `9px solid ${col(data.scores.global)}` }}>
                  <span className="text-3xl font-bold" style={{ color: col(data.scores.global) }}>{data.scores.global}</span>
                  <span className="text-xs text-muted-foreground">из 100</span>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {bars.map(([l, v]) => (
                    <div key={l} className="flex items-center gap-3">
                      <span className="w-28 text-sm text-muted-foreground">{l}</span>
                      <Progress value={v} className="flex-1" />
                      <span className="w-8 text-right text-sm font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-4">
                <Globe className="h-3.5 w-3.5" /> Обойдено {data.scanned} страниц за {data.duration_sec} с · {data.site}
              </p>
              <h3 className="font-semibold mb-2">Проблемы</h3>
              {rows.length === 0 ? (
                <p className="text-sm text-green-500">Проблем не найдено 🎉</p>
              ) : (
                <div className="divide-y divide-border">
                  {rows.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-2 text-sm">
                      <span>{ISSUE_NAMES[k] || k}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-muted-foreground">{data.issues_pct[k]}%</span>
                        <span className="font-semibold w-10 text-right">{v}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BigSiteAudit;
