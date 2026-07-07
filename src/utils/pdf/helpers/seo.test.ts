import { describe, it, expect } from 'vitest';
import { calculateSeoHealthScore, getIssueImpactLevel, getRecommendationPriority } from './seo';

describe('calculateSeoHealthScore', () => {
  it('is 100 with no issues', () => {
    expect(calculateSeoHealthScore(0, 0, 0)).toBe(100);
  });
  it('applies weighted penalties (10/4/1)', () => {
    expect(calculateSeoHealthScore(1, 0, 0)).toBe(90);
    expect(calculateSeoHealthScore(0, 1, 0)).toBe(96);
    expect(calculateSeoHealthScore(0, 0, 1)).toBe(99);
    expect(calculateSeoHealthScore(2, 1, 1)).toBe(75);
  });
  it('never drops below 0 even with many issues', () => {
    expect(calculateSeoHealthScore(100, 0, 0)).toBe(0);
  });
  it('respects a custom base score', () => {
    expect(calculateSeoHealthScore(1, 0, 0, 50)).toBe(40);
    expect(calculateSeoHealthScore(10, 0, 0, 50)).toBe(0);
  });
});

describe('getIssueImpactLevel', () => {
  it('maps numeric impact to buckets', () => {
    expect(getIssueImpactLevel(95)).toBe('Критический');
    expect(getIssueImpactLevel(75)).toBe('Высокий');
    expect(getIssueImpactLevel(50)).toBe('Средний');
    expect(getIssueImpactLevel(10)).toBe('Низкий');
  });
  it('maps known string levels', () => {
    expect(getIssueImpactLevel('high')).toBe('Высокий');
    expect(getIssueImpactLevel('medium')).toBe('Средний');
    expect(getIssueImpactLevel('low')).toBe('Низкий');
  });
  it('returns the original string for unknown levels', () => {
    expect(getIssueImpactLevel('whatever')).toBe('whatever');
  });
});

describe('getRecommendationPriority', () => {
  it('maps known types', () => {
    expect(getRecommendationPriority('critical')).toBe('Требуется немедленное исправление');
    expect(getRecommendationPriority('high')).toBe('Высокий приоритет');
    expect(getRecommendationPriority('low')).toBe('Низкий приоритет');
  });
  it('falls back for unknown types', () => {
    expect(getRecommendationPriority('mystery')).toBe('Стандартный приоритет');
  });
});
