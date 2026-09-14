import { describe, expect, it } from 'vitest';
import { findDomainPosition } from './serp.ts';

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
