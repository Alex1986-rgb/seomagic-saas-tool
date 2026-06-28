import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI gateway error: ${response.status} ${err.slice(0, 200)}`);
    }

    const data = await response.json();
    let raw = data.choices?.[0]?.message?.content || '';
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
