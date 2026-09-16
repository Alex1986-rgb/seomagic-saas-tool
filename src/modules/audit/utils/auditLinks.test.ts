import { describe, expect, it } from 'vitest';
import { auditPagePath, isSameSite, normalizeHost } from './auditLinks';

describe('normalizeHost', () => {
  it('убирает протокол, www, путь и регистр', () => {
    expect(normalizeHost('https://WWW.Shop.ru/catalog?x=1')).toBe('shop.ru');
    expect(normalizeHost('shop.ru')).toBe('shop.ru');
    expect(normalizeHost('http://shop.ru/')).toBe('shop.ru');
  });

  it('пустое значение остаётся пустым', () => {
    expect(normalizeHost('')).toBe('');
    expect(normalizeHost(null)).toBe('');
    expect(normalizeHost(undefined)).toBe('');
  });
});

describe('isSameSite', () => {
  it('не путает сайт с другим, в адресе которого он встречается', () => {
    expect(isSameSite('shop.ru', 'https://myshop.ru')).toBe(false);
    expect(isSameSite('shop.ru', 'https://shop.ru.example.com')).toBe(false);
  });

  it('считает одним сайтом адреса с www и без', () => {
    expect(isSameSite('shop.ru', 'https://www.shop.ru/blog')).toBe(true);
  });

  it('пустой адрес ни с чем не совпадает', () => {
    expect(isSameSite('', '')).toBe(false);
  });
});

describe('auditPagePath', () => {
  it('ведёт на страницу аудита с номером задачи', () => {
    const path = auditPagePath('https://shop.ru', 'task-1');
    const params = new URLSearchParams(path.split('?')[1]);
    expect(path.startsWith('/site-audit?')).toBe(true);
    expect(params.get('url')).toBe('https://shop.ru');
    expect(params.get('task_id')).toBe('task-1');
  });

  it('без задачи не добавляет пустой параметр', () => {
    const params = new URLSearchParams(auditPagePath('shop.ru').split('?')[1]);
    expect(params.has('task_id')).toBe(false);
  });
});
