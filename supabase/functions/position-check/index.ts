import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Real SERP position lookup via DataForSEO (Google/Yandex organic, Live Advanced).
//
// Configure these secrets in Supabase to enable it:
//   DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD
// Without them the function returns { configured: false } and the client falls
// back to its local estimate.
//
// Auth: the endpoint costs money per call, so it requires an authenticated user.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PositionRequest {
  domain: string;
  keyword: string;
  searchEngine?: 'google' | 'yandex';
  region?: string; // DataForSEO location_name, e.g. "Moscow,Russia" or "Russia"
  language?: string; // e.g. "ru"
  depth?: number; // how many results to scan (max 100)
}

function normalizeDomain(input: string): string {
  return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require an authenticated user (paid API — don't leave it open).
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const login = Deno.env.get('DATAFORSEO_LOGIN');
    const password = Deno.env.get('DATAFORSEO_PASSWORD');
    if (!login || !password) {
      // Not configured — tell the client so it can fall back gracefully.
      return new Response(
        JSON.stringify({ success: true, configured: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      domain,
      keyword,
      searchEngine = 'google',
      region = 'Russia',
      language = 'ru',
      depth = 100,
    }: PositionRequest = await req.json();

    if (!domain || !keyword) {
      throw new Error('domain and keyword are required');
    }

    const engine = searchEngine === 'yandex' ? 'yandex' : 'google';
    const endpoint = `https://api.dataforseo.com/v3/serp/${engine}/organic/live/advanced`;
    const auth = btoa(`${login}:${password}`);

    const dfsResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          keyword,
          location_name: region,
          language_code: language,
          device: 'desktop',
          depth: Math.min(Math.max(depth, 10), 100),
        },
      ]),
    });

    if (!dfsResponse.ok) {
      const text = await dfsResponse.text();
      throw new Error(`DataForSEO error ${dfsResponse.status}: ${text}`);
    }

    const payload = await dfsResponse.json();
    const items = payload?.tasks?.[0]?.result?.[0]?.items ?? [];
    const target = normalizeDomain(domain);

    let position = 0; // 0 = not found in the scanned results
    let foundUrl: string | null = null;
    for (const item of items) {
      if (item?.type !== 'organic') continue;
      const itemDomain = normalizeDomain(item?.domain || item?.url || '');
      if (itemDomain === target || itemDomain.endsWith(`.${target}`)) {
        position = item?.rank_absolute ?? item?.rank_group ?? 0;
        foundUrl = item?.url ?? null;
        break;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        configured: true,
        domain: target,
        keyword,
        searchEngine: engine,
        position,
        found: position > 0,
        url: foundUrl,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('position-check error:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
