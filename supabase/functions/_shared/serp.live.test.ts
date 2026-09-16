import { describe, expect, it, beforeAll } from 'vitest';

const user = process.env.XMLRIVER_USER;
const key = process.env.XMLRIVER_KEY;

// Модуль написан под Deno; для живой проверки подкладываем его интерфейс окружения.
(globalThis as any).Deno = {
  env: { get: (name: string) => process.env[name] },
};

let serp: typeof import('./serp.ts');
beforeAll(async () => { serp = await import('./serp.ts'); });

describe.runIf(user && key)('живая выдача XMLRiver через fetchSerp', () => {
  it('Google: добирает глубину постранично', async () => {
    const res = await serp.fetchSerp({ engine: 'google', query: 'редукторы червячные купить', region: 'ru', depth: 30 });
    console.log('Google: получено', res.urls.length, 'позиций, поставщик', res.provider);
    console.log('  1-3:', res.urls.slice(0, 3));
    console.log('  позиции 11-13 (вторая страница):', res.urls.slice(10, 13));
    console.log('  zavod-red.ru →', serp.findDomainPosition(res.urls, 'zavod-red.ru'));
    expect(res.urls.length).toBeGreaterThan(15);
    expect(new Set(res.urls).size).toBe(res.urls.length); // страницы не дублируются
  }, 180_000);

  it('Яндекс: выдача первой страницы', async () => {
    const res = await serp.fetchSerp({ engine: 'yandex', query: 'редукторы червячные купить', region: '213', depth: 10 });
    console.log('Яндекс: получено', res.urls.length, '| ссылка на выдачу:', res.searchUrl);
    console.log('  zavod-red.ru →', serp.findDomainPosition(res.urls, 'zavod-red.ru'));
    expect(res.urls.length).toBeGreaterThan(5);
  }, 120_000);
});
