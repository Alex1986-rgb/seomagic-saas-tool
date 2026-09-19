import { describe, expect, it } from 'vitest';
import {
  loginErrorText,
  normalizeSiteUrl,
  parseKeywords,
  positionsLink,
  resetRequestOutcome,
  safeRedirect,
} from './helpers';

describe('safeRedirect', () => {
  it('берёт внутренний путь из Location', () => {
    expect(safeRedirect({ pathname: '/app/results', search: '?x=1', hash: '' })).toBe('/app/results?x=1');
  });
  it('не пускает на чужой сайт', () => {
    expect(safeRedirect('//evil.example/app')).toBe('/app');
    expect(safeRedirect('https://evil.example')).toBe('/app');
    expect(safeRedirect('/\\evil.example')).toBe('/app');
  });
  it('не возвращает на вход и сброс', () => {
    expect(safeRedirect('/app/login')).toBe('/app');
    expect(safeRedirect({ pathname: '/app/reset', search: '?mode=update' })).toBe('/app');
    expect(safeRedirect('/auth')).toBe('/app');
  });
  it('пустое — в кабинет', () => {
    expect(safeRedirect(undefined)).toBe('/app');
  });
});

describe('resetRequestOutcome', () => {
  it('ответ одинаковый для любых ошибок, зависящих от адреса', () => {
    expect(resetRequestOutcome(null)).toEqual({ sent: true });
    expect(resetRequestOutcome({ message: 'User not found', status: 400 })).toEqual({ sent: true });
  });
  it('частота и сеть — отдельный текст', () => {
    expect(resetRequestOutcome({ status: 429, message: 'rate limit' }).sent).toBe(false);
    expect(resetRequestOutcome({ name: 'AuthRetryableFetchError', message: 'Failed to fetch' }).sent).toBe(false);
  });
});

describe('loginErrorText', () => {
  it('переводит неверные данные', () => {
    expect(loginErrorText({ message: 'Invalid login credentials', status: 400 })).toBe('Неверная почта или пароль.');
  });
});

describe('normalizeSiteUrl', () => {
  it('добавляет https и отрезает путь', () => {
    expect(normalizeSiteUrl('mebel.ru/catalog/')).toBe('https://mebel.ru');
    expect(normalizeSiteUrl('http://www.site.ru')).toBe('http://www.site.ru');
  });
  it('отклоняет не-домены', () => {
    expect(normalizeSiteUrl('localhost')).toBeNull();
    expect(normalizeSiteUrl('не сайт')).toBeNull();
    expect(normalizeSiteUrl('')).toBeNull();
  });
});

describe('parseKeywords / positionsLink', () => {
  it('убирает пустые строки и повторы', () => {
    expect(parseKeywords('купить диван\n\n Купить  диван \nкухни')).toEqual(['купить диван', 'кухни']);
  });
  it('собирает ссылку на трекер', () => {
    const link = positionsLink('site.ru', ['a b', 'c'], 'msk');
    const params = new URLSearchParams(link.split('?')[1]);
    expect(params.get('host')).toBe('site.ru');
    expect(params.get('keywords')).toBe('a b\nc');
    expect(params.get('region')).toBe('213');
  });
});
