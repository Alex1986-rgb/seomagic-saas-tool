import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SeoTextBlock, { SeoTextData } from './SeoTextBlock';
import { analyzeText, TextQuality } from '@/utils/seoTextQuality';

/** Генератор SEO-текста: форма → генерация → превью блока + метрики качества. */

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const MODES = [
  { v: 'auto', l: 'Авто (создать/переписать)' },
  { v: 'create', l: 'Создать новый' },
  { v: 'rewrite', l: 'Переписать' },
  { v: 'extend', l: 'Дополнить' },
];

const Metric: React.FC<{ label: string; value: string; bad?: boolean }> = ({ label, value, bad }) => (
  <div className="rounded-lg border border-border bg-muted/40 p-3 text-center">
    <div className={`text-lg font-bold ${bad ? 'text-destructive' : 'text-foreground'}`}>{value}</div>
    <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
  </div>
);

const SeoTextGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [existing, setExisting] = useState('');
  const [mode, setMode] = useState('auto');
  const [ecommerce, setEcommerce] = useState(false);
  const [length, setLength] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SeoTextData | null>(null);
  const [quality, setQuality] = useState<TextQuality | null>(null);

  const generate = async () => {
    if (!topic.trim()) { setError('Укажите тему страницы или название товара'); return; }
    setLoading(true); setError(null); setResult(null); setQuality(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('seo-text-generate', {
        body: {
          topic: topic.trim(),
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
          existingContent: existing.trim(),
          mode, ecommerce, length: Number(length), tables: 2,
        },
      });
      if (fnErr || !data?.success) throw new Error(data?.error || fnErr?.message || 'Ошибка генерации');
      const res: SeoTextData = { heading: data.heading, intro: data.intro, bodyHtml: data.bodyHtml };
      setResult(res);
      setQuality(analyzeText(res.intro + ' ' + stripHtml(res.bodyHtml)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(/ANTHROPIC_API_KEY|api.?key|not configured/i.test(msg)
        ? 'Сервис генерации текста не настроен — добавьте ключ в настройках, чтобы включить генерацию.'
        : msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Генерация SEO-текста</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic">Тема страницы / товар</Label>
            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Напр.: Промышленные редукторы NMRV" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="kw">Ключевые слова (через запятую)</Label>
            <Input id="kw" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="редуктор, мотор-редуктор, купить" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="ex">Существующий текст (необязательно — для переписать/дополнить)</Label>
            <Textarea id="ex" value={existing} onChange={(e) => setExisting(e.target.value)} rows={3} className="mt-1" />
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <Label htmlFor="mode">Режим</Label>
              <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)} className="mt-1 block h-10 rounded-md border border-input bg-background px-3 text-sm">
                {MODES.map((m) => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="len">Длина (символов)</Label>
              <Input id="len" type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="mt-1 w-32" />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch id="ec" checked={ecommerce} onCheckedChange={setEcommerce} />
              <Label htmlFor="ec">Интернет-магазин</Label>
            </div>
          </div>
          <Button onClick={generate} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Генерация…' : 'Сгенерировать SEO-текст'}
          </Button>
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 flex items-start gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 flex-none mt-0.5" /> {error}
            </div>
          )}
        </CardContent>
      </Card>

      {quality && (
        <Card>
          <CardHeader><CardTitle className="text-base">Качество текста</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Metric label="Символов" value={String(quality.chars)} />
              <Metric label="Тошнота классич." value={String(quality.classicNausea)} bad={quality.classicNausea > 7} />
              <Metric label="Тошнота академ." value={quality.academicNausea + '%'} bad={quality.academicNausea > 9} />
              <Metric label="Водность" value={quality.waterPercent + '%'} bad={quality.waterPercent > 60 || quality.waterPercent < 10} />
              <Metric label="Заспамленность" value={quality.spamScore + '%'} bad={quality.spamScore > 60} />
            </div>
            {quality.warnings.length > 0 && (
              <ul className="mt-3 text-sm text-amber-600 dark:text-amber-400 list-disc pl-5">
                {quality.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}
            {quality.topKeywords.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Топ-ключи: {quality.topKeywords.slice(0, 6).map((k) => `${k.word} (${k.density}%)`).join(', ')}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader><CardTitle className="text-base">Превью SEO-блока (как на странице)</CardTitle></CardHeader>
          <CardContent>
            <SeoTextBlock data={result} defaultOpen />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SeoTextGenerator;
