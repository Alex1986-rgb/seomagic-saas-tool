import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate-limit через SECURITY DEFINER функцию (#2): защищает платный AI-ключ от abuse,
// не требуя авторизации. Возвращает true, если запрос в пределах лимита.
async function withinLimit(identifier: string, endpoint: string, limit: number, windowSec: number): Promise<boolean> {
  try {
    const sb = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    const { data, error } = await sb.rpc('check_rate_limit', {
      p_identifier: identifier, p_endpoint: endpoint, p_limit: limit, p_window_seconds: windowSec,
    });
    if (error) { console.error('rate-limit rpc error:', error.message); return true; } // не блокируем при сбое лимитера
    return data !== false;
  } catch (e) {
    console.error('rate-limit exception:', e); return true;
  }
}

interface SeoTextRequest {
  topic: string;              // тема/H1 страницы или название товара
  url?: string;
  existingContent?: string;   // текущий текст страницы (если есть)
  keywords?: string[];        // ключевые слова
  length?: number;            // целевая длина, символов (≈10000)
  tables?: number;            // число SEO-таблиц
  mode?: 'auto' | 'create' | 'rewrite' | 'extend';
  ecommerce?: boolean;        // режим интернет-магазина (описания товаров)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const {
      topic, url, existingContent = '', keywords = [],
      length = 10000, tables = 2, mode = 'auto', ecommerce = false,
    }: SeoTextRequest = await req.json();

    if (!topic) throw new Error('topic is required');

    // Rate-limit (#2): на IP — 10 запросов/час; глобально — 300/сутки (защита платного ключа).
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
    const okIp = await withinLimit(ip, 'seo-text-generate', 10, 3600);
    const okGlobal = await withinLimit('global', 'seo-text-generate', 300, 86400);
    if (!okIp || !okGlobal) {
      return new Response(
        JSON.stringify({ success: false, error: 'Превышен лимит запросов генерации. Попробуйте позже.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');

    const hasContent = existingContent.trim().length > 50;
    const effectiveMode = mode === 'auto' ? (hasContent ? 'rewrite' : 'create') : mode;

    const modeInstruction = {
      create: 'Создай новый SEO-текст с нуля.',
      rewrite: 'Перепиши и улучши существующий текст, сохранив фактуру и смысл, убрав переспам и воду.',
      extend: 'Дополни существующий текст недостающими разделами, не дублируя уже написанное.',
    }[effectiveMode];

    const ecommerceBlock = ecommerce
      ? 'Это страница интернет-магазина: добавь продающее описание товара/категории, преимущества, сценарии применения, а одну из таблиц сделай таблицей характеристик/параметров.'
      : '';

    const system = 'Ты — профессиональный SEO-копирайтер для русскоязычных сайтов. Пишешь экспертно, естественно, без переспама и «воды», с учётом семантики и интента.';

    const prompt = `Задача: подготовить SEO-текстовый блок для низа страницы.

Тема страницы: ${topic}
${url ? `URL: ${url}` : ''}
${keywords.length ? `Ключевые слова (использовать естественно): ${keywords.join(', ')}` : ''}
${hasContent ? `Существующий контент страницы:\n"""${existingContent.slice(0, 4000)}"""` : 'Существующего текста нет.'}

Действие: ${modeInstruction}
${ecommerceBlock}

Требования к результату:
- Объём полного текста: примерно ${length} символов.
- Структура: вступительный абзац (intro, 1 абзац, 200–300 символов, без таблиц) + развёрнутый текст с подзаголовками <h3>, абзацами <p> и маркированными списками <ul><li>.
- Ровно ${tables} информативные SEO-таблицы (<table><thead><tr><th>…</th></tr></thead><tbody>…</tbody></table>): сравнение, характеристики, цены или критерии выбора по теме.
- Качество: классическая тошнота ≤ 7, академическая ≤ 9, водность 15–50%, без переспама ключами, текст полезный для читателя.
- Язык русский. Без воды и канцелярита.

Верни СТРОГО валидный JSON без markdown-обёртки:
{"heading":"<H2 заголовок блока>","intro":"<вступительный абзац, plain text>","bodyHtml":"<полный текст в HTML: h3/p/ul/table>"}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        temperature: 0.7,
        system,
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${response.status} ${err.slice(0, 200)}`);
    }

    const data = await response.json();
    let raw = data.content?.[0]?.text || '';
    // Снимаем возможную markdown-обёртку ```json ... ```
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let result: any;
    try { result = JSON.parse(raw); }
    catch {
      // Фолбэк: если модель вернула не JSON — кладём всё в bodyHtml
      result = { heading: topic, intro: '', bodyHtml: raw };
    }

    return new Response(JSON.stringify({
      success: true,
      mode: effectiveMode,
      heading: result.heading || topic,
      intro: result.intro || '',
      bodyHtml: result.bodyHtml || '',
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('seo-text-generate error:', error instanceof Error ? error.stack : error);
    return new Response(JSON.stringify({ success: false, error: 'Ошибка генерации SEO-текста' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
