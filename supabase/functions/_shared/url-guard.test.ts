import { describe, expect, it } from 'vitest';
import {
  assertPublicUrl,
  assertPublicUrlResolved,
  isPrivateAddress,
  isPublicUrl,
  isPublicUrlResolved,
  UnsafeUrlError,
} from './url-guard.ts';

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

  it('не обманывается точкой на конце имени', () => {
    for (const url of ['http://localhost./', 'http://server.local./', 'http://127.0.0.1./']) {
      expect(() => assertPublicUrl(url), url).toThrow(UnsafeUrlError);
    }
    // Обычный сайт с точкой на конце остаётся обычным сайтом.
    expect(isPublicUrl('http://example.com./')).toBe(true);
  });

  it('видит IPv4, спрятанный внутри IPv6', () => {
    for (const url of [
      'http://[::ffff:127.0.0.1]/',
      'http://[::ffff:a9fe:a9fe]/', // 169.254.169.254
      'http://[64:ff9b::a00:1]/', // NAT64 → 10.0.0.1
      'http://[2002:c0a8:101::]/', // 6to4 → 192.168.1.1
      'http://[::]/',
      'http://[fd00::1]/',
      'http://[fe80::1]/',
    ]) {
      expect(() => assertPublicUrl(url), url).toThrow(UnsafeUrlError);
    }
    expect(isPublicUrl('http://[::ffff:8.8.8.8]/')).toBe(true);
    expect(isPublicUrl('https://[2a00:1450:4010:c05::64]/')).toBe(true);
  });

  it('узнаёт внутренние адреса в ответе DNS', () => {
    expect(isPrivateAddress('10.1.2.3')).toBe(true);
    expect(isPrivateAddress('::ffff:10.0.0.1')).toBe(true);
    expect(isPrivateAddress('93.184.216.34')).toBe(false);
    expect(isPrivateAddress('2606:4700::6810:84e5')).toBe(false);
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

describe('проверка имени через DNS', () => {
  it('не пускает имя, которое разворачивается во внутренний адрес', async () => {
    const resolve = async () => ['127.0.0.1'];
    await expect(assertPublicUrlResolved('http://127.0.0.1.nip.io/', resolve)).rejects.toThrow(UnsafeUrlError);
    expect(await isPublicUrlResolved('http://attacker.example/', async () => ['93.184.216.34', '::ffff:169.254.169.254'])).toBe(false);
  });

  it('пропускает имя с публичными адресами', async () => {
    expect(await isPublicUrlResolved('https://example.com/', async () => ['93.184.216.34', '2606:2800:220:1::'])).toBe(true);
  });

  it('при сбое DNS не блокирует и не падает', async () => {
    expect(await isPublicUrlResolved('https://example.com/', async () => { throw new Error('SERVFAIL'); })).toBe(true);
    expect(await isPublicUrlResolved('https://example.com/', async () => [])).toBe(true);
  });

  it('проверку записи адреса DNS не отменяет', async () => {
    expect(await isPublicUrlResolved('http://localhost./', async () => ['93.184.216.34'])).toBe(false);
  });
});
