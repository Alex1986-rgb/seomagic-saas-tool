import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { assertTaskAccess, AuthError } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Карта сайта клиента по результатам аудита.
 *
 * Что было не так:
 *   * адреса брались из audit_results.audit_data.pages — такого поля нет,
 *     scoring-processor кладёт туда только оценки и сводку, и карта всегда
 *     выходила пустой, хотя функция отвечала «экспорт выполнен»;
 *   * файл загружался клиентом пользователя, а политик на запись в бакет
 *     sitemaps нет — загрузка отклонялась;
 *   * адреса вставлялись в XML и HTML без экранирования: «&» в адресе ломал
 *     файл;
 *   * у каждого адреса стояла сегодняшняя дата изменения, частота и приоритет,
 *     которых никто не измерял.
 * Теперь адреса берутся из разбора страниц (page_analysis) этой задачи, и в
 * карту попадают только страницы, которые стоит отдавать поисковику: ответ
 * 200, нет запрета индексации, canonical не указывает на другую страницу.
 * Необязательные поля карты (lastmod, changefreq, priority) не заполняются —
 * данных для них у аудита нет.
 */

/** Предел протокола sitemaps.org для одного файла. */
const MAX_URLS = 50000;
/** Сколько строк читаем за один запрос: больше база за раз не отдаёт. */
const PAGE_SIZE = 1000;

/** Ошибка запроса с кодом ответа. */
class RequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Только http(s): javascript: и прочее в карту и в ссылки HTML не попадает. */
function httpUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { task_id, format } = await req.json();

    if (!task_id || !format) {
      throw new RequestError('task_id and format are required', 400);
    }

    if (format !== 'xml' && format !== 'html') {
      throw new RequestError('Unsupported format. Use xml or html', 400);
    }

    // Своя задача, гостевая или любая для администратора — как в RLS.
    await assertTaskAccess(req, task_id);

    console.log(`Exporting sitemap for task: ${task_id} in ${format} format`);

    // Доступ проверен — дальше служебным ключом: разбор страниц и запись в
    // бакет пользователю напрямую недоступны.
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const urls = new Set<string>();
    for (let from = 0; urls.size < MAX_URLS; from += PAGE_SIZE) {
      const { data: rows, error: pagesError } = await serviceClient
        .from('page_analysis')
        .select('url, final_url, status_code, is_indexable, canonical_points_to_self')
        .eq('task_id', task_id)
        .order('url', { ascending: true })
        .range(from, from + PAGE_SIZE - 1);

      if (pagesError) {
        console.error('page_analysis read error:', pagesError);
        throw new Error('Failed to read audited pages');
      }
      if (!rows || rows.length === 0) break;

      for (const row of rows) {
        if (row.status_code !== 200) continue;
        if (row.is_indexable === false) continue;
        if (row.canonical_points_to_self === false) continue;
        // После переадресации в карту идёт адрес, где страница открылась.
        const address = httpUrl(row.final_url) ?? httpUrl(row.url);
        if (address) urls.add(address);
        if (urls.size >= MAX_URLS) break;
      }

      if (rows.length < PAGE_SIZE) break;
    }

    if (urls.size === 0) {
      throw new RequestError(
        'В аудите нет страниц, которые можно включить в карту сайта (ответ 200, без запрета индексации)',
        422,
      );
    }

    const list = [...urls];

    // Generate sitemap content
    let sitemapContent: string;
    let contentType: string;
    let filename: string;

    if (format === 'xml') {
      sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list.map((url) => `  <url>
    <loc>${escapeXml(url)}</loc>
  </url>`).join('\n')}
</urlset>`;
      contentType = 'application/xml';
      filename = `sitemap-${task_id}.xml`;
    } else {
      sitemapContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Карта сайта</title>
</head>
<body>
  <h1>Карта сайта</h1>
  <ul>
${list.map((url) => `    <li><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></li>`).join('\n')}
  </ul>
</body>
</html>`;
      contentType = 'text/html';
      filename = `sitemap-${task_id}.html`;
    }

    // Save to storage
    const { data: uploadData, error: uploadError } = await serviceClient.storage
      .from('sitemaps')
      .upload(filename, sitemapContent, {
        contentType,
        upsert: true,
      });

    if (uploadError || !uploadData) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to save sitemap');
    }

    // Get public URL
    const { data: publicUrlData } = serviceClient.storage
      .from('sitemaps')
      .getPublicUrl(uploadData.path);

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrlData.publicUrl,
        storage_path: uploadData.path,
        url_count: list.length,
        message: 'Sitemap exported successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in sitemap-export:', error);
    const message = error instanceof Error ? error.message : String(error);
    const status = error instanceof AuthError || error instanceof RequestError
      ? error.status
      : message === 'Unauthorized' ? 401 : 500;

    return new Response(
      JSON.stringify({
        success: false,
        // Текст внутренней ошибки (стек, SQL, адреса) наружу не отдаём — он остаётся в логах функции.
        error: status >= 500 ? 'Internal error' : message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      }
    );
  }
});
