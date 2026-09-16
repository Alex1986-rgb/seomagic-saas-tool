import { describe, expect, it } from 'vitest';
import { assertPublicUrl, isPublicUrl, UnsafeUrlError } from './url-guard.ts';

describe('проверка адреса перед аудитом', () => {
  it('пропускает обычный сайт', () => {
    expect(assertPublicUrl('https://zavod-red.ru/catalog').hostname).toBe('zavod-red.ru');
    expect(isPublicUrl('http://example.com')).toBe(true);
    expect(isPublicUrl('https://sub.domain.example.org:8443/page?a=1')).toBe(true);
  });

  it('не пускает во внутреннюю сеть', () => {
    for (const url of [
      'http://localhost:3000',
      'http://127.0.0.1/admin',
      'http://10.0.0.5',
      'http://192.168.1.1',
      'http://172.16.0.1',
      'http://169.254.169.254/latest/meta-data/',
      'http://[::1]/',
      'http://metadata.google.internal/',
      'http://server.local',
    ]) {
      expect(() => assertPublicUrl(url), url).toThrow(UnsafeUrlError);
    }
  });

  it('не пускает чужие схемы и мусор', () => {
    expect(() => assertPublicUrl('file:///etc/passwd')).toThrow(UnsafeUrlError);
    expect(() => assertPublicUrl('ftp://example.com')).toThrow(UnsafeUrlError);
    expect(() => assertPublicUrl('не адрес вовсе')).toThrow(UnsafeUrlError);
  });

  it('не пускает на служебные порты', () => {
    expect(() => assertPublicUrl('http://example.com:22')).toThrow(UnsafeUrlError);
    expect(() => assertPublicUrl('http://example.com:5432')).toThrow(UnsafeUrlError);
  });

  it('требует имя сайта целиком', () => {
    expect(() => assertPublicUrl('http://intranet')).toThrow(UnsafeUrlError);
  });
});
