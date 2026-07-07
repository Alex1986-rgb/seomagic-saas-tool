import { describe, it, expect, beforeEach, vi } from 'vitest';

const { invokeMock } = vi.hoisted(() => ({ invokeMock: vi.fn() }));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { functions: { invoke: invokeMock } },
}));

import { fetchRealPosition } from './serpProvider';

const params = { domain: 'example.com', keyword: 'seo', searchEngine: 'google', region: 'Russia' };

describe('fetchRealPosition', () => {
  beforeEach(() => invokeMock.mockReset());

  it('reports unconfigured (fallback) when the function errors', async () => {
    invokeMock.mockResolvedValue({ data: null, error: new Error('boom') });
    const res = await fetchRealPosition(params);
    expect(res).toEqual({ configured: false, success: false, position: 0 });
  });

  it('reports unconfigured when backend has no provider key', async () => {
    invokeMock.mockResolvedValue({ data: { success: true, configured: false }, error: null });
    const res = await fetchRealPosition(params);
    expect(res.configured).toBe(false);
  });

  it('returns the real position when configured and found', async () => {
    invokeMock.mockResolvedValue({
      data: { success: true, configured: true, position: 7, url: 'https://example.com/page' },
      error: null,
    });
    const res = await fetchRealPosition(params);
    expect(res).toEqual({ configured: true, success: true, position: 7, url: 'https://example.com/page' });
  });

  it('maps non-google engines to yandex in the request', async () => {
    invokeMock.mockResolvedValue({ data: { success: true, configured: true, position: 1 }, error: null });
    await fetchRealPosition({ ...params, searchEngine: 'yandex' });
    expect(invokeMock).toHaveBeenCalledWith('position-check', expect.objectContaining({
      body: expect.objectContaining({ searchEngine: 'yandex' }),
    }));
  });
});
