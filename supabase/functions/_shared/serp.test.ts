import { describe, expect, it } from 'vitest';
import { findDomainPosition, parseXmlRiverUrls } from './serp.ts';

describe('findDomainPosition', () => {
  const serp = [
    'https://competitor.com/page',
    'https://www.example.com/catalog',
    'https://other.example.com.evil.com/',
  ];

  it('возвращает место домена в выдаче, считая с единицы', () => {
    expect(findDomainPosition(serp, 'example.com')).toEqual({
      position: 2,
      url: 'https://www.example.com/catalog',
    });
  });

  it('игнорирует www и протокол в искомом домене', () => {
    expect(findDomainPosition(serp, 'https://www.example.com/').position).toBe(2);
  });

  it('засчитывает поддомены целевого домена', () => {
    expect(findDomainPosition(['https://shop.example.com/x'], 'example.com').position).toBe(1);
  });

  it('не принимает чужой домен, в котором целевой — лишь часть имени', () => {
    expect(findDomainPosition(['https://notexample.com/x'], 'example.com').position).toBe(0);
    expect(findDomainPosition(['https://example.com.evil.com/x'], 'example.com').position).toBe(0);
  });

  it('возвращает 0, когда домена в просмотренной выдаче нет', () => {
    expect(findDomainPosition(['https://competitor.com/'], 'example.com')).toEqual({ position: 0 });
  });

  it('пропускает мусорные ссылки, не роняя проверку', () => {
    expect(findDomainPosition(['не-ссылка', 'https://example.com/'], 'example.com').position).toBe(2);
  });
});

describe('parseXmlRiverUrls', () => {
  // Форма ответа снята с живого запроса к XMLRiver 14.09.2026.
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<yandexsearch version="1.0"><response><results><grouping>
  <group id="1"><doc><url>https://mosseo.ru/audit/</url><title>Аудит</title><contenttype>organic</contenttype></doc></group>
  <group id="2"><doc><url>https://ads.example.com/promo</url><title>Реклама</title><contenttype>paid</contenttype></doc></group>
  <group id="3"><doc><url>https://pr-cy.ru/audit/</url><title>Аудит онлайн</title><contenttype>organic</contenttype></doc></group>
  <group id="4"><doc><url><![CDATA[https://seranking.com/ru/audit/]]></url><title>SE Ranking</title></doc></group>
</grouping></results></response></yandexsearch>`;

  it('берёт ссылки в порядке выдачи', () => {
    expect(parseXmlRiverUrls(xml)[0]).toBe('https://mosseo.ru/audit/');
  });

  it('пропускает неорганические блоки, чтобы позиция не уезжала вниз', () => {
    const urls = parseXmlRiverUrls(xml);
    expect(urls).not.toContain('https://ads.example.com/promo');
    expect(findDomainPosition(urls, 'pr-cy.ru').position).toBe(2);
  });

  it('считает органическим блок без указанного типа и разворачивает CDATA', () => {
    expect(parseXmlRiverUrls(xml)[2]).toBe('https://seranking.com/ru/audit/');
  });

  it('возвращает пустой список на ответе без результатов', () => {
    expect(parseXmlRiverUrls('<response><error code="15">Ничего не найдено</error></response>')).toEqual([]);
  });
});
