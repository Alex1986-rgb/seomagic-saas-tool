import { supabase } from '@/integrations/supabase/client';

export interface RealPositionParams {
  domain: string;
  keyword: string;
  searchEngine?: string;
  region?: string;
  language?: string;
}

export interface RealPositionResult {
  /** true when the SERP provider (DataForSEO) is configured on the backend. */
  configured: boolean;
  /** true when the lookup succeeded. */
  success: boolean;
  /** 1-based position, or 0 if not found / unavailable. */
  position: number;
  url?: string | null;
}

/**
 * Ask the `position-check` edge function for a real SERP position.
 *
 * This never throws: on any error, or when the backend has no DataForSEO
 * credentials, it returns { configured: false, success: false, position: 0 }
 * so callers can fall back to their local estimate.
 */
export async function fetchRealPosition(
  params: RealPositionParams
): Promise<RealPositionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('position-check', {
      body: {
        domain: params.domain,
        keyword: params.keyword,
        searchEngine: params.searchEngine === 'yandex' ? 'yandex' : 'google',
        region: params.region || 'Russia',
        language: params.language || 'ru',
      },
    });

    if (error || !data) {
      return { configured: false, success: false, position: 0 };
    }

    if (!data.configured) {
      return { configured: false, success: false, position: 0 };
    }

    return {
      configured: true,
      success: !!data.success,
      position: typeof data.position === 'number' ? data.position : 0,
      url: data.url ?? null,
    };
  } catch (err) {
    console.warn('fetchRealPosition failed, falling back to estimate:', err);
    return { configured: false, success: false, position: 0 };
  }
}
